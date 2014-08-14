angular.module('WorkView', ['ngAnimate', 'ngCookies', 'ui.bootstrap']);

angular.module('WorkView').config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});

angular.module('WorkView').constant('Context', jQuery('meta[name="ajs-context-path"]').attr('content'));

angular.module('WorkView').controller('testController', ['$rootScope', '$scope', 'ProjectsFactory', function($rootScope, $scope, projectsFactory) {
    $scope.log = function() {
        console.log(projectsFactory.getProjects());
        console.log(projectsFactory.isLoading());
    };
    $scope.log();

    $scope.createProject = function() {
        $rootScope.$broadcast('newProject', {
            id: 10001,
            name: 'Test',
            group: 'no category'
        });
    };
}]);