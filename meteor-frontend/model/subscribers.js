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
	check(opts, Schemas.Machines);
	var r = Ressource.findOne({
		cpu: 		{$gte: opts.cpu}, 
		memory: 	{$gte: opts.memory}, 
		storage: 	{$gte: opts.storage}, 
		bandwidth: 	{$gte: opts.bandwidth}
	});
	if (! r) return null;
	
};