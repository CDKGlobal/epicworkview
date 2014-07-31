function epicDetailsController ($scope, $http, $q, $location) {
    $scope.contextPath = jQuery('meta[name="ajs-context-path"]').attr('content');
    $scope.epicKey = $location.search().epic;
    $scope.epicName = '';
    $scope.stories = [];

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
    });

    function getField(data, field) {
        return data[fieldMap[field]];
    }
}

