// Define a Collection
Providers = new Mongo.Collection("Providers", {
  transform: function (doc) { return new Provider(doc); }
});

// SCHEMA
Schemas.Providers = new SimpleSchema({
	user_id : {
		type: String,
	 	index: 1,
	 	unique: true, // for ensuring that a collaborator is associated to only one user
	 	// regEx: SimpleSchema.RegEx.Id 
	},
	dns : { 
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Domain
	},
	hostname : {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.IPv4
	},
	ressources : { 
		type: [String],
		optional: true,
		defaultValue: [],
		regEx: SimpleSchema.RegEx.Id,
	},
});

// Providers._ensureIndex( { "user_id": 1, "name":1 }, { unique: true } )
Providers.attachSchema(Schemas.Providers,  {transform: true, replace:true});
Providers.allow({
    insert: function(userId,doc) {return Meteor.userId() === doc.user_id;},
    update: function(userId,doc, fieldnames, modifier) {return Meteor.userId() === user_id;},
    remove: function(userId,doc) {return Meteor.userId() === doc.user_id;},
})
// TO-DO remove or update only when the ressource is not already allocated

Provider = function (opts) {
  	_.extend(this, opts);
}

Provider.prototype.getRessources = function() {
	var self = this;
	return Ressources.find({provider_id:self._id}).fetch();
};

Provider.prototype.addRessource = function(r) {
	if (! r) return null;
	r.provider_id = this._id;
	check(r, Schemas.Ressources);
	var id = Ressources.insert(r, {});
	this.ressources.push(id);
};

Provider.prototype.removeRessource = function(_id) {
	var self = this;
	if (! ressource) return null;
	Ressources.remove({_id:_id});
	Providers.update({_id: self._id}, {"$pull":{ressources:_id}});
	this.ressources = Providers.findOne({_id: self._id}, {fields: {ressources: 1}});
	return this;
};

// Publishing to move to independants files
if (Meteor.isServer) {
  // Only publish infos that are public or belong to the current user
  Meteor.publish("providers", function () {
    return Providers.find({ user_id: this.userId });
  });
}

if (Meteor.isClient) {
	Meteor.subscribe("providers");
}

