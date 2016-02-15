Schemas.Subscribers = new SimpleSchema({
	// for ensuring that a Subscriber is associated to a provider
	provider_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
	},
	sshKey : {
		type: String,
	}
	machines : {
		type: [Schemas.Machines],
		optional: true,
		defaultValue: []
	}
});

Subscriber = function (opts) {
	_.extend(this, opts);
}

Subscriber.prototype.allocate = function(opts) {
	if (! opts) return null;
	check(opts, Schemas.machine);
	
};