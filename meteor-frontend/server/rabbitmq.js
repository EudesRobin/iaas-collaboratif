Meteor.startup(function () {
	var amqp = Meteor.npmRequire('amqplib/callback_api')
	var channel = null
    
	var url = "amqp://"+Meteor.settings.rabbitmq.user+":"+Meteor.settings.rabbitmq.password+"@"+Meteor.settings.rabbitmq.host+":"+Meteor.settings.rabbitmq.port;

    var variables = {
        'exchange': 'coordinators',
        'type': 'fanout',
        'queue': '',
    }
    // connecting to amqp
	amqp.connect(url, function(err, conn) {
	    if (err != null) return console.error("AMQP - Failed to create a connection", err);
        // creating a channel
		conn.createChannel(function (err, ch) {
		    if (err) return console.error("AMQP - Failed to create a channel", err);
		    channel = ch;
            // creating a exchange
            ch.assertExchange(variables.exchange, variables.type, {durable: false});
            // creating a random queue
		    ch.assertQueue(variables.queue, {exclusive: true}, function(err, ok){
		    	if (err) return console.error("AMQP - Failed to create a queue", err)
                // attaching a consumer to the queue
			    ch.consume(ok.queue, handler, {noAck: true}, function (err) {
                    if (err) return console.error("AMQP - Failed to attach a consumer", err)
                    // // binding the queue to the keys of interests
                    ch.bindQueue(ok.queue, variables.exchange, "", {}, function (err) {
                        if (err) return console.error("AMQP - Failed to bind the queue to the exchange", err)
                    });
                });
                // a handler for each published message
                function handler (msg) {
                    console.log(msg)
                    if (msg) 
                    {
                        try 
                        {
                            data = JSON.parse(msg.content.toString());
                        } catch (e) {
                            console.error("This is not JSON you son of a bitch !", e);
                            return;
                        }
                        doWork(data);
                    }
                }
		    });

		});
	});

	var doWork = Meteor.bindEnvironment(function (instances) {
    	instances.forEach(function (instance) {
    		if (instance.Name === "/coordinator")
    		{
    			// do something
    		} 
    		else if (instance.Name === "/cadvisor")
    		{
    			// do something
    		}
    		else
    		{
    			var name = instance.Name.split("-");
    			var username = name[0];
    			name.splice(0,1);
                name.splice(name.length-1,1);
                var dns = name.join("-");
    			var nb_machine = name[name.length-1];

                console.log(dns +' '+username+' '+nb_machine);
                var ressource = Ressources.find({dns: dns}).fetch();
                if (ressource != 1) return console.error("Either more than one and no ressoure was found !")

    			// updating the ressource state to USABLE
    			Ressources.update({ressource: ressource._id}, {
    				$set:{usable: true}
    			})

    			// updating machine infos
    			Machines.update({machinename: instance.Name}, {
    				$set: 
    				{
    					// "storage.availabe": instance.SizeRw / (1000*1000*1000), // Octets / 10^9
    					"rabbitmq": instance,
                        "state": (instance.State.Status === "running")? "up" : "down",
    				}
    			})
    		}
    	})
	})

});