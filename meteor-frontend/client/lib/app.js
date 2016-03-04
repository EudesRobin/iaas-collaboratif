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
      /**
       * Used to create a link inside the body
       */
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
		/**
		 * @return user database (only what is published)
		  */
		users: () => {
			return Meteor.users.find({});
		},
		/**
		 * @return {Boolean} true if the user is connected
		 */
		isLoggedIn: () => {
			return Meteor.userId() !== null;
		},
		/**
		 * @return {Number} Id of the user
		 */
		currentUserId: () => {
			return Meteor.userId();
		}
	});
}]);

/**
 * Loads bootsrap only when the page is charged
 */
function onReady() {
	angular.bootstrap(document, ['iaas-collaboratif'], {
		strictDi: true
	});
}

if (Meteor.isCordova)
	angular.element(document).on("deviceready", onReady);
else
	angular.element(document).ready(onReady);
