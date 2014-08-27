angular.module('WorkView').factory('ProjectsFactory', ['$rootScope', '$http', '$interval', '$date', '$utilities', 'Context', function($rootScope, $http, $interval, $date, $utilities, context) {
    var elementEnum = {
    	PROJECT: 0,
    	EPIC: 1,
    	STORY: 2,
    	SUBTASK: 3
    };
    var projects = [];
    var projectTimestamps = {};
    var filterDays = 7;
    var loading = true;
    var refresh = true;

    // Time of most recent update
    var lastUpdateTime = 0;

    function getProjectsSince(seconds) {
        $http.get(
            context +'/rest/epic/1/projects.json?seconds=' + seconds
        ).success(function(data) {
            lastUpdateTime = $date.now();

            projectTimestamps = {};
            
            //add the new projects to the projects array
            updateElementList(projects, data, elementEnum.PROJECT);
            $rootScope.$broadcast('animateProjects');
            loading = false;
        });
    }

    // Updates the current list with any changes from the new list of elements
    function updateElementList(currentList, newList, elementType) {
        angular.forEach(newList, function(element) {
            // find index of the new element in the current list
            var elementIndex = $utilities.indexOf(currentList, element);
            var savedElement = null;
            // if the element isn't there and isn't a deleted element, add it
            if (elementIndex === -1 && element.timestamp !== -1) {
                savedElement = element;
                //add to front of list
                currentList.unshift(element);

                // set its state to true if it is a project and not in the list of unchecked projects
                if(elementType === elementEnum.PROJECT) {
                    $rootScope.$broadcast('newProject', element);
                }
                // update the list held in the current element (to sort and remove elements)
                if (!$utilities.isNull(element.children)) {
                    updateElementList(savedElement.children, element.children, elementType + 1);
                }
            } else if (elementIndex !== -1 && element.timestamp === -1) {
                // element in list and marked for deletion, so delete it
                currentList.splice(elementIndex, 1);
                //notify listeners that the project is being deleted
                if(elementType === elementEnum.PROJECT) {
                    $rootScope.$broadcast('deleteProject', element);
                }
            } else if (elementIndex !== -1) {
                // element in current list, so update it
                savedElement = currentList[elementIndex];

                // project has been updated, so animate
                if (elementType === elementEnum.PROJECT && savedElement.timestamp !== element.timestamp) {
                	projectTimestamps[element.id] = element.timestamp;
                }
                
                savedElement.timestamp = element.timestamp;
                savedElement.name = element.name;
                savedElement.key = element.key;
                savedElement.description = element.description;
                savedElement.contributor = element.contributor;
                // set completed and contributors fields if a story
                if (elementType === elementEnum.STORY) {
                    savedElement.completed = element.completed;
                    savedElement.contributors = element.contributors;
                }
                // update the list held in the current element, if it has one
                if (!$utilities.isNull(element.children) && !$utilities.isNull(savedElement.children)) {
                    updateElementList(savedElement.children, element.children, elementType + 1);
                }
            }
        });
        // sort the list and remove all old elements
        if (!$utilities.isNull(currentList)) {
            currentList.sort(function(a, b) {
                return b.timestamp - a.timestamp;
            });
            var removedElements = removeOldElements(currentList, filterDays);
            if(elementType === elementEnum.PROJECT) {
                angular.forEach(removedElements, function(value) {
                    $rootScope.$broadcast('deleteProject', value);
                });
            }
        }
    }

    /*
     * Remove elements from the list that are older than days old
     * (elements should be in time order)
     */
    function removeOldElements(elements, days) {
        var time = $date.now();
        var i = elements.length - 1;
        var element = elements[i];
        var removedElements = [];

        while (i >= 0 && ((time - element.timestamp) / (1000 * 60 * 60 * 24)) > days) {
            removedElements.push(elements.pop());

            i--;
            element = elements[i];
        }

        return removedElements;
    }

    getProjectsSince(filterDays * 24 * 60 * 60);

    // Update projects every 5 seconds
    $interval(function() {
        if(refresh) {
            var secsSinceUpdate = ($date.now() - lastUpdateTime) / 1000;
            getProjectsSince(Math.ceil(secsSinceUpdate));
        }
    }, 10000);

    $interval(function() {
        if(refresh) {
            getProjectsSince(filterDays * 24 * 60 * 60);
        }
    }, 1000 * 60 * 5);

    return {
        getProjects: function() {
            return projects;
        },
        getFilterDays: function() {
            return filterDays;
        },
        getProjectTimestamps: function() {
        	return projectTimestamps;
        },
        setFilterDays: function(days) {
            loading = true;
            filterDays = days;
            getProjectsSince(filterDays * 24 * 60 * 60);
        },
        isLoading: function() {
            return loading;
        },
        setRefresh: function(value) {
            refresh = value;
        }
    };
}]);