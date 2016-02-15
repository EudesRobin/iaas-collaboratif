Schemas.Subscribers = new SimpleSchema({
	sshKey : {
		type: String,
	},
	machines : {
		type: [Schemas.Machines],
		optional: true,
		defaultValue: []
	}
});

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

Subscriber.prototype.allocate = function(opts) {
	if (! opts) return null;
	check(opts, Schemas.machine);
};