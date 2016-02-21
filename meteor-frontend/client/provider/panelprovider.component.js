
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
				users: () => {
					return Meteor.users.find({});
				},
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				currentUserId: () => {
					return Meteor.userId();
				},
				currentUser: () => {
					return Meteor.users.findOne(Meteor.userId());
				},
				ressources: () => {
					// return (Meteor.users.findOne(Meteor.userId())!=null) ? Meteor.users.findOne(Meteor.userId()).getProvider().getRessources() : null;
					return Ressources.find({user_id: Meteor.userId()});
				}
			});

			this.ressourcesIsEmpty = () => {
				return Ressources.find({user_id: Meteor.userId()}).fetch().length == 0;
			}

			// needed to get id for the modify form ressource provider
			// I think there is a better way to do this...
			this.getid = () => {
				return document.getElementById("rid").value;
			}

			this.Isusable=(ressource)=>{
				return ressource.usable===true;
			}

			this.updateRessource=(rid) => {
				var ressource = Ressources.find({_id:rid}).fetch()[0];
				Ressources.update({_id: ressource._id}, {$set:{
					dns:dns.value,cpu:Number(cpu.value),
					ram:{total:Number(ram.value),available:Number(ram.value)},
					bandwidth:{total:Number(bandwidth.value),available:Number(bandwidth.value)},
					storage:{total:Number(storage.value),available:Number(storage.value)}
				}},(error) => {
					if (error)this.throw_error('modify','Unable to modify properties');
					else this.throw_success('modify','Domain properties modified');
					// reset form
					document.getElementById("modfmachine").reset();
				});
				$('#modify_machine').modal('hide');

			}

			this.insertRessource = () => {
				this.newRessource.ram.available = this.newRessource.ram.total;
				this.newRessource.storage.available = this.newRessource.storage.total;
				this.newRessource.bandwidth.available = this.newRessource.bandwidth.total;
				this.currentUser.getProvider().addRessource(this.newRessource);
				this.newRessource ={};
				$('#add').modal('hide');
			};

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

			this.throw_error = (cmd,params) => {
				var title;
				switch(cmd){
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

			this.startRessource = (ressource) => {
				ressource.usable=true;
				Ressources.update({_id: ressource._id}, {$set:{usable:ressource.usable}}, (error) => {
					if (error) this.throw_error('start','Unable to make domain online');
					else this.throw_success('start','Domain is online !');
				});
			};

			this.stopRessource = (ressource) => {
				ressource.usable=false;
				for(i=0;i<ressource.machines_ids.length;i++){
					Machines.update({_id: ressource.machines_ids[i]}, {$set:{state:'down'}}, (error) => {
						if (error) this.throw_error('stop','Unable to make domain offline 1/2');
						else this.throw_success('stop','Domain is offline 1/2!')
					});
					 //console.log(Machines.find({_id: ressource.machines_ids[i]}.state));
					}
					Ressources.update({_id: ressource._id}, {$set:{usable:ressource.usable}}, (error) => {
						if (error) this.throw_error('stop','Unable to make domain offline 2/2');
						else this.throw_success('stop','Domain is offline 2/2!')
					});
				};

				this.deleteRessource = (ressource) => {
					Ressources.remove({_id: ressource._id},(error) => {
						if (error) this.throw_error('remove','Unable to remove domain');
						else this.throw_success('remove','Domain is removed !')
					});
				};

				this.save = () => {
					this.currentUser.getProvider().setFields(this.currentUser.provider);
				};

				this.getRowClass = (usable) => {
					return usable ? "success" : "danger";
				}

				this.SaveProviderRessources=()=>{
					Meteor.users
				}
			}
		}
	});
