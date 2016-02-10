angular.module('iaas-collaboratif').directive('collab', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/collab/panelclient.html',
    controllerAs: 'collab',
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

	    this.bashpwd = function () {
  			Meteor.call('bashpwd', function (err, response) {
  	  			console.log(response);
  			});
		  };
    }
  }
});