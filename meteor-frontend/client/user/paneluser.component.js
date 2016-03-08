angular.module('iaas-collaboratif').directive('user', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/user/paneluser.html',
		controllerAs: 'user',
		controller: function ($scope, $reactive, $modal) {
			$reactive(this).attach($scope);

			this.subscribe('users');

			this.helpers({
				/**
				 * @return user database (only what is published)
				  */
				users: () => {
					return Meteor.users.find({});
				},
				/**
				 * @return {Boolean} true if the user is connected
				 */
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				/**
				 * @return {String} Id of the user
				 */
				currentUserId: () => {
					return Meteor.userId();
				},
				/**
				 * @return {Object} current user
				 */
				currentUser: () => {
					return Meteor.users.findOne(Meteor.userId());
				},
				/**
				 * @return {Object} Machines of the user
				 */
				machines: () => {
					return Machines.find({user_id: Meteor.userId()});
				}
			});

			/**
			 * @return {Boolean} true if there are no machines for the current user
			 */
			this.machinesIsEmpty = () => {
				return Machines.find({user_id: Meteor.userId()}).fetch().length == 0;
			}

			/**
			 * Get the table line class (in order to change its color) in function of the field state of the machine
			 * @param {Object} machine	machine associated to the row
			 * @return {String}	success if state is up (green), else if state is providerdown warning (yellow), else danger (red)
			 */
			this.getRowClass = (machine) => {
				if(machine.state==="up"){
					return "success";
				}
				else if(machine.state==="providerdown"){
					return "warning";
				}
				else{
					return "danger";
				}
			}

			/**
			 * Update the subscriber fields for the user
			 */
			this.save = () => {
				this.currentUser.getSubscriber().setFields(this.currentUser.subscriber);
			};

			/**
			 * Call the meteor method exec_cmd and sends a callback when it is done
			 * @param {String} cmd		Type of the command: create: start/stop/remove
			 * @param {String} param	Parameters to send to the exec_cmd method
			 * @param {function()} cb	Callback
			 * @return {notification}	Notifies at the end of action_user
			 */
			this.action_user = (cmd,param,cb) => {
				cmd_concat=cmd+'_user';
				// Call the exec_cmd function (server/startup/load.js)
				Meteor.call('exec_cmd',cmd_concat,param, function (err, response) {
					if(err){
						var title;
						switch(cmd){
							case "create":
							title = "Error creation instance"
							break;
							case "stop":
							title = "Error kill instance"
							break;
							case "remove":
							title = "Error remove instance"
							break;						
							default:
							title = "Error unknown command"
						}
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
						var title;
						var msg="successful";
						switch(cmd){
							case "create":
							title = "Creation instance<br>"
							break;
							case "stop":
							title = "Kill instance<br>"
							break;
							case "remove":
							title = "Remove instance<br>"
							break;
							default:
							title = "Unknown command"
						}
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
					return cb();
				});
			};

			/**
			 * Makes a success notification
			 * @param {String} cmd		Type of command: reallocate
			 * @param {String} params	Message of the notification
			 */
			this.throw_success = (cmd,param) => {
				var title;
				var msg=param;
				switch(cmd){
					case "reallocate":
					title = "Reallocate try<br>"
					break;
					default:
					title = "Unknown command"
				}
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
			};

			/**
			 * Makes an error notification
			 * @param {String} cmd		Type of command: allocate/create/stop/remove/reallocate/desallocate
			 * @param {String} params	Message of the notification
			 */
			this.throw_error = (cmd,params) => {
				var title;
				switch(cmd){
					case "allocate":
					title = "Provider not found"
					break;
					case "create":
					title = "Error creation instance"
					break;
					case "stop":
					title = "Error kill instance"
					break;
					case "remove":
					title = "Error remove instance"
					break;
					case "reallocate":
					title = "Error reallocate instance"
					break;
					case "desallocate":
					title = "Error reallocate instance"
					break;							
					default:
					title = "Error Unknown command"
				}
				$.notify({
					// options
					icon: 'glyphicon glyphicon-remove-sign',
					title: title+"<br>",
					message: params,
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
			};

			/**
			 * Calls the getInfoFromRessource method (server/startup/load.js) with the resource id in parameter
			 * @param {String} ressource_id		Id of the resource to get the informations
			 * @param {function(err,response)}	Return callback from the meteor call
			 * @return {notification}			Notifies what the meteor call sent
			 */
			this.getInfoFromRessource = (ressource_id, cb) => {
				Meteor.call('getInfoFromRessource',ressource_id, function (err, response) {
					if(err){
						self.throw_error('allocate','The provider does not exist anymore.')
					}
					return cb(err, response);
				});
			}

			/**
			 * Allocate the machine into the database, then start it with action_user
			 * @param {Object} machine	Machine to start
			 */
			this.allocateStart = (machine) => {
				var self = this;
				this.currentUser.getSubscriber().allocate(machine, function (err, new_machine) {
					if (err) self.throw_error("allocate","Failed to reallocate, allocation failed");
					self.getInfoFromRessource(new_machine.machine.ressource_id, function (err, isItAvailable) {
						if(err) self.throw_error("reallocate","An error occured while reallocating the machine");
						if(isItAvailable.usable){
							machine=Machines.findOne({_id:machine._id});
							self.action_user('create',machine.machinetype+' 1 '+machine.machinename+' '+machine.ram.myvalue+'k '+
														machine.cpunumber+' '+isItAvailable.ram+'k '+isItAvailable.storage+'k',
														function(){});
						}
					});	
				})
			}

			/**
			 * Return the value to put in the database in function of the initial value and its unit
			 * @param {Number} value	Value got from the form
			 * @param {String} unit		Unit associated to the value
			 * @return {Number}			Value to put in thte database
			 */
			this.set_myvalue=(value,unit)=>{
				switch(unit){
					case "K":
					return value;
					break;
					case "M":
					return value*1024;
					break;
					case "G":
					return value*1024*1024;
					break;
					default:
					break;
				}
			}

			/**
			 * Transform the value in parameter in function on the unit, since everything in the database is in K
			 * @param {Number} value	Value to convert that was previously in the database
			 * @param {String} unit		Unit associated to the value
			 * @return {Number}			Converted value
			 */
			this.convert = (value,unit) => {
				switch(unit){
					case "K":
						return value;
					break;
					case "M":
						return value/1024;
					break;
					case "G":
						return value/1024/1024;
					break;
					default:
					break;
				}	
			}

			/**
			 * Insert one or several machines according to what is put in the form in the database
			 */
			this.insertMachine = () => {
				this.save();
				// If we selected the "other" option, we get what the user wrote, else we choose the option (ubuntussh,...)
				if(this.machinetypeSelect!='other')
					this.newMachine.machinetype=this.machinetypeSelect;
				else
					this.newMachine.machinetype=this.machinetypeInput;
				// Later, we add to the machinename other informations. It will begin with the username
				this.newMachine.machinename=this.currentUser.username;
				this.newMachine.cpu.myvalue = this.set_myvalue(this.newMachine.cpu.myvalue,this.cpuunit);
				this.newMachine.cpu.unit=this.cpuunit;
				this.newMachine.ram.myvalue = this.set_myvalue(this.newMachine.ram.myvalue,this.ramunit);
				this.newMachine.ram.unit=this.ramunit;
				this.newMachine.storage.myvalue = this.set_myvalue(this.newMachine.storage.myvalue,this.storageunit);
				this.newMachine.storage.unit=this.storageunit;
				this.newMachine.bandwidth.myvalue = this.set_myvalue(this.newMachine.bandwidth.myvalue,this.bandwidthunit);
				this.newMachine.bandwidth.unit=this.bandwidthunit;
				// We try to allocate n times the machine that we put in the form
				for(var i=0;i<this.machineNumber;i++){
					this.currentUser.getSubscriber().allocate(this.newMachine, function(){});
				}
				// reset form
				document.getElementById("machineType").value = "";
				document.getElementById("nbmch").value = "";
				this.newMachine={};
			};

			/**
			 * Check if the resource allocated is available, if it is not we allocate another one
			 * If it is correctly reallocated or if it is available,
			 * we call action_user('create') with parameters to create and be able to connect to the machine
			 * @param {Object} machine	Machine to start
			 */
			this.startMachine = (machine) => {
				// Save the ssh key, can be necessary
				this.save();
				var self = this;
				// We check if the resource is available and we get infos for action_user parameters
				this.getInfoFromRessource(machine.ressource_id, function (err, resourceInfo) {
					// Case when the resource is not in the database anymore: we allocate the machine
					if(err || resourceInfo.err){
						// reallocating the ressource
						self.throw_success('reallocate',
											'The machine that you are trying to start could be removed'+
											'or deplaced since the current provider is not accessible.')
						machine.machinename=self.currentUser.username;

						Machines.remove({_id: machine._id},(error) => {
							if (error) self.throw_error('remove','Unable to remove machine')
						});

						self.allocateStart(machine);
						return;
					}
					// Case when the resource is not usable: we desallocate then allocate the machine
					if(! resourceInfo.usable)
					{
						// reallocating the ressource
						self.throw_success('reallocate','The machine that you are trying to start could be removed'+
											' or deplaced since the current provider is not accessible.')
						machine.machinename=self.currentUser.username;
						self.currentUser.getSubscriber().desallocate(machine, function (err, resp) {
							if (err) return self.throw_error("desallocate", "desallocation failed");
							self.allocateStart(machine);
						})
					}
					// Case when the initial resource is available
					else{
						self.action_user('create',machine.machinetype+' 1 '+machine.machinename+' '+machine.ram.myvalue+'k '+
												machine.cpunumber+' '+resourceInfo.ram+'k '+resourceInfo.storage+'k',
												function(){});
					}
				});
			};

			/**
			 * Call action_user with stop for the machine in parameter
			 * @param {Object} machine	Machine to stop
			 * @param {function()} cb	Callback when the update of the database is done
			 * @return {notification}	Notifies when the update is done
			 */
			this.stopMachine = (machine,cb) => {
				var self = this;
				this.action_user('stop',machine,function(){
					machine.state='down';
					Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
						if (error) self.throw_error('stop','Unable to stop machine');
						return cb();
					});
				});
			};

			/**
			 * Stop the machine then desallocate it in the database
			 * @param {Object} machine	Machine to delete
			 */
			this.deleteMachine = (machine) => {
				var self = this;
				// on kill instance if it's running, then desallocate
				if(machine.state==='up'){
					this.stopMachine(machine,function(){
						self.currentUser.getSubscriber().desallocate(machine, function(){});
					});
				}else{
					// instance is not up, we can desallocate
					self.currentUser.getSubscriber().desallocate(machine, function(){});
				}
			};		

			/**
			 * Generate a text file to download for the user that contains the ssh configuration
			 * @param {Object} machine
			 */
			this.generate = (machine) => {

				makeTextFile = function (text) {
					var data = new Blob([text], {type: 'text/plain'});
					if (textFile !== null) {
						window.URL.revokeObjectURL(textFile);
					}
					var textFile = window.URL.createObjectURL(data);
					return textFile;
				};

				function downloadURI(uri, name) {
					var link = document.createElement("a");
					link.download = name;
					link.href = uri;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}

				var ssh_string='# Host is an alias , Hostname is the name of the user instance\n';
				ssh_string+='# We presume that you private key is  ~/.ssh/id_rsa\n';
				ssh_string+='# To ssh your instance : type the following command\n';
				ssh_string+='# ssh -F iaas-'+machine.machinename+'.config '+machine.machinename+'\n';
				ssh_string+='Host '+machine.machinename+'\n';
				ssh_string+='\tHostname '+machine.machinename+'\n';
				ssh_string+='\tStrictHostKeyChecking no\n';
				ssh_string+='\tProxyCommand  ssh -i ~/.ssh/id_rsa iaas-client@'+machine.dns+' netcat %h %p\n';
				ssh_string+='\tUser root\n';

				downloadURI(makeTextFile(ssh_string),'iaas-'+machine.machinename+'.config');
			};

			/**
			 * Generate a text file to download for the user that contains the ssh configuration for every machine
			 */
			this.generate_all = () => {

				makeTextFile = function (text) {
					var data = new Blob([text], {type: 'text/plain'});
					if (textFile !== null) {
						window.URL.revokeObjectURL(textFile);
					}
					var textFile = window.URL.createObjectURL(data);
					return textFile;
				};

				function downloadURI(uri, name) {
					var link = document.createElement("a");
					link.download = name;
					link.href = uri;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}

				var ssh_string="";
				ssh_string+='# Host is an alias , Hostname is the name of the user instance\n';
				ssh_string+='# We presume that you private key is  ~/.ssh/id_rsa\n';
				ssh_string+='# To ssh your instance :\n';
				ssh_string+='# ssh -F <config_file> <instance_name>\n';

				for(var i=0;i<this.machines.length;i++){
					var machine = this.machines[i];
					ssh_string+='#Instance '+machine.machinename+'\n';
					ssh_string+='Host '+machine.machinename+'\n';
					ssh_string+='\tHostname '+machine.machinename+'\n';
					ssh_string+='\tStrictHostKeyChecking no\n';
					ssh_string+='\tProxyCommand  ssh -i ~/.ssh/id_rsa iaas-client@'+machine.dns+' netcat %h %p\n';
					ssh_string+='\tUser root\n';
				}

				downloadURI(makeTextFile(ssh_string),'iaas-'+this.currentUser.username+'.config');
			};
		}
	}
});