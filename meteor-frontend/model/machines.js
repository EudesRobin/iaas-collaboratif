// Define a Collection
// Machines = new Mongo.Collection("Machines", {
//   transform: function (doc) { return new Machine(doc); }
// });

Schemas.Machines = new SimpleSchema({
	// for ensuring that a ressource is associated to a provider
	ressource_id : {
		type: String,
		regEx : SimpleSchema.RegEx.Id
	},
	cpu : {
		type: Number, // in GHz
		decimal: true
	},
	memory : {
		type: Number, // in Gb
		decimal: true
	},
	storage :{
		type: Number, // in Gb
		decimal: true
	},
	bandwidth:{
		type: Number, // in Gbit/s
		decimal: true
	},
	dns : { 
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Domain
	},
	elapse_time : {   // in seconds
		type: Number, 
		optional: true	
	},
});

// Machines.attachSchema(Schemas.Machines,  {transform: true, replace:true});

// 	Machines.allow({
// 		insert: function(userId,doc) {return userId && Meteor.userId() === userId;},
//     	update: function(userId, doc, fieldNames, modifier) {return userId && Meteor.userId() === userId;},
//     	remove: function(userId,doc) {return userId && Meteor.userId() === userId;},
//     	fetch: []
// 	})

Machine = function (opts) {
	_.extend(this, opts);
}


// // Publishing to move to independants files
// if (Meteor.isServer) {
//   // Only publish infos that are public or belong to the current user
//   Meteor.publish("machines", function () {
//     return Machines.find({ subscriber_id: this.userId });
//   });
// }

// if (Meteor.isClient) {
// 	Meteor.subscribe("machines");
// }
