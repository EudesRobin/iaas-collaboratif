Schemas.Subscribers = new SimpleSchema({
	sshKey : {
		type: String,
	},
	// machines : {
	// 	type: [Schemas.Machines],
	// 	optional: true,
	// 	defaultValue: []
	// },
});

Subscriber = function (opts) {
	_.extend(this, opts);
}

Subscriber.prototype.setFields = function(s) {
	if (! s) return null;
	s = _.extend(this.subscriber || {}, s);
	check(s, Schemas.Subscribers);
  	// updating the current object
  	this.subscriber = s;
  	// updating database
  	Users.update({_id: this._id}, {$set:{subscriber:s}}, (error) => {
  		if (error) console.error('Oops, unable to update the user...');
  		else console.log('Done!');
  	});
};

Subscriber.prototype.getMachines = function() {
	return Machines.find()
};

Subscriber.prototype.allocate = function(machine) {
	Meteor.call("allocate", Meteor.userId(), machine, function(err, response){
		console.log("ALLOCATE FUNCTION", err, response)		
	})
};

Subscriber.prototype.desallocate = function(machine_id) {
	Meteor.call("desallocate", Meteor.userId(), machine_id, function(err, response){
		console.log("DESALLOCATE FUNCTION", err, response)		
	})
};

Meteor.methods({
	allocate: function(userId, machine) {
		machine = machine || {};
		machine._id = Meteor.uuid();
		machine.cpu = machine.cpu || 1;
		machine.ram = machine.ram || 1;
		machine.storage = machine.storage || 1;
		machine.bandwidth = machine.bandwidth || 1;
		machine.dns = machine.dns || "default.com";

		var query = {
			"cpu.available" : 		{$gte: machine.cpu			}, 
			"ram.available" :		{$gte: machine.ram			}, 
			"storage.available" : 	{$gte: machine.storage		}, 
			"bandwidth.available" :	{$gte: machine.bandwidth	}
		}

		// TRANSACTION-PART 1
		// an atomic operation in mongoDB since it applies to only one document
		var ok = Ressources.update(query, {
			$inc : {"cpu.available": -machine.cpu				, 
			 		"ram.available": -machine.ram				, 
			 		"storage.available": -machine.storage		, 
			 		"bandwidth.available": -machine.bandwidth	},
			$push: {"machines_ids": machine._id					},
		}, {
			"upsert": false,
			"multi": false
		});

		if (ok) 
		{
			var myRessource = Ressources.find({machines_ids: machine._id}).fetch()
			if (myRessource.length !== 1) return new Error("Could not allocate a machine. Something went wrong");
			machine.user_id = userId;
			machine.ressource_id = myRessource[0]._id;
			
			// TRANSACTION-PART 2
			// this second query should be a transaction-like operation. We let it this way for now
			Machines.insert(machine); 
			return {error: null, machine: machine};
		}
		else 
		{
			if (! Ressources.findOne(query)) return {error: "No ressource available", machine: null};
			else return {error: "An error occured in database ressource allocation", machine: null};
		}

	},

	desallocate: function(userId, machine_id) {
		
		var machine = Machines.findOne({_id: machine_id, user_id: userId});
		
		// TRANSACTION-PART 1
		var ok = Machines.remove({_id: machine_id, user_id: userId}, {
			"justOne": true
		});

		if (ok) 
		{
			// TRANSACTION-PART 2
			ok = Ressources.update({
				_id: machine.ressource_id,
				machines: machine._id 		// shouldn't be necessary
			}, {
				$inc : {"cpu.available": +machine.cpu				, 
						"ram.available": +machine.ram				, 
						"storage.available": +machine.storage		, 
						"bandwidth.available": +machine.bandwidth	},
				$pull: {"machines_ids": machine._id					},
			}, {
				"upsert": false,
				"multi": false
			});

			return {error: ok? "Failed to update Ressources database" : null};
		}
		else 
		{
			return {error: "Failed to update Machine database"};
		}

	}
})