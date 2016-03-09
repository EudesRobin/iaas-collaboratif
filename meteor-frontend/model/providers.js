// SCHEMA
Schemas.Providers = new SimpleSchema({});

/**
 * Providers obtained from the database contains all the Machine functions
 */
Provider = function (opts) {
  	_.extend(this, opts);
}

/**
 * The field "provider" associated to the user in the database
 * @param {Object} p	Provider to associate to the current user
 */
Provider.prototype.setFields = function(p) {
  	if (! p) return null;
  	p = _.extend(this.provider || {}, p);
  	check(p, Schemas.Providers);
  	// updating the current object
  	this.provider = p;
  	// updating database
  	Users.update({_id: this._id}, {$set:{provider:p}}, (error) => {
  		if (error) console.error('Oops, unable to update the user...');
  		else console.log('Done!');
	});
};

/**
 * @return [{Object}]	Ressources from the current user in the database
 */
Provider.prototype.getRessources = function() {
	var self = this;
	return Ressources.find({user_id:self._id});
};

/**
 * Insert the resource in parameter into the database (with the user_id field set to the current user id)
 * @param {Object} r				Resource to insert in the database
 * @param {function({Object})} cb	Callback with the error in parameter when the insertion is done or has failed
 * @return {Notification}			Notifies when the insertion is done or has failed
 */
Provider.prototype.addRessource = function(r,cb) {
	if (! r) return null;
	r.user_id = this._id;
	check(r, Schemas.Ressources);
	var id = Ressources.insert(r, function(err){
		if(err) return cb(err);
	});
};