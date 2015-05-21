/** npm install uglify-js **/
var UglifyJS = require("uglify-js");
var FS = require('fs');

var result = UglifyJS.minify (

  // files
  [
    "lib/RAL/Namespace.js",
    "lib/RAL/Heap.js",
    "lib/RAL/Sanitiser.js",
    "lib/RAL/CacheParser.js",
    "lib/RAL/FileSystem.js",
    "lib/RAL/FileManifest.js",
    "lib/RAL/RemoteFile.js",
    "lib/RAL/Image.js",
    "lib/RAL/Loader.js",
    "lib/RAL/NetworkMonitor.js",
    "lib/RAL/Queue.js"
  ],

  // options
  {
    outSourceMap: "lib/ral.map",
    sourceRoot: "lib/RAL/"
  }
);

result.code += "//# sourceMappingURL=ral.map";

FS.writeFileSync('lib/ral.min.js', result.code);
FS.writeFileSync('lib/ral.map', result.map);
