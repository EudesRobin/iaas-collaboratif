var amqp = Meteor.npmRequire('amqplib/callback_api')
var connection = null
var channel = null

var url = "amqp://guest:guest@localhost:5672";
var queue = "coordinators";
amqp.connect(url, function(err, conn) {
    if (err != null) bail(err);
    connection = conn;
	conn.createChannel(function (err, ch) {
	    if (err) return console.error("AMQP - Failed to create a channel");
	    channel = ch;

	    ch.assertQueue(queue, {}, function(err, ok){
	    	if (err) return console.error("AMQP - Failed to create a queue")
		    ch.consume(queue, function(msg) {
		      if (msg) 
		      {
		      	
		      	// TODO 
		      	data = JSON.parse(msg.content.toString());
		        console.log(data);
		        ch.ack(msg);


		      }
		    });
	    	// publisher(connection)
	    });

	});
});

function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Publisher 
function publisher(conn, data) {
  conn.createChannel(function (err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(queue, {}, function(err, ok){
	    ch.sendToQueue(queue, new Buffer(JSON.stringify(data)));
		console.log("PUBLISHED")
    })
  });
}
 
// Meteor.startup(function () {

// });