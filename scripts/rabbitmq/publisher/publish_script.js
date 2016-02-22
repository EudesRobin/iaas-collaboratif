var amqp = require('amqplib/callback_api')
var connection = null
var channel = null

var url = "amqp://guest:guest@localhost:5672";
var queue = "coordinators";

var data = "Hello World !"
amqp.connect(url, function(err, conn) {
    if (err != null) bail(err);
    connection = conn;
	conn.createChannel(function (err, ch) {
	    if (err) return console.error("AMQP - Failed to create a channel");
	    channel = ch;

	    ch.assertQueue(queue, {}, function(err, ok){
		    ch.sendToQueue(queue, new Buffer(JSON.stringify(data)));
			console.log("PUBLISHED", data)
	    })
	});
});