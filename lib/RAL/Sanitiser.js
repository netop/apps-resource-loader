/**
 * Sanitises a file path.
 */
var Sanitiser = (function() {

  /**
   * Cleans and removes the protocol from the URL.
   * @param {string} url The URL to clean.
   */
  function cleanURL(url) {
    return url.replace(/.*?:\/\//, '', url);
  }

  return {
    cleanURL: cleanURL
  };

})();

module.exports = Sanitiser;
