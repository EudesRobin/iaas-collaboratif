// Define a Collection
Machines = new Mongo.Collection("Machines", {
  transform: function (doc) { return new Ressource(doc); }
});

Schemas.Machines = new SimpleSchema({
	// for ensuring that a ressource is associated to a provider
	ressource_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
	},
	subscriber_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
	 	unique: true
	},
	cpu : {
		type: Number, // in GHz
	},
	ram : {
		type: Number, // in Gb
	},
	elapse_time : {   // in seconds
		type: Number, 
		optional: true	
	},
});

Machines.attachSchema(Schemas.Machines,  {transform: true, replace:true});

Machines.allow({
    insert: function(userId,doc) {return Meteor.userId() === userId;},
    update: function(userId,doc) {return Meteor.userId() === userId;},
    remove: function(userId,doc) {return Meteor.userId() === userId;},
})

Ressource = function (opts) {
	_.extend(this, opts);
}

// Publishing to move to independants files
if (Meteor.isServer) {
  // Only publish infos that are public or belong to the current user
  Meteor.publish("machines", function () {
    return Machines.find({ user_id: this.userId });
  });
}

if (Meteor.isClient) {
	Meteor.subscribe("machines");
}
