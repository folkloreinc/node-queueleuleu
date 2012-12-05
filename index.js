
var Queue = require('./lib/queue');
var Job = require('./lib/job');

module.exports = exports = {

	'Queue' : Queue,
	'Job' : Job,

	'createQueue' : function(opts) {

		var queue = new Queue(opts);

		return queue;

	}


};