
const TIMEOUT = 10;

// Time of most recent update
var lastUpdateTime = 0;

// Timeout to determine when to close open windows
var windowTimeout = TIMEOUT;

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
	$scope.isFullScreen = false;
	$scope.query = "";

	$scope.toggleFilter = function(e) {
		e.stopPropagation();
		$scope.filter = !$scope.filter;
	};
	
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
    };
    
    // Updates the current list with any changes from the new list of elements
    function updateElementList(currentList, newList, elementType) {
    	angular.forEach(newList, function(element, index) {
    		//find index of the element in the current list
    		var elementIndex = indexOf(currentList, element);
    		var savedElement = currentList[elementIndex];
    		//if the element isn't there, add it
    		if (elementIndex == -1) {
    			// if it is not a deleted element
    			if (element.timestamp != -1) {
	    			//add to front of list
	    			currentList.unshift(element);
	    			savedElement = currentList[0];
	    			// set its state to true if it is a project and not in the list of unchecked projects
	    			if (elementType == "project" && !contains($scope.uncheckedProjectIds, element.id)) {
	    				element.state = true;
	    			}
	    			//update the list held in the current element, if it has one
	        		updateChildList(elementType, savedElement, element);
    			}
    		} else {
    			//element is in the current list, so update it
    			if (element.timestamp == -1) {
    				// this element is marked for deletion, remove it
    				currentList.splice(elementIndex, 1);
    			} else {
    				savedElement.timestamp = element.timestamp;
    				savedElement.name = element.name;
	  	            savedElement.key = element.key;
	  	            savedElement.description = element.description;
	  	            savedElement.contributor = element.contributor;
    				// set completed field if a story
    				if (elementType == "story") {
    					savedElement.completed = element.completed;
    				}
    				//update the list held in the current element, if it has one
    	    		updateChildList(elementType, savedElement, element);
    			}
    		}
    	});
    	// sort the list and remove all old elements
    	if (currentList !== undefined && currentList !== null) {
    		currentList.sort(function(a, b){return b.timestamp - a.timestamp;});
    		removeOldElements(currentList, $scope.filterDays);
    	}
    }
    
    // update the child list of savedElement with the child list of element
    function updateChildList(elementType, savedElement, element) {
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
    
    /*
     * Remove elements from the list that are older than days old
     * (elements should be in time order)
     */
    function removeOldElements(elements, days) {
    	var time = new Date().getTime();
    	var i = elements.length - 1;
    	var element = elements[i];
    	while (i >= 0 && ((time - element.timestamp) / (1000 * 60 * 60 * 24)) > days) {
    		elements.pop();
    		i--;
    		element = elements[i];
    	}
    }
    
    // Get all recently changed projects and update or add them to the local projects variable
    updateProjects = function() {
    	var secsSinceUpdate = (new Date().getTime() - lastUpdateTime) / 1000;
    	$scope.getProjects(Math.ceil(secsSinceUpdate));
    };
    
    $scope.getCompletedStories = function(project) {
    	var res = 0;
    	angular.forEach(project.epics, function(epic) {
    		angular.forEach(epic.stories, function(story) {
    			if (story.completed) res++;
    		});
    	});
    	return res;
    };
    
    // returns all contributors for this project in order of time worked on project
    $scope.getContributors = function(project) {
    	// get map of timestamps to lists of contributors
    	var contributorTimestamps = {};
    	getContributorsHelper(contributorTimestamps, project, "project");
    	// get list of all timestamps
    	var timestamps = [];
    	for (var key in contributorTimestamps) {
    		timestamps.push(key);
    	}
    	// sort timestamps
    	timestamps.sort(function(a, b){return b - a;});
    	// add contributors for each timestamp to result
    	var result = [];
    	angular.forEach(timestamps, function(timestamp) {
			var contributors = contributorTimestamps[timestamp];
			angular.forEach(contributors, function(c) {
				// add to result if not a duplicate
				if (indexOf(result, c) == -1) {
					result.push(c);
				}
    		});
		});
    	return result;
    };
    
    // helper to get list of key value pairs from timestamp to contributor
    function getContributorsHelper(result, element, elementType) {
    	if (elementType == "project") {
    		// this is a project
    		angular.forEach(element.epics, function(epic) {
    			getContributorsHelper(result, epic, "epic");
    		});
    	} else if (elementType == "epic") {
    		// this is an epic
    		angular.forEach(element.stories, function(story) {
    			getContributorsHelper(result, story, "story");
    		});
    	} else if (elementType == "story") {
    		// this is a story
    		angular.forEach(element.subtasks, function(subtask) {
    			getContributorsHelper(result, subtask, "subtask");
    		});
    	}
    	
    	// add contributor to the result with the key as the element's timestamp
    	var contributor = element.contributor;
    	var timestamp = element.timestamp;
    	// make sure there is a contributor
    	if (contributor !== undefined && contributor !== null) {
    		// if this timestamp is already in the list, add another contributor to it
    		if (timestamp in result) {
    			result[timestamp].push(contributor);
    		} else {
    			// if it is not in the list, add it with the contributor
    			result[timestamp] = [contributor];
    		}
    	}
    }
    
    // clear all checkboxes and update projects accordingly
    $scope.clearchkbox = function() {
        angular.forEach($scope.filteredProjects, function (project) {
            project.included = false;
            // set the state to true, then check the project, which flips the state to false
            project.state = true;
            $scope.checkProject(project);
        });
    };
    
    // check all checkboxes and update projects accordingly
    $scope.checkchkbox = function() {
        angular.forEach($scope.filteredProjects, function (project) {
            project.included = true;
            // set the state to false, then check the project, which flips the state to true
            project.state = false;
            $scope.checkProject(project);
        });
    };
    
    $scope.search = function (item){
    	if (item.name.toLowerCase().indexOf($scope.query.toLowerCase())!=-1 || 
    			item.group.toLowerCase().indexOf($scope.query.toLowerCase())!=-1) {
            return true;
        }
        return false;
    };
    
    // sort the projects alphabetically by name
    $scope.alphabeticalProjects = function() {
    	$scope.projects.sort(function(a, b){
    		if(a.name < b.name) return -1;
    	    if(a.name > b.name) return 1;
    	    return 0;
    	});
    	return $scope.projects;
    };
    
    // sort the projects by last updated time
    $scope.timeOrderedProjects = function() {
    	$scope.projects.sort(function(a, b){return b.timestamp - a.timestamp;});
    	return $scope.projects;
    };
    
    $scope.hideEpicInfo = function() {
    	refresh = true;
    	clickedEpic = null;
    	$scope.filter = false;
    	$scope.resetWindowTimeout();
    };
    
    $scope.resetWindowTimeout = function() {
    	windowTimeout = TIMEOUT;
    };
    
    $scope.toggleFullScreen = function() {
    	jQuery("header").slideToggle();
    	jQuery("footer").fadeToggle();
    	$scope.isFullScreen = !$scope.isFullScreen;
    	if ($scope.isFullScreen) {
    		$scope.filter = false;
    	}
    };

    $scope.getBaseURL = function() {
        return baseURL;
    };
    
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
    };
    
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
    	if (project.state === true) {
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
    };
    
    // return the clicked epic from the given project, or none if none are clicked
    getClickedEpic = function(project) {
    	for (var i = 0; i < project.epics.length; i++) {
    		if (project.epics[i].id == clickedEpic) {
    			return project.epics[i];
    		}
    	}
    	return null;
    };
    
    $scope.showEpicWindow = function(project) {
    	var epic = getClickedEpic(project);
    	return (epic !== null);
    };
    
    $scope.getClickedEpicDescription = function(project) {
    	var epic = getClickedEpic(project);
    	if (epic === null) return null;
    	return epic.description;
    };

    $scope.getClickedEpicColor = function(project) {
        var epic = getClickedEpic(project);
        if(epic === null) return '#fdf4bb';
        return epic.color;
    };
    
    $scope.getClickedEpicStories = function(project) {
    	var epic = getClickedEpic(project);
    	if (epic === null) return null;
    	return epic.stories;
    };
    
    
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
    
    // Refresh all projects every 5 minutes
    setInterval(function(){if (refresh) $scope.getProjects($scope.filterDays * 24 * 60 * 60);}, 1000 * 60 * 5);

    /*
     * Finds if the element is already in the list and returns the index, based on the element ids
     * returns -1 if not found
     */
    function indexOf(list, elem) {
      var where = -1;
      angular.forEach(list, function(e, i) {
    	//if element ids are equal or both negative
        if(e.id == elem.id || (typeof e.id === 'number' && e.id < 0) && (typeof elem.id === 'number' && elem.id < 0)) {
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

    $scope.scrollToTop = function() {
        jQuery(window).scrollTop(0);
    };
}

/*
 * Controller for the epics of a project
 * Determines which epic information to display
 */
function EpicController($scope) {

    // Set the clicked epic to be id or null if it is already id
    $scope.toggleEpic = function(e, id) {
    	e.stopPropagation();
    	if (clickedEpic == id) {
    		clickedEpic = null;
    		refresh = true;
    	} else {
    		clickedEpic = id;
    		startWindowTimeout();
    		refresh = false; // halt project refresh if epic info is open
    	}
    	windowTimeout = TIMEOUT;
    };
    
    // Return whether the clicked epic is this epic
    $scope.isClicked = function(id) {
    	return clickedEpic == id;
    };
    
    // Set a unique id for the epic
    $scope.setUniqueId = function(epic) {
    	if (epic.id == -1) {
    		epic.id = uniqueEpicId;
    		uniqueEpicId--;
    	}
    };
    
    // Returns a list of post it positions to use for the background of the
    // given name. 
    $scope.getPostItOffsets = function(epicName) {
    	var list = [];
    	for (var i = 0; i < epicName.length / 6; i++) {    		
    		list[i] = i * 22;
    	}
    	return list;
    };
    
    // returns a shortened version of the given sentence
    $scope.shorten = function(sentence) {
    	if (sentence.length > 40) {
    		var res = sentence.substring(0, 40);
    		return res + "...";
    	}
    	return sentence;
    };
    
    // start a timeout for closing open windows
    function startWindowTimeout() {
    	if ($scope.isFullScreen && windowTimeout == TIMEOUT) {
	    	var intervalId = setInterval(function(){
	    		windowTimeout--;
	    		if (windowTimeout <= 0) {
	    			clickedEpic = null;
	    			refresh = true;
	    			clearInterval(intervalId);
	    			windowTimeout = TIMEOUT;
	    		}
	    	}, 1000);
    	}
    }
}