angular.module('iaas-collaboratif').directive('profile', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/profile/profile.html',
		controllerAs: 'profile',
		controller: function ($scope, $reactive, $modal) {
			$reactive(this).attach($scope);


			// this.save = () => {

			// 	if (user.emails) {
			// 		user.emails[0].address = this.newMail;
			// 	}
			// 	else {
			// 		console.log('Oops, unable to access the mail...');
			// 	}
			// 	Users.update({_id: $stateParams.partyId}, {
			// 		$set: {
			// 			name: this.party.name,
			// 			description: this.party.description,
			// 			'public': this.party.public,
			// 			location: this.party.location
			// 		}
			// 	}, (error) => {
			// 		if (error) {
			// 			console.log('Oops, unable to update the party...');
			// 		}
			// 		else {
			// 			console.log('Done!');
			// 		}
			// 	});
			// };
		}
	}
});