// Define a Collection
Subscribers = new Mongo.Collection("Subscribers", {
  transform: function (doc) { return new Subscriber(doc); }
});

Schemas.Subscribers = new SimpleSchema({
	// for ensuring that a Subscriber is associated to a provider
	provider_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
	},
	sshKey : {
		type: String,
	}
});

Subscribers.attachSchema(Schemas.Subscribers,  {transform: true, replace:true});
Subscribers.allow({
    insert: function(userId,doc) {return Meteor.userId() === userId;},
    update: function(userId,doc) {return Meteor.userId() === userId;},
    remove: function(userId,doc) {return Meteor.userId() === userId;},
})

Subscriber = function (opts) {
	_.extend(this, opts);
}