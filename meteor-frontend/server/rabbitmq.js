Meteor.startup(function () {
	var amqp = Meteor.npmRequire('amqplib/callback_api')
	var channel = null

	var url = "amqp://guest:guest@localhost:5672";
	var queue = "coordinators";
	amqp.connect(url, function(err, conn) {
	    if (err != null) return console.error("AMQP - Failed to create a connection", err);
		conn.createChannel(function (err, ch) {
		    if (err) return console.error("AMQP - Failed to create a channel", err);
		    channel = ch;

		    ch.assertQueue(queue, {}, function(err, ok){
		    	if (err) return console.error("AMQP - Failed to create a queue", err)

			    ch.consume(queue, function(msg) {
			      	if (msg) 
			      	{
			      		// data = JSON.parse(msg.content.toString());
			      		data = (msg.content.toString());
    					console.log(msg);
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
