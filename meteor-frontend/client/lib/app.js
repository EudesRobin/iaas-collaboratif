angular.module('iaas-collaboratif', [
  'angular-meteor',
  'ui.router',
  'accounts.ui',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps',
  'ui.bootstrap'
]);

angular.module('iaas-collaboratif').controller("rootCtrl", ['$scope', function($scope){
  $scope.greeting = 'Hola!';
  $scope.users = function () {
    return Meteor.users.find({});
  },
  $scope.partiesCount = function () {
    return Counts.get('numberOfParties');
  },
  $scope.isLoggedIn = function () {
    return Meteor.userId() !== null;
  },
  $scope.currentUserId = function () {
    return Meteor.userId();
  }
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