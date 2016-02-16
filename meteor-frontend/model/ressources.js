// Define a Collection
Ressources = new Mongo.Collection("Ressources", {
  transform: function (doc) { return new Ressource(doc); }
});

Schemas.Ressources = new SimpleSchema({
	// for ensuring that a ressource is associated to a provider
	user_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
	},
	cpu : {
		type: Number, // in GHz
	},
	memory : {
		type: Number, // in Gb
	},
	storage :{
		type: Number, // in Gb
	},
	bandwidth:{
		type: Number, // in Gbit/s
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

Ressources.attachSchema(Schemas.Ressources,  {transform: true, replace:true});

Ressources.allow({
	insert: function(userId,doc) {return userId && Meteor.userId() === userId;},
    update: function(userId, doc, fieldNames, modifier) {return userId && Meteor.userId() === userId;},
    remove: function(userId,doc) {return userId && Meteor.userId() === userId;},
    fetch: []
})

Ressource = function (opts) {
	_.extend(this, opts);
}

// Publishing to move to independants files
if (Meteor.isServer) {
  // Only publish infos that are public or belong to the current user
  Meteor.publish("ressources", function () {
    return Ressources.find({ user_id: this.userId });
  });
}

if (Meteor.isClient) {
	Meteor.subscribe("ressources");
}
