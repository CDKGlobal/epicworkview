function epicDetailsController ($scope, $http, $q, $location) {
	var notStartedNames = ["To Do", "Open"];
	var doneNames = ["Closed", "Resolved", "Done"];
	
    $scope.contextPath = jQuery('meta[name="ajs-context-path"]').attr('content');
    $scope.epicKey = $location.search().epic;
    $scope.epicName = '';
    $scope.stories = [];
    $scope.notStarted = 0;
    $scope.inProgress = 0;
    $scope.done = 0;

    $scope.workType = 1;

    //map from constant name to custom field name
    var fieldMap = {
        'Epic Name': null

    };

    $q.all([
        $http.get($scope.contextPath + '/rest/api/2/issue/' + $scope.epicKey + '?expand=names'),
        $http.get($scope.contextPath + '/rest/api/2/search?jql="Epic Link"=' + $scope.epicKey)
    ]).then(function(results) {
        var epic = results[0].data;
        var stories = results[1].data;
        //todo deal with epic with more than 50 stories

        //setup field map
        angular.forEach(fieldMap, function(value, key) {
            angular.forEach(epic.names, function(dataValue, dataKey) {
                if(key === dataValue) {
                    fieldMap[key] = dataKey;
                }
            });
        });

        $scope.epicName = getField(epic.fields, 'Epic Name');

        $scope.stories = stories.issues;
        countStories($scope.stories);
    });

    function getField(data, field) {
        return data[fieldMap[field]];
    }
    
    // count the number of not started, in progress, and done stories
    function countStories(stories) {
    	angular.forEach(stories, function(story, index) {
    		if (jQuery.inArray(story.fields.status.name, notStartedNames) != -1) {
    			$scope.notStarted++;
    		} else if (jQuery.inArray(story.fields.status.name, doneNames) != -1) {
    			$scope.done++;
    		} else {
    			$scope.inProgress++;
    		}
    	});
    }
}

