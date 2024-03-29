
var EventEmitter = require('events').EventEmitter;

var Job = require('./job');

var Queue = function(opts) {

	//Call eventemitter constructor
	EventEmitter.call(this);

	//Options
	this.options = {
		'autostart' : true,
		'debug' : false,
		'clearOnProcessed' : true,
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
	this.isStopped = false;

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

	if(this.options.autostart && !this.isProcessing && !this.isStopped) {
		this.start();
	}

};

Queue.prototype.start = function() {

	if(this.isProcessing) return;

	this.isProcessing = true;
	this.isStopped = false;

	this.emit('start');
	this.process();

};

Queue.prototype.stop = function() {

	this.isProcessing = false;
	this.isStopped = true;

};


Queue.prototype.process = function() {

	//Get current job
	var currentJob = this._getNextJobToProcess();

	//If there is no job left, end
	if(!currentJob) {
		if(this.options.debug) {
			console.log('no more jobs');
		}
		this.isProcessing = false;
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
		this.emit('job end',job);

		if(this.options.clearOnProcessed) {
			this._clearProcessedJobs();
		}

		//Continue if on
		if(this.isProcessing) {
			this.process();
		}
	}

	//call processor
	currentJob.start();
	this.emit('job start',currentJob);
	this.options.processor.call(this,currentJob,function(self,job) {
		return function() {
			process.nextTick(function() {
				done.call(self,job);
			});
		}
	}(this,currentJob));

};

Queue.prototype._clearProcessedJobs = function() {

	var newJobs = [];
	for(var i = 0; i < this.jobs.length; i++) {
		if(!this.jobs[i].isProcessed) {
			newJobs.push(this.jobs[i]);
		}
	}
	this.jobs = newJobs;

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