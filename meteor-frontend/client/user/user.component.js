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

			this.startMachine = (machine) => {
				this.save();
				//exec_cmd('launch_machine',Meteor.userId+" \""+this.currentUser.subscriber.sshKey+"\"");
				machine.state='up';
				Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
					if (error) console.error('Oops, unable to update the machine...');
					else console.log('Done!');
				});
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