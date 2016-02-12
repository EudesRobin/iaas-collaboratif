angular.module('iaas-collaboratif').directive('profile', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/profile/profile.html',
		controllerAs: 'profile',
		controller: function ($scope, $reactive, $modal) {
			$reactive(this).attach($scope);

			this.subscribe('users');

			this.helpers({
				currentUser: () => {
					return Meteor.users.findOne(Meteor.userId());
				}
			});

			this.save = () => {

				Meteor.users.update({_id: Meteor.userId()}, {
					$set: {
						emails: [this.currentUser.emails[0]]
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