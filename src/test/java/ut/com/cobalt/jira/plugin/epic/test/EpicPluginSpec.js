describe('ProjectController', function(){
    var scope;//we'll use this scope in our tests
    var httpBackend, http, controller, cookieStore;
    var projects, alphabeticalProjects;
    
    var app = angular.module("EpicPlugin", ['ngCookies']);
 
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('EpicPlugin'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend, $http,$cookieStore){
        //create an empty scope
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        controller = $controller;
        http = $http;
        cookieStore = $cookieStore;

		//httpBackend.when("GET", "jira/rest/epic/1/projects.json").respond([
        httpBackend.when("GET", "undefined/rest/epic/1/projects.json?seconds=1209600").respond([
        {"name":"newpro","key":"NEW","id":10102,"description":"","timestamp":"1405438117393","epics":[]},
        {"name":"Project1","key":"PROJ","id":10000,"description":"","timestamp":"1405438235000","epics":[]},
        {"name":"Project2","key":"TEST","id":10100,"description":"","timestamp":"1405430614000","epics":[]},
        {"name":"Project3","key":"NOUPDATE","id":10400,"description":"","timestamp":"1402410614000","epics":[]},
        {"name":"Scrum1","key":"TESTSCRUM","id":10101,"description":"","timestamp":"1405431614000","epics":[
        {"description":"To test project containing epic","key":"TESTSCRUM-1","id":10000,"name":"Epic1",
        "timestamp":"1405431614000","contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"stories":[{"name":"issue1","key":"TESTSCRUM-2",
        "id":10100, "timestamp":"1405431614000","contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"completed":false,"sub-tasks":[]}]}]}]);
                      
        //declare the controller and inject our empty scope
        $controller('ProjectController', {
                  $scope: scope,
                  $http: http,
                  $cookieStore: cookieStore
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
    
    
    // test the Project3 which has not been updated in 14 days will not shown in project list
    // only 4 projects will be returned
    it('should make a http GET request for projects and get 4 projects', function () {
        httpBackend.expectGET('undefined/rest/epic/1/projects.json?seconds=1209600');
        
        httpBackend.flush();
        expect(scope.projects).not.toBeNull();
        expect(scope.projects.length).toEqual(4);
    });
    
            
    it('should sort the projects based on the timestamp', function(){    
    	httpBackend.flush();
        expect(scope.projects[0]).not.toBeNull();
        var project1 = scope.projects[0];
        // Project1 is the newest updated project
        expect(project1.name).toEqual("Project1");
        expect(project1.key).toEqual("PROJ");
        expect(project1.id).toEqual(10000);
       	expect(project1.timestamp).toEqual("1405438235000");
        project1 = scope.projects[1];
        expect(project1.name).toEqual("newpro");
        expect(project1.key).toEqual("NEW");
        expect(project1.id).toEqual(10102);
        expect(project1.timestamp).toEqual("1405438117393");
        project1 = scope.projects[2];
        expect(project1.name).toEqual("Scrum1");
        expect(project1.key).toEqual("TESTSCRUM");
        expect(project1.id).toEqual(10101);
        expect(project1.timestamp).toEqual("1405431614000");
        project1 = scope.projects[3];
        expect(project1.name).toEqual("Project2");
        expect(project1.key).toEqual("TEST");
        expect(project1.id).toEqual(10100);
        expect(project1.timestamp).toEqual("1405430614000");
   });
   
        
   it('should have a project with epic, story and contributor', function(){
   		httpBackend.flush();
        var project2 = scope.projects[2];
        expect(project2.name).toEqual("Scrum1");
        expect(project2.key).toEqual("TESTSCRUM");
        expect(project2.id).toEqual(10101);
        expect(project2.timestamp).toEqual("1405431614000");
        var epic1 = project2.epics[0];
        expect(epic1.name).toEqual("Epic1");
        expect(epic1.key).toEqual("TESTSCRUM-1");
        expect(epic1.id).toEqual(10000);
        expect(epic1.description).toEqual("To test project containing epic");
        expect(epic1.timestamp).toEqual("1405431614000");
        var story1 = epic1.stories[0];
        expect(story1.name).toEqual("issue1");
        expect(story1.key).toEqual("TESTSCRUM-2");
        expect(story1.id).toEqual(10100);
        expect(story1.timestamp).toEqual("1405431614000");
        expect(story1.completed).toBe(false);
        expect(story1.contributor.id).toEqual("admin");
        expect(story1.contributor.name).toEqual("admin");
        expect(story1.contributor.avatar).toEqual("/jira/secure/useravatar?avatarId=10122");
    });
    
    
    
});


xdescribe('EpicController', function(){
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
    


          
      