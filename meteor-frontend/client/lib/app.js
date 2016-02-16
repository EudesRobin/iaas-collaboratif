angular.module('iaas-collaboratif', [
	'angular-meteor',
	'ui.router',
	'accounts.ui',
	'angularUtils.directives.dirPagination',
	'ui.bootstrap'
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

  $scope.exec_cmd = function (cmd,param) {
    Meteor.call('exec_cmd',cmd,param, function (err, response) {
        if(err){
            var title;
            switch(cmd){
                case "create":
                title = "Creation instance"
                break;
                case "stop":
                title = "Kill instance"
                break;
                case "test":
                title = "Test command"
                break;
                default:
                title = "Unknown command"
            }
            $.notify({
            // options
            icon: 'glyphicon glyphicon-remove-sign',
            title: title+"<br>",
            message: "error :"+err.error+" - invalid parameter : "+err.reason+"<br>"+err.details,
            },{
            //settings
            type: 'danger',
            newest_on_top: true,
            allow_dismiss: true,
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
                case "test":
                title = "Test command"
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
