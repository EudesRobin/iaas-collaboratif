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

  $scope.exec_cmd = function (cmd,param) {
    Meteor.call('exec_cmd',cmd,param, function (err, response) {
      if(err){
        $.notify({
        // options
        icon: 'glyphicon glyphicon-remove-sign',
        title: cmd,
        message: response,
        },{
        //settings
        type: 'danger',
        newest_on_top: true,
        allow_dismiss: true,
        });
      }else{
        $.notify({
        // options
        icon: 'glyphicon glyphicon-ok-sign',
        title: cmd,
        message: response,
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
