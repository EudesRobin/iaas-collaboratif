Schemas.Subscribers = new SimpleSchema({
	sshKey : {
		type: String,
		optional: true
	}
	// machines : {
	// 	type: [Schemas.Machines],
	// 	optional: true,
	// 	defaultValue: []
	// },
});

Subscriber = function (opts) {
	_.extend(this, opts);
};

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

  Subscriber.prototype.getMachines = function() {
  	return Machines.find()
  };

  Subscriber.prototype.allocate = function(machine) {
  	Meteor.call("allocate", Meteor.userId(), machine, function(err, response){
  		if(err){
  			var title = "Error allocation";
  			console.log(err);
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
  		}else{
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
  	})
};

//At server end, it's not authorised to run an operation related to client, here Machines so replace it to object machine
Subscriber.prototype.desallocate = function(machine) {
	Meteor.call("desallocate", Meteor.userId(), machine, function(err, response){
  		if(err){
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

  		if(response){
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
	})
};

Meteor.methods({
	allocate: function(userId, machine) {
		machine = machine || {};
		machine._id = Meteor.uuid();
		machine.cpu = machine.cpu || 1;
		machine.ram = machine.ram || 1;
		machine.storage = machine.storage || 1;
		machine.bandwidth = machine.bandwidth || 1;
		machine.dns = machine.dns || "default.com";
		var query = {
			"cpu" : 		{$gte: machine.cpu			}, 
			"cpunumber.available" : {$gte: machine.cpunumber	}, 
			"ram.available" :		{$gte: machine.ram			}, 
			"storage.available" : 	{$gte: machine.storage		}, 
			"bandwidth.available" :	{$gte: machine.bandwidth	},
			"usable" : true
		}

		// TRANSACTION-PART 1
		// an atomic operation in mongoDB since it applies to only one document
		var ok = Ressources.update(query, {
			$inc : {"ram.available": -machine.ram				, 
			"cpunumber.available": -machine.cpunumber		, 
			"storage.available": -machine.storage		, 
			"bandwidth.available": -machine.bandwidth	},
			$push: {"machines_ids": machine._id					},
		}, {
			"upsert": false,
			"multi": false
		});

		if (ok) 
		{
			var myRessource = Ressources.find({machines_ids: machine._id}).fetch()
			if (myRessource.length !== 1) throwError(500,"allocate","Could not allocate a machine. Something went wrong");
			machine.user_id = userId;
			machine.ressource_id = myRessource[0]._id;
			machine.dns = myRessource[0].dns;
			machine.state = "initial";

			// return how many other instances userid are running at providerdns
			function howmanyothers(machineid){
				var providerdns = Ressources.find({machines_ids: machineid}).fetch()[0];
				var cpt=0;
				var userid = Meteor.userId();
				// loop machines_ids on provider
				for(i=0;i<providerdns.machines_ids.length;i++){
					if(Machines.find({_id: providerdns.machines_ids[i]}).fetch().length>0){
						if(Machines.find({_id: providerdns.machines_ids[i]}).fetch()[0].user_id===userid) cpt++;
					}
				}
				return cpt;
			};
			var tmp = machine.machinename;
			machine.machinename+='-'+machine.dns+'-'+howmanyothers(machine._id);
			// TRANSACTION-PART 2
			// this second query should be a transaction-like operation. We let it this way for now
			Machines.insert(machine); 
			return "DONE";
		}
		else 
		{
			if (! Ressources.findOne(query)) throwError(500,"allocate","No ressource available");
			else throwError(500,"allocate","An error occured in database ressource allocation");
		}

	},

	desallocate: function(userId, machine) {

		if (Meteor.isClient){
			setTimeout(function(){
				var new_machine = Machines.findOne({_id: machine._id, user_id: userId});
				// TRANSACTION-PART 1
				var ok= Machines.remove( new_machine._id);
				if (ok)
				{
					// TRANSACTION-PART 2
					ok = Ressources.update({
						_id: new_machine.ressource_id
					}, {
						$inc : {"ram.available": new_machine.ram				,
						"cpunumber.available": new_machine.cpunumber		,
						"storage.available": new_machine.storage		,
						"bandwidth.available": new_machine.bandwidth	},
						$pull: {"machines_ids": new_machine._id					},
					}, {
						"upsert": false,
						"multi": false
					});

					throwError(500,"desallocate","Failed to update Ressources database");
				}
				else
				{
					throwError(500,"desallocate","Failed to update Machine database");
				}

			},1000);
		}

	}
})