angular.module('iaas-collaboratif').directive('help', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/help/help.html',
    controllerAs: 'help',
    controller: function ($scope, $reactive, $modal) {
		$reactive(this).attach($scope);
    }
  }
});