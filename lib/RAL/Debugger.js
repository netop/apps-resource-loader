var debug = false;

module.exports = {
	activate: function () {
		debug = true;
	},
	deactivate: function () {
		debug = false;
	},
	log: function () {
		if(debug) {
			console.log.apply(console, arguments);
		}
	} 
};