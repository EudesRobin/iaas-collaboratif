// SCHEMA
Schemas.Providers = new SimpleSchema({
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
});


Provider = function (opts) {
  	_.extend(this, opts);
}

Provider.prototype.setFields = function(p) {
  if (! p) return null;
  p = _.extend(this.provider || {}, p);
  check(p, Schemas.Providers);
  // updating the current object
  this.provider = p;
  // updating database
  Users.update({_id: this._id}, {$set:{provider:p}});
};


Provider.prototype.getRessources = function() {
	var self = this;
	return Ressources.find({user_id:self._id});
};

Provider.prototype.addRessource = function(r) {
	if (! r) return null;
	r.user_id = this._id;
	check(r, Schemas.Ressources);
	var id = Ressources.insert(r, {});
};