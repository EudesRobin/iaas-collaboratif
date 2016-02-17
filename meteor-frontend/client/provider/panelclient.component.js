
angular.module('iaas-collaboratif')
.directive('provider', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/provider/panelclient.html',
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

			this.insertRessource = () => {
				this.newRessource.cpu.available = this.newRessource.cpu.total;
				this.newRessource.ram.available = this.newRessource.ram.total;
				this.newRessource.storage.available = this.newRessource.storage.total;
				this.newRessource.bandwidth.available = this.newRessource.bandwidth.total;
				this.currentUser.getProvider().addRessource(this.newRessource);
				this.newRessource ={};
				$(".modal-backdrop").hide();
				$(".modal").hide();
			};

			this.startRessource = (ressource) => {
				ressource.usable=true;
				Ressources.update({_id: ressource._id}, {$set:{usable:ressource.usable}}, (error) => {
					if (error) console.error('Oops, unable to update the ressource...');
					else console.log('Done!');
				});
			};

			this.stopRessource = (ressource) => {
				ressource.usable=false;
				// for(int i=0;i<ressource.machines_id.length;i++){
				// 	Machines.update({_id: ressource.machines_id[i]}, {$set:{state:'down'}}, (error) => {
				// 	if (error) console.error('Oops, unable to update the machine...');
				// 	else console.log('Done!');
				// }
				Ressources.update({_id: ressource._id}, {$set:{usable:ressource.usable}}, (error) => {
					if (error) console.error('Oops, unable to update the ressource...');
					else console.log('Done!');
				});
			};

			this.deleteRessource = (ressource) => {
				Ressources.remove({_id: ressource._id});
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
