Queueleuleu
===========

A queue system to process jobs asynchronously with node.js


Installation
---------------
    npm install queueleuleu


Usage
---------------

	var queueleuleu = require('queueleuleu');

	var queue = queueleuleu.createQueue({

		'debug' : true,
		'autostart' : true,

		'processor' : function(job,done) {

			console.log('processing job #'+job.id);
			console.log('job data',job.data);

			setTimeout(function() {
				done();
				console.log('processed job #'+job.id);
			},Math.round(Math.random()*1000));

		}

	});

	queue.on('start', function() {
		console.log('Queue start');
	});

	queue.on('end', function() {
		console.log('Queue end');
	});


	for(var i = 0; i < 10; i++) {
		queue.add({
			'index' : i
		});
	}