var RAL = {
	Debugger:          require("./RAL/Debugger"),
	Heap:              require("./RAL/Heap"),
	Sanitiser:         require("./RAL/Sanitiser"),
	CacheParser:       require("./RAL/CacheParser"),
	FileSystem:        require("./RAL/FileSystem"),
	FileManifest:      require("./RAL/FileManifest"),
	RemoteFile:        require("./RAL/RemoteFile"),
	RemoteImage:       require("./RAL/RemoteImage"),
	Loader:            require("./RAL/Loader"),
	NetworkMonitor:    require("./RAL/NetworkMonitor"),
	Queue:             require("./RAL/Queue"),
};

if(window) {
	window.RAL = RAL;
}

module.exports = RAL;