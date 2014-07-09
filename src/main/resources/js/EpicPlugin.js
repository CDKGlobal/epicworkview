
// Time of most recent update
var lastUpdateTime = 0;

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
function ProjectController($scope, $http, $cookieStore) {
	
	$scope.filterDays = 14;
	$scope.filter = false;
	$scope.projects = [];

	$scope.toggleFilter = function(e) {
		e.stopPropagation();
		$scope.filter = !$scope.filter;
	}
	
    // Get all the projects in the last amount of seconds and set them in a local variable (projects)
    $scope.getProjects = function(seconds) {
    	$http.get(baseURL+'/rest/epic/1/projects.json?seconds='+seconds).
	    success(function(data, status, headers, config) {
	      lastUpdateTime = new Date().getTime();
	      //add the new projects to the projects array
	      updateElementList($scope.projects, data, "project");
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
    }
    
    // Updates the current list with any changes from the new list of elements
    function updateElementList(currentList, newList, elementType) {
    	angular.forEach(newList, function(element, index) {
    		//find index of the element in the current list
    		var elementIndex = indexOf(currentList, element);
    		//if the element isn't there, add it
    		if (elementIndex == -1) {
    			//add to front of list
    			currentList.unshift(element);
    			// set its state to true if it is a project and not in the list of unchecked projects
    			if (elementType == "project" && !contains($scope.uncheckedProjectIds, element.id)) {
    				element.state = true;
    			}
    		} else {
    			//element is in the current list, so update it
    			var savedElement = currentList[elementIndex];
    			if (savedElement.timestamp != element.timestamp) {
    				savedElement.timestamp = element.timestamp;
    				savedElement.name = element.name;
  	              	savedElement.key = element.key;
  	              	savedElement.description = element.description;
  	              	//update the list held in the current element, if it has one
  	              	if (elementType == "project") {
  	              		// this is a project
  	              		updateElementList(savedElement.epics, element.epics, "epic");
  	              	} else if (elementType == "epic") {
  	              		// this is an epic
  	              		updateElementList(savedElement.stories, element.stories, "story");
  	              	} else if (elementType == "story") {
  	              		// this is a story
  	              		updateElementList(savedElement.subtasks, element.subtasks, "subtask");
  	              	}
    			}
    		}
    	});
    	currentList.sort(function(a, b){return b.timestamp - a.timestamp});
    }
    
    // Get all recently changed projects and update or add them to the local projects variable
    updateProjects = function() {
    	var secsSinceUpdate = (new Date().getTime() - lastUpdateTime) / 1000;
    	$scope.getProjects(Math.ceil(secsSinceUpdate));
    }
    
    // clear all checkboxes and update projects accordingly
    $scope.clearchkbox = function() {
        angular.forEach($scope.projects, function (project) {
            project.included = false;
            // set the state to true, then check the project, which flips the state to false
            project.state = true;
            $scope.checkProject(project);
        });
    };
    
    // check all checkboxes and update projects accordingly
    $scope.checkchkbox = function() {
        angular.forEach($scope.projects, function (project) {
            project.included = true;
            // set the state to false, then check the project, which flips the state to true
            project.state = false;
            $scope.checkProject(project);
        });
    };
    
    // sort the projects alphabetically by name
    $scope.alphabeticalProjects = function() {
    	$scope.projects.sort(function(a, b){
    		if(a.name < b.name) return -1;
    	    if(a.name > b.name) return 1;
    	    return 0;
    	});
    	return $scope.projects;
    }
    
    // sort the projects by last updated time
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
    
    // toggle the projects state and update the cookie for the users checked projects
    $scope.checkProject = function(project) {
    	// flip the projects state
    	project.state = !project.state;
    	if (project.state == true) {
    		// remove project from unchecked projects list
    		var projIndex = $scope.uncheckedProjectIds.indexOf(project.id);
    		if (projIndex != -1) {
    			$scope.uncheckedProjectIds.splice(projIndex, 1);
    		}
    	} else {
    		// add project to unchecked projects list
    		$scope.uncheckedProjectIds.push(project.id);
    	}
    	// update the cookie
    	$cookieStore.remove('projectIds');
		$cookieStore.put('projectIds', $scope.uncheckedProjectIds);
    }
    
    // get the projects which are unchecked by this user
    $scope.uncheckedProjectIds = $cookieStore.get('projectIds');
    // if the user does not have checked preferences, create one for them
    if (typeof $scope.uncheckedProjectIds === 'undefined') {
    	$scope.uncheckedProjectIds = [];
    	$cookieStore.put('projectIds', $scope.uncheckedProjectIds);
    }   
    
    // Get the projects now
    $scope.getProjects($scope.filterDays * 24 * 60 * 60);
    
    // Update projects every 5 seconds
    setInterval(function(){if (refresh) updateProjects();}, 5000);

    /*
     * Finds if the element is already in the list and returns the index, based on the element ids
     * returns -1 if not found
     */
    function indexOf(list, elem) {
      var where = -1;
      angular.forEach(list, function(e, i) {
        if(e.id == elem.id) {
          where = i;
        }
      });
      return where;
    }

    // returns whether the given object is contained in the given list
    function contains(a, obj) {
        var i = a.length;
        while (i--) {
           if (a[i] === obj) {
               return true;
           }
        }
        return false;
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