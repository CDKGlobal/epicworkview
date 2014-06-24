// Controller to manage table of projects

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
	