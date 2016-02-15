Schemas.Machines = new SimpleSchema({
	// for ensuring that a ressource is associated to a provider
	ressource_id : {
		type: Meteor.Collection.ObjectID,
	 	index: 1,
	},
	// subscriber_id : {
	// 	type: Meteor.Collection.ObjectID,
	//  	index: 1,
	//  	unique: true
	// },
	cpu : {
		type: Number, // in GHz
		defaultValue: 1.2
	},
	ram : {
		type: Number, // in Gb
		defaultValue: 0.512
	},
	elapse_time : {   // in seconds
		type: Number, 
		optional: true	
	},
});

Machine = function (opts) {
	_.extend(this, opts);
}