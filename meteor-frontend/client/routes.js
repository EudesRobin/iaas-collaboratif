angular.module('iaas-collaboratif')
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('homepage', {
        url: '/',
        template: '<homepage></homepage>'
      })
      .state('user', {
        url: '/user',
        template: '<user></user>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            }
            else {
              return $q.resolve();
            }
          }
        }
      })
      .state('collab', {
        url: '/collab',
        template: '<collab></collab>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            }
            else {
              return $q.resolve();
            }
          }
        }
      });
    $urlRouterProvider.otherwise("/");

  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        //$state.go('/');
      }
    });
  });