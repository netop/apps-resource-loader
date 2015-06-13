var FileSystem = require("./FileSystem");
var Sanitiser = require('./Sanitiser');

/**
 * Represents the internal log of all files that
 * have been cached for offline use.
 */
var FileManifest = (function() {

  var manifest = null,
      ready = false,
      readyListeners = [],
      saving = false,
      hasUpdated = false;

  /**
   * Determines if the manifest is ready for use.
   * @returns {boolean} If the manifest is ready.
   */
  function isReady() {
    return ready;
  }

  /**
   * Registers a listener for when the manifest is
   * ready for interaction.
   * @param {Function} listener The listener function.
   */
  function registerOnReady(listener) {
    readyListeners.push(listener);
  }

  /**
   * Gets the file information from the manifest.
   * @param {string} src The source URL of the asset.
   * @param {Function} callback The callback function to
   *      call with the asset details.
   */
  function get(src, callback) {
    if (manifest === null) {
      reset();
    }
    var cleanSrc = Sanitiser.cleanURL(src);
    var fileInfo = manifest.hasOwnProperty(cleanSrc) ? manifest[cleanSrc] : null;
    callback(fileInfo);
  }

  /**
   * Sets the file information in the manifest.
   * @param {string} src The source URL of the asset.
   * @param {object} info The information to store against the asset.
   * @param {Function} callback The callback function to
   *      call once the asset details have been saved.
   */
  function set(src, info, callback) {
    try {
      var cleanSrc = Sanitiser.cleanURL(src);
      manifest[cleanSrc] = info;
      save(callback);
    } catch (err) {
      console.error('Detected corruption of manifest. Resetting. src=' + src + '\ninfo=' + info);
      reset();
    }
  }

  /**
   * Resets the manifest of files.
   */
  function reset() {
    manifest = {};
    save();
  }

  /**
   * Callback for when there is no manifest available.
   * @private
   */
  function onManifestUnavailable() {
    onManifestLoaded("{}");
  }

  /**
   * Callback for when there is no manifest has laded. Passes through the
   * registered ready callbacks and fires each in turn.
   * @param {string} The JSON representation of the manifest.
   * @private
   */
  function onManifestLoaded(fileData) {

    ready = true;

    try{
      manifest = JSON.parse(fileData);
    } catch (err) {
      console.error('RAL manifest corrupted. Resetting.');
      reset();
    }

    if (readyListeners.length) {
      var listener = readyListeners.length;
      while(listener--) {
        readyListeners[listener]();
      }
    }
  }

  /**
   * Saves the manifest file.
   * @private
   */
  function save(callback) {

    var blob = new Blob([
      JSON.stringify(manifest)
    ], {type: 'application/json'});

    // Called whether or not the file exists
    FileSystem.set("manifest.json", blob, function() {
      if(!!callback) {
        callback();
      }
    });
  }

  /**
   * Requests the manifest JSON file from the file system.
   */
  function init() {
    FileSystem.getDataAsText("manifest.json",
      onManifestLoaded,
      onManifestUnavailable);
  }

  // check if the file system is good to go. If not, then
  // flag that we want to know when it is.
  if (FileSystem.isReady()) {
    init();
  } else {
    FileSystem.registerOnReady(init);
  }

  return {
    isReady: isReady,
    registerOnReady: registerOnReady,
    get: get,
    set: set,
    reset: reset
  };

})();

module.exports = FileManifest;
