
// Whether to continuously refresh projects
var refresh = true;

// The currently clicked epic, or null if none clicked
var clickedEpic = null;

/*
 * Controller to manage table of projects
 */
function ProjectController($scope, $http) {
	
	$scope.filter = false;
	$scope.projects = [];
	
	$scope.toggleFilter = function(e) {
		e.stopPropagation();
		$scope.filter = !$scope.filter;
	}
	
    // Get all the projects and set them in a local variable (projects)
    getProjects = function() {
    	$http.get('/jira/rest/epic/1/projects.json').
	    success(function(data, status, headers, config) {
	      //add the new projects to the projects array
	      angular.forEach(data.projects, function(project, index) {
            if(indexOf($scope.projects, project) == -1) {
              $scope.projects.push(project);
            }
	      });
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
    }
    
    $scope.hideEpicInfo = function() {
    	refresh = true;
    	clickedEpic = null;
    	$scope.filter = false;
    }
    
    // Get the projects now
    getProjects();
    
    // Get projects again every 10 seconds
    setInterval(function(){if (refresh) getProjects();}, 10000);

    /*
     * Finds if the project is already in the array and returns the index
     * returns -1 if not found
     */
    function indexOf(projectsArray, project) {
      var where = -1;
      angular.forEach(projectsArray, function(p, i) {
        if(p.key == project.key) {
          where = i;
        }
      });
      return where;
    }
}

/*
 * Controller for the epics of a project
 * Determines which epic information to display
 */
function EpicController($scope) {
    
    // Set the clicked epic to be name or null if it is already name
    $scope.toggleEpic = function(e, id) {
    	e.stopPropagation();
    	if (clickedEpic == id) {
    		clickedEpic = null;
    		refresh = true;
    	} else {
    		clickedEpic = id;
    		refresh = false; // halt project refresh if epic info is open
    	}
    }
    
    // Return whether the clicked epic is this epic
    $scope.isClicked = function(id) {
    	return clickedEpic == id;
    }
}

