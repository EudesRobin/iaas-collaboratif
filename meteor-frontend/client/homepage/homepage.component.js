angular.module('iaas-collaboratif').directive('homepage', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/homepage/homepage.html',
    controllerAs: 'homepage',
    controller: function ($scope, $reactive, $modal) {
		$reactive(this).attach($scope);

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
	        }
	    });
    }
  }
});