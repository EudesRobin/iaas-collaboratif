

var amqp = require('amqplib/callback_api');
var fs = require('fs');
var settings = require('./settings.json')


var opts = {
  url: "amqp://"+settings.rabbitmq.user+":"+settings.rabbitmq.password+"@"+settings.rabbitmq.host+":"+settings.rabbitmq.port,
};

amqp.connect(opts.url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'coordinators';
    var file = fs.readFileSync(process.argv[2])
    ch.assertExchange(ex, 'fanout', {durable: false});

    ch.publish(ex, '', file);
    console.log(" [x] Sent %s", process.argv[2]);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});