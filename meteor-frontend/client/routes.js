angular.module('iaas-collaboratif')
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('collab', {
        url: '/collab',
        template: '<collab></collab>'
      });

    $urlRouterProvider.otherwise("/collab");
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('collab');
      }
    });
  });