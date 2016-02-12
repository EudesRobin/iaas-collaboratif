angular.module('iaas-collaboratif').directive('provider', function () {
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
				partiesCount: () => {
					return Counts.get('numberOfParties');
				},
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				currentUserId: () => {
					return Meteor.userId();
				},
				currentUser: () => {
					return Meteor.users.findOne(Meteor.userId());
				}
			});

			this.save = (newDns) => {

				Meteor.users.update({_id: Meteor.userId()}, {
					$set: {
						provider : {dns: newDns}
					}
				}, (error) => {
					if (error) {
						console.log('Oops, unable to update the user...');
					}
					else {
						console.log('Done!');
					}
				});
			};
		}
	}
});
