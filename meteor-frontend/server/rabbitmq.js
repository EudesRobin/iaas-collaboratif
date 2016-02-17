Meteor.startup(function () {
	var amqp = Meteor.npmRequire('amqplib/callback_api')
	var channel = null

	var url = "amqp://guest:guest@localhost:5672";
	var queue = "coordinators";
	amqp.connect(url, function(err, conn) {
	    if (err != null) bail(err);
		conn.createChannel(function (err, ch) {
		    if (err) return console.error("AMQP - Failed to create a channel");
		    channel = ch;

		    ch.assertQueue(queue, {}, function(err, ok){
		    	if (err) return console.error("AMQP - Failed to create a queue")

			    ch.consume(queue, function(msg) {
			      	if (msg) 
			      	{
			      		data = JSON.parse(msg.content.toString());
			        	doWork(data)
			        	ch.ack(msg);
			      	}
			    });
		    });

		});
	});

	function doWork (data) {
    	console.log(data);
	}
});
