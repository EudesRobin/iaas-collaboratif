// Define a Collection
Ressources = new Mongo.Collection("Ressources", {
  transform: function (doc) { return new Ressource(doc); }
});

Schemas.Ressources = new SimpleSchema({
	// for ensuring that a ressource is associated to a provider
	provider_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
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

Ressources.attachSchema(Schemas.Ressources,  {transform: true, replace:true});

Ressources.allow({
    insert: function(userId,doc) {return Meteor.userId() === userId;},
    update: function(userId,doc) {return Meteor.userId() === userId;},
    remove: function(userId,doc) {return Meteor.userId() === userId;},
})

Ressource = function (opts) {
	_.extend(this, opts);
}