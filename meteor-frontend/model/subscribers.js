// Define a Collection
Subscribers = new Mongo.Collection("Subscribers", {
  transform: function (doc) { return new Subscriber(doc); }
});

Schemas.Subscribers = new SimpleSchema({
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

Subscriber.prototype.setFields = function(s) {
  if (! s) return null;
  s = _.extend(this.subscriber || {}, s);
  check(s, Schemas.Subscribers);
  // updating the current object
  this.subscriber = s;
  // updating database
  Users.update({_id: this._id}, {$set:{subscriber:s}}, (error) => {
					if (error) {
						console.log('Oops, unable to update the user...');
					}
					else {
						console.log('Done!');
					}
				});
};