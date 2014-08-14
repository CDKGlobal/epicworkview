angular.module('WorkView').controller('workViewController', ['$scope', '$window', '$modal', 'ProjectsFactory', 'FullscreenFactory', 'Context', function($scope, $window, $modal, projectsFactory, fullscreenFactory, context) {
    $scope.projects = projectsFactory.getProjects();
    $scope.loading = projectsFactory.isLoading();
    $scope.usingNewColors = false;

    $scope.$watch(function() {
        return projectsFactory.isLoading();
    }, function(newVal) {
        $scope.loading = newVal;

        if(!$scope.usingNewColors) {
            $scope.usingNewColors = isUsingNewColors($scope.projects);
        }
    });

    // Loop through epics to find a non-null epic and returns whether it is using new colors
    function isUsingNewColors(projects) {
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
    }

    // Return the epic's color
    $scope.translateColor = function(color) {
        if(isNull(color)) {
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

    function isNull(variable) {
        return variable === undefined || variable === null;
    }

    $scope.hideEpicInfo = function() {
        projectsFactory.setRefresh(true);
        $scope.$emit('hideEpics', null);
    };

    // Sets the modal to be the current user's page
    $scope.setActiveUser = function(id) {
        setupModal(context + "/secure/ViewProfile.jspa?name=" + id);
    };

    // Sets the modal to be the current page
    $scope.setActivePage = function(issue) {
        setupModal(context + "/browse/" + issue.key);
    };

    $scope.setActiveEpic = function(epic, project) {
        if (epic.id < 0) {
            setupModal(context + "/plugins/servlet/epicDetails?epic=" + project.key);
        } else {
            setupModal(context + "/plugins/servlet/epicDetails?epic=" + epic.key);
        }
    };
    
    function setupModal(url) {
        if(fullscreenFactory.getFullscreen()) {
            var modal = $modal.open({
                template: '<iframe style="width: 500px; height: 500px;" src="' + url + '"></iframe>'
            });

            var unregister = $scope.$parent.$on('hideModal', function() {
                modal.dismiss('');
                unregister();
            });
        }
        else {
            $window.location.href = url;
        }
    }

    // set timer for closing windows after inactivity
    var inactivityTimer;
    jQuery(window).mousemove(inactivityReset);
    jQuery(window).scroll(inactivityReset);
    jQuery(window).click(inactivityReset);

    function inactivityReset() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(function() {
            if(fullscreenFactory.getFullscreen()) {
                jQuery('#scroll-to-top').click();
                $scope.hideEpicInfo();
                $scope.$emit('hideModal');
            }
        }, 30000);
    }
}]);