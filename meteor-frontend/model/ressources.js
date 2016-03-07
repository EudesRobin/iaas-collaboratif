// Define a Collection
Ressources = new Mongo.Collection("Ressources", {
  transform: function (doc) { return new Ressource(doc); }
});

/**
 * Type used to specifie fields that can give a limited amount of resources (can be decimal)
 */
var resValue = new SimpleSchema({
	available : {
		type: Number,
		decimal: true
	},
	total : {
		type: Number,
		decimal: true
	},
})

/**
 * Type used to specifie fields that can give a limited amount of resources (cannot be decimal)
 */
var resValueInt = new SimpleSchema({
	available : {
		type: Number,
		decimal: false
	},
	total : {
		type: Number,
		decimal: false
	},
})

/**
 * The resources inserted in the database will have to follow the schema described
 */
Schemas.Ressources = new SimpleSchema({
	// for ensuring that a ressource is associated to a provider
	user_id : {
		type: String,
		regEx : SimpleSchema.RegEx.Id
	},
	cpu : {
		type: Number,
	},
	cpunumber : {
		type: resValueInt,
	},
	ram : {
		type: resValue
	},
	storage :{
		type: resValue
	},
	bandwidth:{
		type: resValue
	},
	dns : { 
		type: String,
		regEx: SimpleSchema.RegEx.Domain,
		unique: true
	},
	elapse_time : {   // in seconds
		type: Number, 
		optional: true	
	},
	usable : {
		type: Boolean,
		optional: true,
		defaultValue: false
	},
	machines_ids : {
		type: [String],
		defaultValue: [],
		optional: true	
	},
});

/**
 * Set the restrictions for Ressources database modifications
 */
Ressources.attachSchema(Schemas.Ressources,  {transform: true, replace:true});

Ressources.allow({
	insert: function(userId,doc) {return userId && doc.user_id === userId;},
    update: function(userId, doc, fieldNames, modifier) {return userId && doc.user_id === userId && ! _.contains(fieldNames,
    																									 'machines_ids') },
    remove: function(userId,doc) {return userId && userId === doc.user_id;},
    fetch: ["user_id"]
})

/**
 * Ressources obtained from the database contains all the Machine functions
 */
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

// The client gets the resources published
if (Meteor.isClient) {
	Meteor.subscribe("ressources");
}

Meteor.methods({

	/**
	 * Modify the state of machines using the resource to down, then put the field usable to false
	 * @param {String} ressource_id	Id of the resource to stop
	 */
	stopRessource: function (ressource_id) {
		var ressource = Ressources.findOne({_id: ressource_id, user_id: Meteor.userId()})
		ressource.machines_ids.forEach(function(machine_id){
			Machines.update({_id: machine_id}, {$set:{state:'down'}});
		});

		ressource.usable=false;
		Ressources.update({_id: ressource._id}, {$set:{usable:ressource.usable}});

	}
					
})