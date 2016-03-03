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
		instances = JSON.parse(data);
    	instances.forEach(function (instance) {
    		if (instance.Name === "/coordinator")
    		{
    			// do something
    		} 
    		else if (instance.Name === "/shinken")
    		{
    			// do something
    		}
    		else
    		{
    			var name = instance.Name.split("-");
    			var username = name[0];
    			var dns = name[1];
    			var nb_machine = name[2];

    			var ressource = Ressources.find({dns: dns}).fetch();
    			if (ressource.length > 1) throw new Error("More than one DNS per ressource");
    			
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
	}
});