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
        template: '<user></user>'
      })
      .state('collab', {
        url: '/collab',
        template: '<collab></collab>'
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