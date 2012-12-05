
var Queueleuleu = require('./lib/queueleuleu');
var Job = require('./lib/job');

module.exports = exports = {

	'Queue' : Queueleuleu,
	'Job' : Job,

	'createQueue' : function(opts) {

		var queue = new Queueleuleu(opts);

		return queue;

	}


};