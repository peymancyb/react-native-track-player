import { AppRegistry, DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform, } from 'react-native';
// @ts-expect-error because resolveAssetSource is untyped
import { default as resolveAssetSource } from 'react-native/Libraries/Image/resolveAssetSource';
const { TrackPlayerModule: TrackPlayer } = NativeModules;
const emitter = Platform.OS !== 'android'
    ? new NativeEventEmitter(TrackPlayer)
    : DeviceEventEmitter;
// MARK: - Helpers
function resolveImportedPath(path) {
    if (!path)
        return undefined;
    return resolveAssetSource(path) || path;
}
// MARK: - General API
/**
 * Initializes the player with the specified options.
 */
async function setupPlayer(options = {}) {
    return TrackPlayer.setupPlayer(options || {});
}
/**
 * Register the playback service. The service will run as long as the player runs.
 */
function registerPlaybackService(factory) {
    if (Platform.OS === 'android') {
        // Registers the headless task
        AppRegistry.registerHeadlessTask('TrackPlayer', factory);
    }
    else {
        // Initializes and runs the service in the next tick
        setImmediate(factory());
    }
}
function addEventListener(event, listener) {
    return emitter.addListener(event, listener);
}
/**
 * @deprecated This method should not be used, most methods reject when service is not bound.
 */
function isServiceRunning() {
    return TrackPlayer.isServiceRunning();
}
// MARK: - Queue API
/**
 * Adds one or more tracks to the queue.
 */
async function add(tracks, insertBeforeIndex = -1) {
    console.log('TRACK_PLAYER:add', tracks, insertBeforeIndex)
    console.trace('TRACK_PLAYER:add')

    // Clone the array before modifying it
    if (Array.isArray(tracks)) {
        tracks = [...tracks];
    }
    else {
        tracks = [tracks];
    }
    if (tracks.length < 1)
        return;
    for (let i = 0; i < tracks.length; i++) {
        // Clone the object before modifying it
        tracks[i] = { ...tracks[i] };
        // Resolve the URLs
        tracks[i].url = resolveImportedPath(tracks[i].url);
        tracks[i].artwork = resolveImportedPath(tracks[i].artwork);
    }
    return TrackPlayer.add(tracks, insertBeforeIndex);
}
/**
 * Removes one or more tracks from the queue.
 */
async function remove(tracks) {
    console.log('TRACK_PLAYER:remove', tracks)
    console.trace('TRACK_PLAYER:remove')

    if (!Array.isArray(tracks)) {
        tracks = [tracks];
    }
    return TrackPlayer.remove(tracks);
}
/**
 * Clears any upcoming tracks from the queue.
 */
async function removeUpcomingTracks() {
    console.log('TRACK_PLAYER:removeUpcomingTracks')
    console.trace('TRACK_PLAYER:removeUpcomingTracks')

    return TrackPlayer.removeUpcomingTracks();
}
/**
 * Skips to a track in the queue.
 */
async function skip(trackIndex, initialPosition = -1) {
    console.log('TRACK_PLAYER:skip', trackIndex, initialPosition)
    console.trace('TRACK_PLAYER:skip')

    return TrackPlayer.skip(trackIndex, initialPosition);
}
/**
 * Skips to the next track in the queue.
 */
async function skipToNext(initialPosition = -1) {
    console.log('TRACK_PLAYER:skipToNext', initialPosition)
    console.trace('TRACK_PLAYER:skipToNext')

    return TrackPlayer.skipToNext(initialPosition);
}
/**
 * Skips to the previous track in the queue.
 */
async function skipToPrevious(initialPosition = -1) {
    console.log('TRACK_PLAYER:skipToPrevious', initialPosition)
    console.trace('TRACK_PLAYER:skipToPrevious')

    return TrackPlayer.skipToPrevious(initialPosition);
}
// MARK: - Control Center / Notifications API
/**
 * Updates the configuration for the components.
 */
async function updateOptions(options = {}) {
    console.log('TRACK_PLAYER:updateOptions', options)
    console.trace('TRACK_PLAYER:updateOptions')

    options = { ...options };
    // Resolve the asset for each icon
    options.icon = resolveImportedPath(options.icon);
    options.playIcon = resolveImportedPath(options.playIcon);
    options.pauseIcon = resolveImportedPath(options.pauseIcon);
    options.stopIcon = resolveImportedPath(options.stopIcon);
    options.previousIcon = resolveImportedPath(options.previousIcon);
    options.nextIcon = resolveImportedPath(options.nextIcon);
    options.rewindIcon = resolveImportedPath(options.rewindIcon);
    options.forwardIcon = resolveImportedPath(options.forwardIcon);
    return TrackPlayer.updateOptions(options);
}
/**
 * Updates the metadata of a track in the queue. If the current track is updated,
 * the notification and the Now Playing Center will be updated accordingly.
 */
async function updateMetadataForTrack(trackIndex, metadata) {
    console.log('TRACK_PLAYER:updateMetadataForTrack', trackIndex, metadata)
    console.trace('TRACK_PLAYER:updateMetadataForTrack')

    // Clone the object before modifying it
    metadata = Object.assign({}, metadata);
    // Resolve the artwork URL
    metadata.artwork = resolveImportedPath(metadata.artwork);
    return TrackPlayer.updateMetadataForTrack(trackIndex, metadata);
}
function clearNowPlayingMetadata() {
    console.log('TRACK_PLAYER:clearNowPlayingMetadata')
    console.trace('TRACK_PLAYER:clearNowPlayingMetadata')
    return TrackPlayer.clearNowPlayingMetadata();
}

