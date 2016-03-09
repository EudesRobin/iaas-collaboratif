// Define a Collection
Rates = new Mongo.Collection("Rates", {
  transform: function (doc) { return new Rate(doc); }
});

/**
 * Rates obtained from the database contains all the Rate functions
 */
Rate = function (opts) {
	_.extend(this, opts);
}

/**
 * Set the restrictions for Rates database modifications
 */
Rates.attachSchema(Schemas.Rates,  {transform: true, replace:true});

Rates.allow({
	insert: function(userId,doc) {return userId && doc.username === Users.findOne({_id:userId}).username;},
    update: function(userId, doc, fieldNames, modifier) {return userId && doc.username === Users.findOne({_id:userId}).username;},
    remove: function(userId,doc) {return userId && doc.username === Users.findOne({_id:userId}).username;},
    fetch: ["username"]
})

/**
 * The rates inserted in the database will have to follow the schema described
 */
Schemas.Rates = new SimpleSchema({
	username : {
		type: String
	},
	providerdns : {
		type: String,
		regEx: SimpleSchema.RegEx.Domain
	},
	rate : {
		type: Number,
		allowedValues: [1,2,3,4,5]
	}
});

// Publishing to move to independants files
if (Meteor.isServer) {
  // Only publish infos that are public or belong to the current user
  Meteor.publish("rates", function () {
  	var dnsTab = [];
  	var resources = Ressources.find({user_id:this.userId}).fetch();
  	for(var i = 0;i<resources.length;i++){
  		dnsTab.push(resources[i].dns);
  	}
  	var username = Users.findOne({_id:this.userId}).username;
  	if(username)
    	return Rates.find({$or:[{ username: username },{providerdns:{ $in: dnsTab }}]});
    else
    	return Rates.find({providerdns:{ $in: dnsTab }});
  });
}

// The client gets the resources published
if (Meteor.isClient) {
	Meteor.subscribe("rates");
}