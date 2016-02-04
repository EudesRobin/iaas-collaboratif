'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/overview.html'
            })
            .state('tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html'
            })
            .state('share', {
                url: '/share',
                templateUrl: 'templates/share.html'
            });
    }
]);