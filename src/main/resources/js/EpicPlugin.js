// Whether to continuously refresh projects
var refresh = true;

// The currently clicked epic, or null if none clicked
var clickedEpic = null;

// Unique epic id to use for fake epics
var uniqueEpicId = -1;

var baseURL;

jQuery(document).ready(function() {
    baseURL = jQuery('input[title="baseURL"]').val();
});

/*
 * Controller to manage table of projects
 */
function ProjectController($scope, $http) {
	
	$scope.filterDays = 14;
	$scope.filter = false;
	$scope.projects = [];

	$scope.toggleFilter = function(e) {
		e.stopPropagation();
		$scope.filter = !$scope.filter;
	}
	
    // Get all the projects and set them in a local variable (projects)
    getProjects = function() {
    	$http.get(baseURL+'/rest/epic/1/projects.json?days='+$scope.filterDays).
	    success(function(data, status, headers, config) {
	      //add the new projects to the projects array
	      angular.forEach(data, function(project, index) {
	        //get the index of this project in the list of projects we're displaying
	        var projectIndex = indexOf($scope.projects, project);
	        //add it if it doesn't exist
            if(projectIndex == -1) {
              $scope.projects.push(project);
            }
            else {
              //otherwise copy the latest data retrieved into the existing one
              var savedProject = $scope.projects[projectIndex];
              savedProject.epics = project.epics;
              savedProject.name = project.name;
              savedProject.key = project.key;
              savedProject.description = project.description;
              savedProject.timestamp = project.timestamp;
            }
	      });
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
    }
    
    $scope.alphabeticalProjects = function() {
    	$scope.projects.sort(function(a, b){
    		if(a.name < b.name) return -1;
    	    if(a.name > b.name) return 1;
    	    return 0;
    	});
    	return $scope.projects;
    }
    
    $scope.timeOrderedProjects = function() {
    	$scope.projects.sort(function(a, b){return b.timestamp - a.timestamp});
    	removeOldProjects($scope.projects, $scope.filterDays);
    	return $scope.projects;
    }
    
    /*
     * Remove projects from the list that are older than days old
     * (projects should be in time order)
     */
    function removeOldProjects(projects, days) {
    	var time = new Date().getTime();
    	var i = projects.length - 1;
    	var project = projects[i];
    	while (i >= 0 && ((time - project.timestamp) / (1000 * 60 * 60 * 24)) > days) {
    		projects.pop();
    		i--;
    		project = projects[i];
    	}
    }
    
    $scope.hideEpicInfo = function() {
    	refresh = true;
    	clickedEpic = null;
    	$scope.filter = false;
    }
    
    $scope.toggleFullScreen = function() {
    	jQuery("header").slideToggle();
    	jQuery("footer").fadeToggle();
    }

    $scope.getBaseURL = function() {
        return baseURL;
    }
    
    // Return the difference between the current time and the given time, as a string
    $scope.millisecondToString = function(milli) {
    	currentTime = new Date().getTime();
    	lastUpdated = currentTime - milli;
    	seconds = Math.round(lastUpdated / 1000);
    	if (seconds < 60) {
    		return pluralize(seconds, "second");
    	}
    	minutes = Math.round(seconds / 60);
    	if (minutes < 60) {
    		return pluralize(minutes, "minute");
    	}
    	hours = Math.round(minutes / 60);
    	if (hours < 24) {
    		return pluralize(hours, "hour");
    	}
    	days = Math.round(hours / 24);
    	return pluralize(days, "day");
    }
    
    // appends an "s" to the unit if the number is greater than one
    function pluralize(num, unit) {
    	if (num == 1) {
    		return num + " " + unit;
    	}
    	return num + " " + unit + "s";
    }
    
    // Get the projects now
    getProjects();
    
    // Get projects again every 10 seconds
    setInterval(function(){if (refresh) getProjects();}, 5000);

    /*
     * Finds if the project is already in the array and returns the index
     * returns -1 if not found
     */
    function indexOf(projectsArray, project) {
      var where = -1;
      angular.forEach(projectsArray, function(p, i) {
        if(p.id == project.id) {
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
    
    // Set a unique id for the epic
    $scope.setUniqueId = function(epic) {
    	if (epic.id == -1) {
    		epic.id = uniqueEpicId;
    		uniqueEpicId--;
    	}
    }
}

