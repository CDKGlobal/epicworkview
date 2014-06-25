/*
 * Controller to manage table of projects
 */
function ProjectController($scope, $http) {
       
    // Get all the projects and set them in a local variable (projects)
    $scope.getProjects = function() {
    	$http.get('/jira/rest/epic/1/projects.json').
	    success(function(data, status, headers, config) {
	      $scope.projects = data.projects;
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
    }
    
    // Get the projects now
    $scope.getProjects();
    
    // Get projects again every 10 seconds
    setInterval(function(){$scope.getProjects();}, 10000);
    
}

/*
 * Controller for the epics of a project
 * Determines which epic information to display
 */
function EpicController($scope) {
	$scope.clickedEpic = null;
    
    // Set the clicked epic to be name or null if it is already name
    $scope.toggleEpic = function(name) {
    	if ($scope.clickedEpic == name) {
    		$scope.clickedEpic = null;
    	} else {
    		$scope.clickedEpic = name;
    	}
    }
    
    // Return whether the clicked epic is this epic
    $scope.showEpicDescription = function(name) {
    	return $scope.clickedEpic == name;
    }
}
	