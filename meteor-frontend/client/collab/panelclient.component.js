angular.module('iaas-collaboratif').directive('collab', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/collab/panelclient.html',
    controllerAs: 'collab',
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

	    this.exec_cmd = function (param) {
  			Meteor.call('exec_cmd',param, function (err, response) {
          if(err){
            console.log(err);
          }else{
  	  			console.log(response);
          }
  			});
		  };
    }
  }
});