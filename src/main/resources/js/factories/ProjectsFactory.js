angular.module('WorkView').factory('ProjectsFactory', ['$rootScope', '$http', '$interval', 'Context', function($rootScope, $http, $interval, context) {
    var elementEnum = {
    	PROJECT: 0,
    	EPIC: 1,
    	STORY: 2,
    	SUBTASK: 3
    };
    var projects = [];
    var filterDays = 7;
    var loading = true;
    var newProjectListeners = [];
    var refresh = true;

    // Time of most recent update
    var lastUpdateTime = 0;

    function getProjectsSince(seconds) {
        $http.get(
            context +'/rest/epic/1/projects.json?seconds=' + seconds
        ).success(function(data) {
            lastUpdateTime = new Date().getTime();

            //add the new projects to the projects array
            updateElementList(projects, data, elementEnum.PROJECT);
            //Todo animateEpics();
            loading = false;
        }).error(function() {
            console.log('error loading projects');
        });
    }

    // Updates the current list with any changes from the new list of elements
    function updateElementList(currentList, newList, elementType) {
        angular.forEach(newList, function(element) {
            // find index of the new element in the current list
            var elementIndex = indexOf(currentList, element);
            var savedElement = null;
            // if the element isn't there and isn't a deleted element, add it
            if (elementIndex === -1 && element.timestamp !== -1) {
                savedElement = element;
                //add to front of list
                currentList.unshift(element);
                // animate
                //Todo addToAnimationQueue(savedElement, elementType);
                // set its state to true if it is a project and not in the list of unchecked projects
                if(elementType === elementEnum.PROJECT) {
                    $rootScope.$broadcast('newProject', element);
                }
                // update the list held in the current element (to sort and remove elements)
                if (!isNull(element.children)) {
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
                // animate any updated epics
                /*Todo if (savedElement.timestamp !== element.timestamp) {
                    addToAnimationQueue(savedElement, elementType);
                }*/
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
                if (!isNull(element.children)) {
                    updateElementList(savedElement.children, element.children, elementType + 1);
                }
            }
        });
        // sort the list and remove all old elements
        if (!isNull(currentList)) {
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
        var time = new Date().getTime();
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

    /** Helper Functions **/

    /*
     * Finds if the element is already in the list and returns the index, based on the element ids
     * returns -1 if not found
     */
    function indexOf(list, elem) {
        if(!isNull(elem)) {
            for(var i = 0; i < list.length; i++) {
                //if element ids are equal
                if(list[i].id === elem.id) {
                    return i;
                }
            }
        }
        return -1;
    }

    function isNull(variable) {
        return variable === undefined || variable === null;
    }

    getProjectsSince(filterDays * 24 * 60 * 60);

    // Update projects every 5 seconds
    $interval(function() {
        if(refresh) {
            var secsSinceUpdate = (Date.now() - lastUpdateTime) / 1000;
            getProjectsSince(Math.ceil(secsSinceUpdate));
        }
    }, 5000);

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