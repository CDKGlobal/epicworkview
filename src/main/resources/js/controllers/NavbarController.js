angular.module('WorkView').controller('navBarController', ['$scope', '$filter', '$cookieStore', '$location', '$modal', 'ProjectsFactory', 'FullscreenFactory', function($scope, $filter, $cookieStore, $location, $modal, projectsFactory, fullscreenFactory) {
    //all projects sorted in alpabetical order
    $scope.projects = [];
    //a subset of projects after being filtered by the current search term
    $scope.filteredProjects = [];

    //keeps track of all project not being displayed in the wall board
    $scope.uncheckedProjectIds = [];

    //the current search term
    $scope.query = '';

    $scope.firstChar = true;

    /*----- Project Filtering -----*/

    $scope.search = function(item) {
        var query = $scope.query.toLowerCase();
        var group = item.group.toLowerCase();
        var name = item.name.toLowerCase();
        return name.indexOf(query) !== -1 || group.indexOf(query) !== -1;
    };

    //listens for newProject events
    $scope.$on('newProject', function(event, project) {
        //set the included field on the project
        project.included = !$scope.contains($scope.uncheckedProjectIds, project.id);

        //then add the project to the search/filter and sort by the name
        $scope.projects.push(project);
        $scope.projects = $filter('orderBy')($scope.projects, 'name');
    });

    //listens for deleteProject events
    $scope.$on('deleteProject', function(event, project) {
        //if scope.projects contains the project being deleted remove it
        var index = $scope.projects.indexOf(project);
        if(index > -1) {
            $scope.projects.splice(index, 1);
        }
    });

    // returns whether the given object is contained in the given list
    $scope.contains = function(a, obj) {
        for(var i = a.length - 1; i >= 0; i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    };

    //clears the checkbox for all checkboxes in the current filter list
    $scope.clearCheckboxes = function() {
        angular.forEach($scope.filteredProjects, function(project) {
            if(project.included) {
                project.included = false;
                $scope.checkProject(project);
            }
        });
    };

    //checks the checkbox for all checkboxes in the current filter list
    $scope.checkCheckboxes = function() {
        angular.forEach($scope.filteredProjects, function(project) {
            if(!project.included) {
                project.included = true;
                $scope.checkProject(project);
            }
        });
    };

    //on checkbox change
    $scope.checkProject = function(project) {
        //if included is set remove the project from the unchecked list
        if(project.included) {
            var index = $scope.uncheckedProjectIds.indexOf(project.id);
            if(index > -1) {
                $scope.uncheckedProjectIds.splice(index, 1);
            }
        }
        //else push the id onto the unchecked list
        else {
            $scope.uncheckedProjectIds.push(project.id);
        }

        //finally update variables and cookies relying on the unchecked list
        $scope.cookieState();
    };

    // updates the cookie, embedded url, and location url
    $scope.cookieState = function() {
        $cookieStore.remove('projectIds');
        $cookieStore.put('projectIds', $scope.uncheckedProjectIds);

        var idString = '';
        if ($scope.uncheckedProjectIds) {
        	idString = $scope.uncheckedProjectIds.join();
        }
        $location.search('ids', idString);
    };

    $scope.initialClear = function() {
        if($scope.firstChar) {
            $scope.firstChar = false;
            $scope.clearCheckboxes();
        }
    };

    /*----- Time Filtering -----*/
    $scope.filterDays = projectsFactory.getFilterDays();

    $scope.changeFilterDays = function(number) {
        if(number !== $scope.filterDays) {
            $scope.filterDays = number;
            $scope.$emit('hideEpics', null);
            projectsFactory.setFilterDays(number);
        }
    };

    /*----- Fullscreen Toggle -----*/
    $scope.isFullscreen = fullscreenFactory.getFullscreen();

    $scope.toggleFullscreen = function() {
        //tell the factory to toggle the fullscreen variable
        fullscreenFactory.toggleFullscreen();
        //update our copy
        $scope.isFullscreen = fullscreenFactory.getFullscreen();
        
        //lastly toggle the header and footer elements in the page
        jQuery('header').animate({opacity: 'toggle', height: 'toggle'});
        jQuery('footer').animate({opacity: 'toggle', height: 'toggle'});
    };

    /*----- Info Modal -----*/
    $scope.open = function() {
        var modal = $modal.open({
            templateUrl: 'info.html'
        });

        var unregister = $scope.$parent.$on('hideModal', function() {
            modal.dismiss('');
            unregister();
        });
    };

    /*----- controller initialization code -----*/

    $scope.init = function() {
        //initialize the filtered project ids to what is stored in the cookie
        $scope.uncheckedProjectIds = $cookieStore.get('projectIds');
        if($scope.uncheckedProjectIds === undefined) {
            $scope.uncheckedProjectIds = [];
            $cookieStore.put('projectIds', $scope.uncheckedProjectIds);
        }

        //will reinitialize the filtered projects to the given ids
        var urlFilterIds = $location.search().ids;
        if(urlFilterIds !== undefined && urlFilterIds.length > 0) {
            var ids = urlFilterIds.split(',');
            $scope.uncheckedProjectIds = [];

            angular.forEach(ids, function(id) {
                $scope.uncheckedProjectIds.push(parseInt(id));
            });
        }

        $scope.cookieState();
    };

    $scope.init();
}]);