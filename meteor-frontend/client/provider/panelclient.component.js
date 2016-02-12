angular.module('iaas-collaboratif').directive('provider', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/provider/panelclient.html',
    controllerAs: 'provider',
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