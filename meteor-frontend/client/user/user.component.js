angular.module('iaas-collaboratif').directive('user', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/user/user.html',
		controllerAs: 'user',
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
				machines: () => {
					return Machines.find({user_id: Meteor.userId()});
				}
			});

			this.machinesIsEmpty = () => {
				return Machines.find({user_id: Meteor.userId()}).fetch().length == 0;
			}

			this.getRowClass = (machine) => {
				if(machine.state==="up"){
					return "success";
				}
				else if(machine.state==="initial"){
					return "warning";
				}
				else{
					return "danger";
				}
			}

			this.save = () => {
				this.currentUser.getSubscriber().setFields(this.currentUser.subscriber);
			};

			this.insertMachine = () => {
				this.save();
				this.currentUser.getSubscriber().allocate(this.newMachine);
			};


			this.action_user = (cmd,param) => {
				cmd_concat=cmd+'_user';
				Meteor.call('exec_cmd',cmd_concat,param, function (err, response) {
					if(err){
						var title;
						switch(cmd){
							case "create":
							title = "Creation instance"
							break;
							case "stop":
							title = "Kill instance"
							break;
							case "remove":
							title = "Remove instance"
							break;						
							default:
							title = "Unknown command"
						}
						$.notify({
				            // options
				            icon: 'glyphicon glyphicon-remove-sign',
				            title: title+"<br>",
				            message: "Error :"+err.error+" Invalid parameter : ("+err.reason+")<br>"+err.details,
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
						// redef - 4debug
						var msg="successful";
						switch(cmd){
							case "create":
							title = "Creation instance<br>"
							msg= response;
							break;
							case "stop":
							title = "Kill instance<br>"
							msg= response;
							break;
							case "remove":
							title = "Remove instance<br>"
							msg=response;
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
				});
};

this.throw_error = (cmd,params) => {
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

this.startMachine = (machine,params) => {
	this.save();
	console.log(Meteor.userId()+' '+machine.dns);
				//this.action_user('launch_machine',Meteor.userId()+' '+machine.dns);
				temp_machine = Ressources.find({_id: machine.ressource_id}).fetch();

				if (temp_machine[0].usable){
					machine.state='up';
					Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
						if (error) this.throw_error('create','Unable to start machine');
						else this.action_user('create',params);
					});
				}
			};

			this.stopMachine = (machine,params) => {
				machine.state='down';
				Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
					if (error) this.throw_error('stop','Unable to stop machine');
					else this.action_user('stop',params);
				});
			};

			this.deleteMachine = (machine) => {
				this.currentUser.getSubscriber().desallocate(machine._id);
				// how to throw error / success notif here ?
				//if (error) this.throw_error('remove','Unable to remove machine');
				//else this.action_user('remove',params);
			};
		}
	}
});