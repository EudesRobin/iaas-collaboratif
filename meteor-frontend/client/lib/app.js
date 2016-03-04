angular.module('iaas-collaboratif', [
	'angular-meteor',
	'ui.router',
	'accounts.ui',
	'angularUtils.directives.dirPagination',
	'ui.bootstrap'
	])
.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    });
    }
}
}
]);

angular.module('iaas-collaboratif').controller("rootCtrl", ['$scope', function($scope){
	$scope.helpers({
		users: () => {
			return Meteor.users.find({});
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
