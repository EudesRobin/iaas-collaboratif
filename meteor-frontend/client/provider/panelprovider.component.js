
angular.module('iaas-collaboratif')
.directive('provider', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/provider/panelprovider.html',
		controllerAs: 'provider',
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
				 * @return {Object} Ressources of the user
				 */
				ressources: () => {
					return Ressources.find({user_id: Meteor.userId()});
				}
			});

			/**
			 * @return {Boolean} true if there are no ressources for the current user
			 */
			this.ressourcesIsEmpty = () => {
				return Ressources.find({user_id: Meteor.userId()}).fetch().length == 0;
			}

			/**
			 * Get the table line class (in order to change its color) in function of the field usable of the resource
			 * @param {Boolean} usable	Field usable of the resource
			 * @return {String}	success if usable (green), else danger (red)
			 */
			this.getRowClass = (usable) => {
				return usable ? "success" : "danger";
			}

			/**
			 * Update the provider fields for the user
			 */
			this.save = () => {
				this.currentUser.getProvider().setFields(this.currentUser.provider);
			};

			/**
			 * @return {String} Id of the ressource to update
			 */
			this.getRessourceId = () => {
				return document.getElementById("rid").value;
			}


			/**
			 * @param {String} rid	Id of the resource
			 * @return {Object}		Resource object associated to the id
			 */
			this.getRessource = (rid) => {
				return Ressources.findOne({_id: rid});
			}

			/**
			 * @param {String} rid	Id of the resource
			 * @return [{Object}]	Rate table associated to the id
			 */
			this.getRates = (rid) => {
				var res = Ressources.findOne({_id: rid});
				return Rates.find({providerdns:res.dns}).fetch();
			}

			/**
			 * Says if a resource is usable or not
			 * @param {Object} resource
			 * @return {Boolean} resource.usable
			 */
			this.isUsable=(ressource)=>{
				return ressource.usable;
			}

			this.action_provider = (cmd,param,cb) => {
				cmd_concat=cmd+'_provider';
				// Call the exec_cmd function (server/startup/load.js)
				Meteor.call('exec_cmd',cmd_concat,param, function (err, response) {
					if(err){
						var title;
						switch(cmd){
							case "coordinator":
							title = "Error update coordinator name"
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
							case "coordinator":
							title = "Update coordinator name<br>"
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
			 * Update a resource with the modified fields of the form
			 * @param {String} rid	id of the resource to update
			 */
			this.updateRessource=(rid) => {
				var ressource = Ressources.find({_id:rid}).fetch()[0];
				if (dns.value!==""||cpuNumber.value!=""||cpu.value!=""||ram.value!=""||bandwidth.value!=""||storage.value!=""){
					dns.value = dns.value==""? ressource.dns:dns.value;
					cpuNumber.value = cpuNumber.value==""? ressource.cpunumber.total:cpuNumber.value;
					var cpu_val;
					var ram_val;
					var storage_val;
					var bandwidth_val;
					var cpu_unit = document.getElementById('unitcpu').value;
					var ram_unit = document.getElementById('unitram').value;
					var bandwidth_unit = document.getElementById('unitbandwidth').value;
					var storage_unit = document.getElementById('unitstorage').value;

					if(cpu.value===""){
						cpu_val = ressource.cpu.speed;
					}else{
						cpu_val = this.set_myvalue(cpu.value,cpu_unit);
					}
					if(ram.value===""){
						ram_val = ressource.ram.total;
					}else{
						ram_val = this.set_myvalue(ram.value,ram_unit);
					}
					if(storage.value===""){
						storage_val = ressource.storage.total;
					}else{
						storage_val = this.set_myvalue(storage.value,storage_unit);
					}
					if(bandwidth.value===""){
						bandwidth_val = ressource.bandwidth.total;
					}else{
						bandwidth_val = this.set_myvalue(bandwidth.value,bandwidth_unit);
					}



					Ressources.update({_id: ressource._id}, {$set:{
						dns:dns.value,
						cpunumber:{total:Number(cpuNumber.value),available:Number(cpuNumber.value)},
						cpu:{speed:Number(cpu_val),unit:cpu_unit},
						ram:{total:Number(ram_val),available:Number(ram_val),unit:ram_unit},
						bandwidth:{total:Number(bandwidth_val),available:Number(bandwidth_val),unit:bandwidth_unit},
						storage:{total:Number(storage_val),available:Number(storage_val),unit:storage_unit}
					}},(error) => {
						if (error)this.throw_error('modify','Unable to modify properties');
				else this.throw_success('modify','Domain properties modified');
					// reset form
					document.getElementById("modfmachine").reset();
				});
				}
				$('#modify_machine').modal('hide');

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
			 * Converts values got from the form into K, set the available field and add the resource into the database
			 * The form is then cleaned
			 */
			this.insertRessource = () => {

				this.newRessource.cpunumber.available = this.newRessource.cpunumber.total;

				this.newRessource.cpu.unit=this.cpuunit;
				this.newRessource.cpu.speed=this.set_myvalue(this.newRessource.cpu.speed,this.cpuunit);

				this.newRessource.ram.unit=this.ramunit;
				this.newRessource.ram.total=this.set_myvalue(this.newRessource.ram.total,this.ramunit);
				this.newRessource.ram.available = this.newRessource.ram.total;

				this.newRessource.storage.unit=this.storageunit;
				this.newRessource.storage.total=this.set_myvalue(this.newRessource.storage.total,this.storageunit);
				this.newRessource.storage.available = this.newRessource.storage.total;

				this.newRessource.bandwidth.unit=this.bandwidthunit;
				this.newRessource.bandwidth.total=this.set_myvalue(this.newRessource.bandwidth.total,this.bandwidthunit);
				this.newRessource.bandwidth.available = this.newRessource.bandwidth.total;
				var self = this;
				this.currentUser.getProvider().addRessource(this.newRessource, function(err){
					if(err) self.throw_error('insert',err);
				});
				this.action_provider('coordinator',this.newRessource,function(){self.throw_success('coordinator','Domain is confirmed online !')});

				this.newRessource ={};
				this.bandwidthunit="";
				this.cpuunit="";
				this.ramunit="";
				this.storageunit="";

				$('#add').modal('hide');


			};

			/**
			 * Makes a success notification
			 * @param {String} cmd		Type of command: start/stop/remove/modify
			 * @param {String} params	Message of the notification
			 */
			this.throw_success = (cmd,param) => {
				var title;
				var msg="successful";
				switch(cmd){
					case "start":
					title = "Domain online<br>"
					break;
					case "stop":
					title = "Domain offline<br>"
					break;
					case "remove":
					title = "Domain deleted<br>"
					break;
					case "modify":
					title = "Domain properties update<br>"
					break;
					case "coordinator":
					title="Update coordinator name"
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
			 * @param {String} cmd		Type of command: insert/start/stop/remove/modify
			 * @param {String} params	Message of the notification
			 */
			this.throw_error = (cmd,params) => {
				var title;
				switch(cmd){
					case "insert":
					title = "Error - Insert failure"
					break;
					case "start":
					title = "Error - Domain not online"
					break;
					case "stop":
					title = "Error - Domain not offline"
					break;
					case "remove":
					title = "Error - Domain not deleted"
					break;
					case "modify":
					title = "Domain properties update<br>"
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
			 * Set the usable field of the resource in database at true
			 * @param {Object} ressource	Resource to start
			 */
			this.startRessource = (ressource) => {
				var self = this;
				ressource.usable=true;
				Ressources.update({_id: ressource._id}, {$set:{usable:ressource.usable}}, (error) => {
					if (error) this.throw_error('start','Unable to make domain online');
					else this.throw_success('start','Domain is online !');
				});
			};

			/**
			 * Call the stopRessource on the server for the resource given (model/ressources.js)
			 * @param {Object} ressource	Resource to stop
			 */
			this.stopRessource = (ressource) => {
				var self = this;
				Meteor.call("stopRessource", ressource._id, function(err){
					if (err) self.throw_error("stop","Failed to stop the ressource");
					self.throw_success("stop","Ressource is stopped and machines set to down")
				})
			};

			/**
			 * Stop the resource given then remove it from the database
			 * @param {Object} ressource	Resource to delete
			 */
			this.deleteRessource = (ressource) => {
				var self =this;
				Meteor.call("stopRessource", ressource._id, function(err, res){
					if (err) self.throw_error("stop","Failed to stop the ressource");
				})
				Meteor.call("deleteRates", ressource.dns, function(err, res){
					if (err) self.throw_error("stop","Failed to delete the rates");
				})
				Ressources.remove({_id: ressource._id},(error) => {
					if (error) self.throw_error('remove','Unable to remove domain');
					else self.throw_success('remove','Domain is removed !')
				});
			};

			/**
			 * @return [{Object}]	Rates associated to the resource
			 */
			this.getRatesFromResource = (ressource) =>{
				return Rates.find({providerdns:ressource.dns}).fetch();;
			}

			/**
			 * Return the rate associated to the resource
			 * @param {Object} ressource	We want the rate of this resource
			 * @return {Number}				Rate of the resource
			 */
			this.getResourceRate = (ressource) =>{
				var rates = Rates.find({providerdns:ressource.dns}).fetch();
				var cpt=0;
				for(var i = 0;i<rates.length;i++){
					cpt+=rates[i].rate;
				}
				if(rates.length!=0)
					return Math.round(cpt/rates.length * 100) / 100;
				else
					return 0;
			}
		}
	}
});
