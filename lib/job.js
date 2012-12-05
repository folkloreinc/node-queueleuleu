
var EventEmitter = require('events').EventEmitter;

//Auto increment index
var incrementIndex = 0;

var Job = function(data) {

	//Call eventemitter constructor
	EventEmitter.call(this);

	this.id = incrementIndex++;
	this.data = data;
	this.timeAdded = null;
	this.timeProcessStarted = null;
	this.timeProcessEnded = null;
	this.queue = null;
	this.isProcessed = false;
	this.isProcessing = false;


};

//Extend EventEmitter
Job.prototype = Object.create(EventEmitter.prototype);

//Set current job queue
Job.prototype.setQueue = function(queue) {
	this.queue = queue;
	this.timeAdded = new Date();
};

//Start job
Job.prototype.start = function() {
	this.isProcessing = true;
	this.timeProcessStarted = new Date();

	this.emit('start');
};

//End job
Job.prototype.end = function() {
	this.isProcessed = true;
	this.isProcessing = false;
	this.timeProcessEnded = new Date();

	this.emit('end');
};

module.exports = exports = Job;