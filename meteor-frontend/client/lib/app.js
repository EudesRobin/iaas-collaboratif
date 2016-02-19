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

  $scope.action_test = function (cmd,param) {
    cmd_concat=cmd+'_test';
    Meteor.call('exec_cmd',cmd_concat,param, function (err, response) {
        if(err){
            var title;
            switch(cmd){
                case "create":
                title = "Error creation instance"
                break;
                case "stop":
                title = "Error  kill instance"
                break;
                default:
                title = "Error unknown command"
            }
            $.notify({
            // options
            icon: 'glyphicon glyphicon-remove-sign',
            title: title+"<br>",
            message: err.details,
            },{
            //settings
            type: 'danger',
            newest_on_top: true,
            allow_dismiss: true,
            template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                        '<span data-notify="icon"></span> ' +
                        '<span data-notify="title">{1}</span> ' +
                        '<span data-notify="message">{2}</span>' +
                      '</div>' ,
            });
        }

        if(response){
            var title;
            var msg="successful";
            switch(cmd){
                case "create":
                title = "Creation instance"
                break;
                case "stop":
                title = "Kill instance"
                break;
                default:
                title = "Unknown command"
            }
            $.notify({
            // options
            icon: 'glyphicon glyphicon-ok-sign',
            title: title,
            message: msg,
            },{
            //settings
            type: 'success',
            newest_on_top: true,
            allow_dismiss: true,
            template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                        '<span data-notify="icon"></span> ' +
                        '<span data-notify="title">{1}</span> ' +
                        '<span data-notify="message">{2}</span>' +
                      '</div>' ,
            });
        }
    });
};

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
