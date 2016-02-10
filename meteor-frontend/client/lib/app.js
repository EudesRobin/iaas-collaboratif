angular.module('iaas-collaboratif', [
  'angular-meteor',
  'ui.router',
  'accounts.ui',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps',
  'ui.bootstrap'
]);

angular.module('iaas-collaboratif').controller("rootCtrl", ['$scope', function($scope){
  $scope.helpers({
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
}]);

function onReady() {
  angular.bootstrap(document, ['iaas-collaboratif'], {
    strictDi: true
  });
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);