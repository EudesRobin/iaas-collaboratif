#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var later = require('later');
var fs = require('fs');
var settings = require('./settings.json')
var channel = null;
var ex = 'coordinators';

var opts = {
  url: "amqp://"+settings.rabbitmq.user+":"+settings.rabbitmq.password+"@"+settings.rabbitmq.host+":"+settings.rabbitmq.port,
};

amqp.connect(opts.url, function(err, conn) {
  if (err) console.error("Failed to connect to the broker", err)
  conn.createChannel(function(err, ch) {
    if (err) console.error("Failed to create a channel", err)
    channel = ch;
    ch.assertExchange(ex, 'fanout', {durable: false});

    // console.log(" [x] Sent %s", process.argv[2]);
    // ch.publish(ex, '', file);
  	// setTimeout(function() { conn.close(); process.exit(0) }, 500);
  });

});

var sched = later.parse.text('every 1 seconds');
later.setInterval(function () {
	if (channel) 
	{
		var file = fs.readFileSync(process.argv[2])
		channel.publish(ex, '', file);
		console.log(" [x] Sent %s", process.argv[2]);
	}
}, sched)
