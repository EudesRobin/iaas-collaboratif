angular.module('iaas-collaboratif').directive('profile', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/profile/profile.html',
		controllerAs: 'profile',
		controller: function ($scope, $reactive, $modal) {
			$reactive(this).attach($scope);

			this.subscribe('users');

			this.helpers({
				/**
				 * @return {Object} current user
				 */
				currentUser: () => {
					return Meteor.users.findOne(Meteor.userId());
				}
			});

			/**
			 * Makes an error notification
			 * @param {String} cmd		Type of command: update
			 * @param {String} params	Message of the notification
			 */
			this.throw_error = (cmd,params) => {
				var title;
				switch(cmd){
					case "update":
					title = "Error update profile"
					break;					
					default:
					title = "Error Unknown command"
				}
				$.notify({
					// options
					icon: 'glyphicon glyphicon-remove-sign',
					title: title+"<br>",
					message: params,
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
			};

			/**
			 * Makes a success notification
			 * @param {String} cmd		Type of command: update
			 * @param {String} params	Message of the notification
			 */
			this.throw_success = (cmd,params) => {
				var title;
				var message = "successful"
				switch(cmd){
					case "update":
					title = "Update profile"
					break;					
					default:
					title = "Unknown command"
				}
				$.notify({
					// options
					icon: 'glyphicon glyphicon-ok-sign',
					title: title+"<br>",
					message: message,
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
			};

			/**
			 * Update the email and the username of the user in thhe database
			 */
			this.save = () => {
				Meteor.users.update({_id: Meteor.userId()}, {
					$set: {
						emails: [this.currentUser.emails[0]],
						username: this.currentUser.username
					}
				}, (error) => {
					if (error) {
						this.throw_error('update','Failure during update');
					}
					else {
						this.throw_success('update','OK');
					}
				});
			};
		}
	}
});