function updateNowPlayingMetadata(metadata) {
    console.log('TRACK_PLAYER:updateNowPlayingMetadata', metadata)
    console.trace('TRACK_PLAYER:updateNowPlayingMetadata')
    // Clone the object before modifying it
    metadata = Object.assign({}, metadata);
    // Resolve the artwork URL
    metadata.artwork = resolveImportedPath(metadata.artwork);
    return TrackPlayer.updateNowPlayingMetadata(metadata);
}
// MARK: - Player API
/**
 * Resets the player stopping the current track and clearing the queue.
 */
async function reset() {
    console.log('TRACK_PLAYER:reset')
    console.trace('TRACK_PLAYER:reset')
    return TrackPlayer.reset();
}
/**
 * Plays or resumes the current track.
 */
async function play() {
    console.log('TRACK_PLAYER:play')
    console.trace('TRACK_PLAYER:play')
    return TrackPlayer.play();
}
/**
 * Pauses the current track.
 */
async function pause() {
    console.log('TRACK_PLAYER:pause')
    console.trace('TRACK_PLAYER:pause')
    return TrackPlayer.pause();
}
/**
 * Seeks to a specified time position in the current track.
 */
async function seekTo(position) {
    console.log('TRACK_PLAYER:seekTo', position)
    console.trace('TRACK_PLAYER:seekTo')
    return TrackPlayer.seekTo(position);
}
/**
 * Sets the volume of the player.
 */
async function setVolume(level) {
    console.log('TRACK_PLAYER:setVolume', level)
    console.trace('TRACK_PLAYER:setVolume')
    return TrackPlayer.setVolume(level);
}
/**
 * Sets the playback rate.
 */
async function setRate(rate) {
    console.log('TRACK_PLAYER:setRate', rate)
    console.trace('TRACK_PLAYER:setRate')
    return TrackPlayer.setRate(rate);
}
/**
 * Sets the repeat mode.
 */
async function setRepeatMode(mode) {
    console.log('TRACK_PLAYER:setRepeatMode', mode)
    console.trace('TRACK_PLAYER:setRepeatMode')
    return TrackPlayer.setRepeatMode(mode);
}
// MARK: - Getters
/**
 * Gets the volume of the player (a number between 0 and 1).
 */
async function getVolume() {
    console.log('TRACK_PLAYER:getVolume')
    console.trace('TRACK_PLAYER:getVolume')
    return TrackPlayer.getVolume();
}
/**
 * Gets the playback rate, where 1 is the regular speed.
 */
async function getRate() {
    console.log('TRACK_PLAYER:getRate')
    console.trace('TRACK_PLAYER:getRate')
    return TrackPlayer.getRate();
}
/**
 * Gets a track object from the queue.
 */
async function getTrack(trackIndex) {
    console.log('TRACK_PLAYER:getTrack', trackIndex)
    console.trace('TRACK_PLAYER:getTrack')
    return TrackPlayer.getTrack(trackIndex);
}
/**
 * Gets the whole queue.
 */
async function getQueue() {
    console.log('TRACK_PLAYER:getQueue')
    console.trace('TRACK_PLAYER:getQueue')
    return TrackPlayer.getQueue();
}
/**
 * Gets the index of the current track.
 */
async function getCurrentTrack() {
    console.log('TRACK_PLAYER:getCurrentTrack')
    console.trace('TRACK_PLAYER:getCurrentTrack')
    return TrackPlayer.getCurrentTrack();
}
/**
 * Gets the duration of the current track in seconds.
 */
async function getDuration() {
    console.log('TRACK_PLAYER:getDuration')
    console.trace('TRACK_PLAYER:getDuration')
    return TrackPlayer.getDuration();
}
/**
 * Gets the buffered position of the current track in seconds.
 */
async function getBufferedPosition() {
    console.log('TRACK_PLAYER:getBufferedPosition')
    console.trace('TRACK_PLAYER:getBufferedPosition')
    return TrackPlayer.getBufferedPosition();
}
/**
 * Gets the position of the current track in seconds.
 */
async function getPosition() {
    console.log('TRACK_PLAYER:getPosition')
    console.trace('TRACK_PLAYER:getPosition')
    return TrackPlayer.getPosition();
}
/**
 * Gets the playback state of the player.
 */
async function getState() {
    console.log('TRACK_PLAYER:getState')
    console.trace('TRACK_PLAYER:getState')
    return TrackPlayer.getState();
}
/**
 * Gets the repeat mode.
 */
async function getRepeatMode() {
    console.log('TRACK_PLAYER:getRepeatMode')
    console.trace('TRACK_PLAYER:getRepeatMode')
    return TrackPlayer.getRepeatMode();
}
export default {
    // MARK: - General API
    setupPlayer,
    registerPlaybackService,
    addEventListener,
    isServiceRunning,
    // MARK: - Queue API
    add,
    remove,
    removeUpcomingTracks,
    skip,
    skipToNext,
    skipToPrevious,
    // MARK: - Control Center / Notifications API
    updateOptions,
    updateMetadataForTrack,
    clearNowPlayingMetadata,
    updateNowPlayingMetadata,
    // MARK: - Player API
    reset,
    play,
    pause,
    seekTo,
    setVolume,
    setRate,
    setRepeatMode,
    // MARK: - Getters
    getVolume,
    getRate,
    getTrack,
    getQueue,
    getCurrentTrack,
    getDuration,
    getBufferedPosition,
    getPosition,
    getState,
    getRepeatMode,
};
