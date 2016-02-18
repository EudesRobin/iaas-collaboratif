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
				//this.$broadcast("myEvent", {title:"Test", error:"500",details: "tt"});
			};


			this.exec_cmd = (cmd,param) => {
				Meteor.call('exec_cmd',cmd,param, function (err, response) {
					if(err){
						var title;
						switch(cmd){
							case "launch_machine":
							title = "Launch machine"
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
						var msg="successful";
						switch(cmd){
							case "launch_machine":
							title = "Launch machine"
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

			this.startMachine = (machine) => {
				this.save();
				this.exec_cmd('launch_machine',Meteor.userId+' '+machine.dns);
				temp_machine = Ressources.find({_id: machine.ressource_id}).fetch();

				if (temp_machine[0].usable){
					machine.state='up';
					Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
						if (error) console.error('Oops, unable to update the machine...');
						else console.log('Done!');
				});
				}
			};

			this.stopMachine = (machine) => {
				machine.state='down';
				Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
					if (error) console.error('Oops, unable to update the machine...');
					else console.log('Done!');
				});
			};

			this.deleteMachine = (machine) => {
				Machines.remove({_id: machine._id});
			};
		}
	}
});