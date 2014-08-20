//initialize our module with ngAnimate, ngCookies and ui.bootstrap as dependencies
angular.module('WorkView', ['ngAnimate', 'ngCookies', 'ui.bootstrap', 'epic-date', 'epic-utilities']);

//enable html5 mode so that $location.search() works as expected
angular.module('WorkView').config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});

//simple factory that returns the current context of the application
angular.module('WorkView').factory('Context', function() {
    return jQuery('meta[name="ajs-context-path"]').attr('content');
});