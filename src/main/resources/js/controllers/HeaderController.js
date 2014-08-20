angular.module('WorkView').controller('headerController', ['$scope', '$date', '$utilities', 'ProjectsFactory', function($scope, $date, $utilities, projectsFactory) {
    $scope.projects = projectsFactory.getProjects().length;

    $scope.countStories = function(completed) {
        var result = 0;
        angular.forEach(projectsFactory.getProjects(), function(project) {
            result += $utilities.storyCount(project, completed);
        });
        return result;
    };

    $scope.contributors = function() {
        return 10;
    };
}]);