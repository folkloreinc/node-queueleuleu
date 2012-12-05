
var queueleuleu = require('../index');

var queue = queueleuleu.createQueue({

	'autostart' : true,

	'processor' : function(job,done) {

		console.log('processing job #'+job.id);
		console.log('job data',job.data);

		setTimeout(function() {
			console.log('processed job #'+job.id);
			done();
		},Math.round(Math.random()*1000));

	}

});

queue.on('start', function() {
	console.log('Queue start');
});

queue.on('end', function() {
	console.log('Queue end');
});


for(var i = 0; i < 40; i++) {
	queue.add({
		'index' : i
	});
}