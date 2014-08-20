angular.module('WorkView').controller('headerController', ['$scope', '$date', '$utilities', 'ProjectsFactory', function($scope, $date, $utilities, projectsFactory) {
	
	$scope.showHeader = true;
	$scope.showHeaderOpener = false;
	
    $scope.projects = function() {
        var projects = [];
        angular.forEach(projectsFactory.getProjects(), function(project) {
            if(project.included) {
                projects.push(project);
            }
        });
        return projects;
    };

    $scope.projectCount = function() {
        return $scope.projects().length
    };

    $scope.countStories = function(completed) {
        var result = 0;
        angular.forEach($scope.projects(), function(project) {
            result += $utilities.storyCount(project, completed);
        });
        return result;
    };

    $scope.contributors = function() {
        var result = {};
        angular.forEach($scope.projects(), function(project) {
            angular.forEach($utilities.getContributors(project), function(contributor) {
                result[contributor.id] = true;
            });
        });

        return Object.keys(result).length;
    };
}]);