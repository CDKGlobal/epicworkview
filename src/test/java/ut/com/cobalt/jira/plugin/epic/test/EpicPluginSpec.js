describe('ProjectController', function(){
    var scope;//we'll use this scope in our tests
    var httpBackend, http, controller;
    var projects, alphabeticalProjects;
    
    var app = angular.module("EpicPlugin", []);
 
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('EpicPlugin'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend, $http){
        //create an empty scope
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        controller = $controller;
        http = $http;

		//httpBackend.when("GET", "jira/rest/epic/1/projects.json").respond([
        httpBackend.when("GET", "undefined/rest/epic/1/projects.json?days=14").respond([
        {"name":"newpro","key":"NEW","id":10102,"description":"","timestamp":"1404411614000","epics":[]},
        {"name":"Project1","key":"PROJ","id":10000,"description":"","timestamp":"1404408360000","epics":[]},
        {"name":"Project2","key":"TEST","id":10100,"description":"","timestamp":"1404410614000","epics":[]},
        {"name":"Scrum1","key":"TESTSCRUM","id":10101,"description":"","timestamp":"1404421614000","epics":[
        {"description":"To test project containing epic","key":"TESTSCRUM-1","id":10000,"name":"Epic1",
        "timestamp":"1404421614000","stories":[{"name":"issue1","key":"TESTSCRUM-2","id":10100,
        "timestamp":"1404421614000","sub-tasks":[]}]}]}]);
                      
        //declare the controller and inject our empty scope
        $controller('ProjectController', {
                  $scope: scope,
                  $http: $http
              });
        //$controller('ProjectController', {$scope: scope});
    }));
    
    
    // tests start here
    it('should not initially be full screen', function(){
        expect(scope.isFullScreen).toBeFalsy();
    });
    
    it('should not initially be filter', function(){
    	expect(scope.filter).toBeFalsy();
    });
    
    
    it('should initially includes all projects', function(){
    	angular.forEach(scope.projects, function (project) {
    		expect(scope.project.included).toBeTrulthy();
    	});
    });
    
    
    it('should make a http GET request for projects and get 4 projects', function () {
        httpBackend.expectGET('undefined/rest/epic/1/projects.json?days=14');
        controller('ProjectController', {
        	$scope: scope,
        	$http: http
        });
        httpBackend.flush();
        expect(scope.projects).not.toBeNull();
        expect(scope.projects.length).toEqual(4);
    });
    
    
    it('should have first project named newpro', function(){    
    	httpBackend.flush();
        expect(scope.projects[0]).not.toBeNull();
        var project1 = scope.projects[0];
        expect(project1.name).toEqual("newpro");
        expect(project1.key).toEqual("NEW");
        expect(project1.id).toEqual(10102);
       	expect(project1.timestamp).toEqual("1404411614000");
        project1 = scope.projects[1];
        expect(project1.name).toEqual("Project1");
        expect(project1.key).toEqual("PROJ");
        expect(project1.id).toEqual(10000);
        expect(project1.timestamp).toEqual("1404408360000");
        project1 = scope.projects[2];
        expect(project1.name).toEqual("Project2");
        expect(project1.key).toEqual("TEST");
        expect(project1.id).toEqual(10100);
        expect(project1.timestamp).toEqual("1404410614000");
   });
   
   it('should have a project with epic', function(){
   		httpBackend.flush();
        var project2 = scope.projects[3];
        expect(project2.name).toEqual("Scrum1");
        expect(project2.key).toEqual("TESTSCRUM");
        expect(project2.id).toEqual(10101);
        expect(project2.timestamp).toEqual("1404421614000");
        var epic1 = project2.epics[0];
        expect(epic1.name).toEqual("Epic1");
        expect(epic1.key).toEqual("TESTSCRUM-1");
        expect(epic1.id).toEqual(10000);
        expect(epic1.description).toEqual("To test project containing epic");
        expect(epic1.timestamp).toEqual("1404421614000");
        var story1 = epic1.stories[0];
        expect(story1.name).toEqual("issue1");
        expect(story1.key).toEqual("TESTSCRUM-2");
        expect(story1.id).toEqual(10100);
        expect(story1.timestamp).toEqual("1404421614000");
    });
    
    
    
});


describe('EpicController', function(){
    var scope;//we'll use this scope in our tests
    var controller;
 
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('EpicPlugin'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('EpicController', {$scope: scope});
        
    }));
    
    //test
    it('should not initially be clicked', function(){
    	expect(scope.clickedEpic).toBeFalsy();
    });
});   
    


          
      