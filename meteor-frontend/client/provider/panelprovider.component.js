
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
			 * Says if a resource is usable or not
			 * @param {Object} resource
			 * @return {Boolean} resource.usable
			 */
			this.isUsable=(ressource)=>{
				return ressource.usable;
			}

			/**
			 * Update a resource with the modified fields of the form
			 * @param {String} rid	id of the resource to update
			 */
			this.updateRessource=(rid) => {
				var ressource = Ressources.find({_id:rid}).fetch()[0];
				if (dns.value!=""||cpuNumber.value!=""||cpu.value!=""||ram.value!=""||bandwidth.value!=""||storage.value!=""){
					dns.value = dns.value==""? ressource.dns:dns.value;
					cpuNumber.value = cpuNumber.value==""? ressource.cpunumber.total:cpuNumber.value;
					cpu.value = cpu.value==""? ressource.cpu:cpu.value;
					ram.value = ram.value==""? ressource.ram.total:ram.value;
					bandwidth.value = bandwidth.value==""? ressource.bandwidth.total:bandwidth.value;
					storage.value = storage.value==""? ressource.storage.total:storage.value;
					Ressources.update({_id: ressource._id}, {$set:{
						dns:dns.value,
						cpunumber:{total:Number(cpuNumber.value),available:Number(cpuNumber.value)},
						cpu:Number(cpu.value),
						ram:{total:Number(ram.value),available:Number(ram.value)},
						bandwidth:{total:Number(bandwidth.value),available:Number(bandwidth.value)},
						storage:{total:Number(storage.value),available:Number(storage.value)}
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
			 * After setting its available sets, the object newRessource is inserted in the Ressources database
			 * The form is then cleaned
			 */
			this.insertRessource = () => {
				this.newRessource.cpunumber.available = this.newRessource.cpunumber.total;
				this.newRessource.ram.available = this.newRessource.ram.total;
				this.newRessource.storage.available = this.newRessource.storage.total;
				this.newRessource.bandwidth.available = this.newRessource.bandwidth.total;
				var self = this;
				this.currentUser.getProvider().addRessource(this.newRessource, function(err){
					if(err) self.throw_error('insert',err);
				});
				this.newRessource ={};
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
				Ressources.remove({_id: ressource._id},(error) => {
					if (error) self.throw_error('remove','Unable to remove domain');
					else self.throw_success('remove','Domain is removed !')
				});
			};
		}
	}
});
