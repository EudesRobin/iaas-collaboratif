angular.module('iaas-collaboratif').directive('user', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/user/user.html',
    controllerAs: 'user',
    controller: function ($scope, $reactive, $modal) {
      $reactive(this).attach($scope);

    }
  }
});