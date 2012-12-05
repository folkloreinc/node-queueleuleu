
var EventEmitter = require('events').EventEmitter;

var Job = require('./job');

var Queue = function(opts) {

	//Call eventemitter constructor
	EventEmitter.call(this);

	//Options
	this.options = {
		'autostart' : true,
		'debug' : false,
		'processor' : function(job,done) {
			done();
		}
	};
	if(opts) {
		for(var key in opts) {
			this.options[key] = opts[key];
		}
	}

	//Properties
	this.jobs = [];

	//State
	this.isProcessing = false;

};

//Extend EventEmitter
Queue.prototype = Object.create(EventEmitter.prototype);

Queue.prototype.add = function(data) {

	var job = new Job(data);
	this.addJob(job);

};

Queue.prototype.addJob = function(job) {

	job.setQueue(job);
	this.jobs.push(job);

	if(this.options.autostart && !this.isProcessing) {
		this.start();
	}

};

Queue.prototype.start = function() {

	if(this.isProcessing) return;

	this.isProcessing = true;

	this.emit('start');
	this.process();

};

Queue.prototype.stop = function() {

	this.isProcessing = false;

};


Queue.prototype.process = function() {

	//Get current job
	var currentJob = this._getNextJobToProcess();

	//If there is no job left, end
	if(!currentJob) {
		this.isProcessing = true;
		this.emit('end');
		return;
	}

	//when process is done
	function done(job) {

		if(this.options.debug) {
			console.log('done called on job #'+job.id);
		}

		//Emit end event to job
		job.end();

		//Continue if on
		if(this.isProcessing) {
			this.process();
		}
	}

	//call processor
	currentJob.start();
	this.options.processor.call(this,currentJob,function(self,job) {
		return function() {
			process.nextTick(function() {
				done.call(self,job);
			});
		}
	}(this,currentJob));

};

Queue.prototype._getNextJobToProcess = function() {

	for(var i = 0; i < this.jobs.length; i++) {
		if(!this.jobs[i].isProcessed) {
			return this.jobs[i];
		}
	}

	return null;

};


module.exports = exports = Queue;