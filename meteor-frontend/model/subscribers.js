/**
 * The Subscribers inserted in the database will have to follow the schema described
 */
Schemas.Subscribers = new SimpleSchema({
	sshKey : {
		type: String,
		optional: true
	}
});

/**
 * Subscribers obtained from the database contains all the Machine functions
 */
Subscriber = function (opts) {
	_.extend(this, opts);
};

/**
 * If we are on the server, we throw an error
 * @params	Error's parameters
 */
throwError = function(error, reason, details) {  
  var meteorError = new Meteor.Error(error, reason, details);

  if (Meteor.isClient) {
    // this error is never used
    // on the client, the return value of a stub is ignored
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};

/**
 * The field "subscriber" associated to the user in the database
 * @param {Object} s	Subscriber to associate to the current user
 */
Subscriber.prototype.setFields = function(s) {
	if (! s) return null;
	s = _.extend(this.subscriber || {}, s);
	check(s, Schemas.Subscribers);
  	// updating the current object
  	this.subscriber = s;
  	// updating database
  	Users.update({_id: this._id}, {$set:{subscriber:s}}, (error) => {
  	});
  };

/**
 * @return [{Object}]	Machines from the current user in the database
 */
  Subscriber.prototype.getMachines = function() {
  	return Machines.find()
  };

/**
 * Calls the allocate method, then returns a callback with the Meteor method response
 * @param {Object} machine	Machine to allocate
 * @param {function()} cb	Callback methtod
 * @return {Notification}	Notifies the client after the allocation is done
 */
  Subscriber.prototype.allocate = function(machine, cb) {
  	Meteor.call("allocate", Meteor.userId(), machine, function(err, response){
  		if(err){
  			var title = "Error allocation";
  			$.notify({
				// options
				icon: 'glyphicon glyphicon-remove-sign',
				title: title+"<br>",
				message: err.details,
			},{
				//settings
				type: 'danger',
				newest_on_top: true,
				allow_dismiss: true,
				template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
				'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
				'<span data-notify="icon"></span> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'</div>' ,
			});
  		}
  		else
  		{
  			var title ="Allocation";
  			var msg="successful";

  			$.notify({
				// options
				icon: 'glyphicon glyphicon-ok-sign',
				title: title,
				message: msg,
			},{
				//settings
				type: 'success',
				newest_on_top: true,
				allow_dismiss: true,
				template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
				'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
				'<span data-notify="icon"></span> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'</div>' ,
			});
  		}
  		return cb(err, response);
  	})
};

/**
 * Calls the desallocate method, then returns a callback with the Meteor method response
 * At server end, it's not authorised to run an operation related to client, here Machines so replace it to object machine
 * @param {Object} machine	Machine to desallocate
 * @param {function()} cb	Callback methtod
 * @return {Notification}	Notifies the client after the desallocation is done
 */
Subscriber.prototype.desallocate = function(machine, cb) {
	Meteor.call("desallocate", Meteor.userId(), machine, function(err, response){
  		if(err)
  		{
  			var title = "Error desallocation";
  			$.notify({
				// options
				icon: 'glyphicon glyphicon-remove-sign',
				title: title+"<br>",
				message: err.details,
			},{
				//settings
				type: 'danger',
				newest_on_top: true,
				allow_dismiss: true,
				template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
				'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
				'<span data-notify="icon"></span> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'</div>' ,
			});
  		}
  		else 
  		{
  			var title ="Desallocation";
  			var msg="successful";

  			$.notify({
				// options
				icon: 'glyphicon glyphicon-ok-sign',
				title: title,
				message: msg,
			},{
				//settings
				type: 'success',
				newest_on_top: true,
				allow_dismiss: true,
				template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
				'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
				'<span data-notify="icon"></span> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'</div>' ,
			});
  		}
  		return cb(err, response);
	})
};

Meteor.methods({
	/**
	 * Check in the resources the fields where what is available is greater or equal to those asked in the machine
	 * Then, the available fields are decremented, and the machine is associated to the resource
	 * If everything went well, the machine fields are updated then it is inserted in the database
	 * @param {String} userId	id of the user that wants to allocate the machine
	 * @param {Object} machine	machine to insert
	 * @return {Object}			If something went wrong, returns an error, else returns the machine and the err field at null
	 */
	allocate: function(userId, machine) {
		machine = machine || {};
		machine._id = machine._id || Meteor.uuid();

		var query = {
			"cpu.speed" : 		{$gte: machine.cpu.myvalue			}, 
			"cpunumber.available" : {$gte: machine.cpunumber	}, 
			"ram.available" :		{$gte: machine.ram.myvalue			}, 
			"storage.available" : 	{$gte: machine.storage.myvalue		}, 
			"bandwidth.available" :	{$gte: machine.bandwidth.myvalue	},
			"usable" : true
		}

		// TRANSACTION-PART 1
		// an atomic operation in mongoDB since it applies to only one document
		var ok = Ressources.update(query, {
			$inc : {"ram.available": -machine.ram.myvalue				, 
			"cpunumber.available": -machine.cpunumber		, 
			"storage.available": -machine.storage.myvalue		, 
			"bandwidth.available": -machine.bandwidth.myvalue	},
			$push: {"machines_ids": machine._id			},
		}, {
			"upsert": false,
			"multi": false
		});

		if (ok) 
		{
			// Finds the resource associated to the machine
			var myRessource = Ressources.find({machines_ids: machine._id}).fetch();
			if (myRessource.length !== 1) throwError(500,"allocate","Could not allocate a machine. Something went wrong");
			machine.user_id = userId;
			machine.ressource_id = myRessource[0]._id;
			machine.dns = myRessource[0].dns;
			machine.state = "down";

			/**
			 * Returns the number to associate to the instance of the machine that will be in the machinename
			 * @param {String} machineid	Id of the machine in order to get the resource associated
			 * @return {Number}				Number to put in the machinename
			 */
			function instanceNumber(machineid){
				var providerdns = Ressources.findOne({machines_ids: machineid});
				var cpt=0;
				var userid = Meteor.userId();
				// loop machines_ids on provider
				var names_nb = [];
				for(var i=0;i<providerdns.machines_ids.length;i++){
					if(Machines.find({_id: providerdns.machines_ids[i]}).fetch().length>0){
						var mch = Machines.find({_id: providerdns.machines_ids[i]}).fetch()[0];
						if(mch.user_id===userid){
							cpt++;
							var tmp = mch.machinename.split('-');
							names_nb.push(tmp[tmp.length-1]);
						} 
					}
				}
				// if there is an no contiguous numerotation , we will return the missing id
				// and not cpt witch represent how many others instances of this user are running on the provider
				for(var i=0;i<names_nb.length;i++){
					if(names_nb.indexOf(''+i)===(-1)) return i;
				}
				
				return cpt;
			};
			// The username is already present in the machinename, we have to add the dns and the number of other machines on this
			machine.machinename+='-'+machine.dns+'-'+instanceNumber(machine._id);
			// TRANSACTION-PART 2
			// this second query should be a transaction-like operation. We let it this way for now
			// A hashkey is in the fields when you try to use an already existing machine, so we create a new one
			// with the interesting fields
			machine = {_id:machine._id,cpunumber: machine.cpunumber,cpu: machine.cpu, ram: machine.ram,
				storage: machine.storage, bandwidth:machine.bandwidth, machinetype:machine.machinetype,
				machinename:machine.machinename, user_id:machine.user_id, ressource_id:machine.ressource_id,
				dns:machine.dns, state:machine.state};
			Machines.insert(machine); 
			return {err: null, machine: machine};
		}
		else 
		{
			if (! Ressources.findOne(query)) throwError(500,"allocate","No ressource available");
			else throwError(500,"allocate","An error occured in database ressource allocation");
		}

	},

	/**
	 * If the resource associated to the machine still exists, the available fields are incremented and the machine id retired
	 * @param {String} userId	id of the user that wants to desallocate the machine
	 * @param {Object} machine	machine to remove
	 * @return {Object}			Returns an error if something went wrong,
	 * 							else err is null and it says if the machine is deleted correctly
	 */
	desallocate: function(userId, machine) {

		var new_machine = Machines.findOne({_id: machine._id, user_id: userId});
		// TRANSACTION-PART 1
		var ok;
		ok = Machines.remove( new_machine._id);
		if (ok)
		{
			// TRANSACTION-PART 2
			ok = Ressources.update({
				_id: new_machine.ressource_id
			}, {
				$inc : {"ram.available": new_machine.ram.myvalue,
				"cpunumber.available": new_machine.cpunumber,
				"storage.available": new_machine.storage.myvalue,
				"bandwidth.available": new_machine.bandwidth.myvalue},
				$pull: {"machines_ids": new_machine._id},
			}, {
				"upsert": false,
				"multi": false
			});

			if (! ok) {
				throwError(500,"desallocate","Failed to update Ressources database");
				return {err: "Failed to update Ressources database"}
			}
			return {err: null, ok_ressource:Ressources.find({machines_ids: machine._id}).fetch().length == 0 ,
					ok_machine: Machines.find({_id: machine._id, user_id: userId}).fetch().length == 0}

		}
		else
		{
			Machine.insert(new_machine);
			throwError(500,"desallocate","Failed to update Machine database");
			return {err: "Failed to update Machine database"}
		}

	}
})