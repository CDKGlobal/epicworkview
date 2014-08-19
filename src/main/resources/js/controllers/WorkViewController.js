angular.module('WorkView').controller('workViewController', ['$scope', '$window', '$timeout', '$modal', 'ProjectsFactory', 'FullscreenFactory', 'Context', function($scope, $window, $timeout, $modal, projectsFactory, fullscreenFactory, context) {
    $scope.projects = projectsFactory.getProjects();
    $scope.loading = projectsFactory.isLoading();
    $scope.usingNewColors = false;

    $scope.$watch(function() {
        return projectsFactory.isLoading();
    }, function(newVal) {
        $scope.loading = newVal;

        if(!$scope.usingNewColors) {
            $scope.usingNewColors = $scope.isUsingNewColors($scope.projects);
        }
    });

    // Loop through epics to find a non-null epic and returns whether it is using new colors
    $scope.isUsingNewColors = function(projects) {
        for (var i = 0; i < projects.length; i++) {
            if(projects[i].children !== undefined && projects[i].children !== null) {
                var j = 0;
                var epic = projects[i].children[0];
                while (epic !== undefined && epic !== null) {
                    if (epic.id >= 0) {
                        return epic.color[0] !== '#';
                    }
                    j++;
                    epic = projects[i].children[j];
                }
            }
        }
        return false;
    };

    // Return the epic's color
    $scope.translateColor = function(color) {
        if($scope.isNull(color)) {
            return null;
        }
        else if (color[0] === '#' && $scope.usingNewColors) {
            return "ghx-label-3";
        }
        return color;
    };

    $scope.getFontColor = function() {
        if ($scope.usingNewColors) {
            return "#fff";
        }
        return "#000";
    };

    $scope.isNull = function(variable) {
        return variable === undefined || variable === null;
    };

    $scope.hideEpicInfo = function() {
        projectsFactory.setRefresh(true);
        $scope.$emit('hideEpics', null);
    };

    // Sets the modal to be the current user's page
    $scope.setActiveUser = function(id) {
        $scope.setupModal(context + "/secure/ViewProfile.jspa?name=" + id);
    };

    // Sets the modal to be the current page
    $scope.setActivePage = function(issue) {
        $scope.setupModal(context + "/browse/" + issue.key);
    };

    $scope.setActiveEpic = function(epic, project) {
        if (epic.id < 0) {
            $scope.setupModal(context + "/plugins/servlet/epicDetails?epic=" + project.key);
        } else {
            $scope.setupModal(context + "/plugins/servlet/epicDetails?epic=" + epic.key);
        }
    };
    
    $scope.setupModal = function(url) {
        if(fullscreenFactory.getFullscreen()) {
            var modal = $modal.open({
                template: '<iframe src="' + url + '"></iframe>',
                size: 'lg'
            });

            var unregister = $scope.$parent.$on('hideModal', function() {
                modal.dismiss('');
                unregister();
            });
        }
        else {
            $window.location.href = url;
        }
    };
    
    $scope.getFilterDays = function() {
    	return projectsFactory.getFilterDays();
    };

    $scope.inactivityReset = function() {
        $timeout.cancel(inactivityTimer);
        inactivityTimer = $timeout(function() {
            if(fullscreenFactory.getFullscreen()) {
                jQuery('#scroll-to-top').click();
                $scope.hideEpicInfo();
                $scope.$emit('hideModal');
            }
        }, 90000);
    };

    // set timer for closing windows after inactivity
    var inactivityTimer;
    jQuery(window).mousemove($scope.inactivityReset);
    jQuery(window).scroll($scope.inactivityReset);
    jQuery(window).click($scope.inactivityReset);
}]);