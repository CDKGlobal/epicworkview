function ProjectController($scope, $http){
	$http.get('/jira/rest/epic/1/projects.json').
    success(function(data, status, headers, config) {
      $scope.projects = data.projects;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
}
	