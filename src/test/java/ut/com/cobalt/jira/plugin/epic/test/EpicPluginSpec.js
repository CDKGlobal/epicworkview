describe('ProjectController', function(){
    var scope;//we'll use this scope in our tests
    var httpBackend, http, controller, cookieStore;
    var projects, alphabeticalProjects, project1;
    
    var app = angular.module("EpicPlugin", ['ngCookies']);
    var timeInMs = Date.now();
 
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

		httpBackend.when("GET", scope.getBaseURL+"/rest/epic/1/projects.json?seconds=604800").respond([
        {"name":"Project1","key":"PROJ","id":10000,"description":"","timestamp":1402410614000,"epics":[
        {"description":"To test project without change","key":"TESTPRO-1","id":10000,"name":"Myepic",
        "timestamp":1402410614000,"contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"stories":[{"name":"issue1","key":"TEST-2",
        "id":10100, "timestamp":1402410614567,"contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"completed":true,"sub-tasks":[]}], "color":"ghx-label-1"}]},
        {"name":"Project2","key":"TEST","id":10100,"description":"","timestamp":timeInMs-172800000,"epics":[
        {"description":"To test project containing older timestamp","key":"TEST-1","id":10100,"name":"TestEpic",
        "timestamp":1407167014367,"stories":[{"name":"newissue","key":"TEST-2",
        "id":10100, "timestamp":1407167014367,"completed":false,"sub-tasks":[]}], "color":"ghx-label-1"}]},    
        {"name":"Project4","description":"","key":"WIRED","id":10400,"timestamp":timeInMs,
        "epics":[{"name":"epic for today","description":"eipc for today test","key":"WIRED-1",
        "id":10400,"timestamp":timeInMs,"contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"stories":[{"name":"story1",
        "key":"WIRED-2","id":10401,"timestamp":timeInMs-179900000,"contributor":{"id":"admin",
        "name":"admin","avatar":"/jira/secure/useravatar?avatarId=10122"},"completed":true,
        "subtasks":[]},{"name":"story2","key":"WIRED-3","id":10402,"timestamp":timeInMs-199900000,
        "contributor":{"id":"admin","name":"admin","avatar":"/jira/secure/useravatar?avatarId=10122"},
        "completed":false,"subtasks":[]},{"name":"story3","key":"WIRED-4","id":10403,"timestamp":timeInMs,
        "contributor":{"id":"admin","name":"admin","avatar":"/jira/secure/useravatar?avatarId=10122"},
        "completed":true,"subtasks":[]}], "color":"ghx-label-1"}]},
        {"name":"Scrum1","key":"TESTSCRUM","id":10101,"description":"","timestamp":timeInMs-72800000,"epics":[
        {"name":"Other Stories","description":"Stories without an epic","key":"NOKEY","id":-1,"timestamp":timeInMs-95700000,
        "stories":[{"name":"test 2","key":"ESCRUM-33","id":186652,"timestamp":timeInMs-95700000,
        "contributor":{"id":"emgej","name":"Emge, Justin","avatar":"/secure/useravatar?avatarId=10102"},
        "completed":false,"subtasks":[]}]},
        {"description":"To test project containing epic","key":"TESTSCRUM-1","id":10000,"name":"Epic1",
        "timestamp":timeInMs-72800000,"contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"stories":[{"name":"issue1","key":"TESTSCRUM-2",
        "id":10100, "timestamp":timeInMs-72800000,"contributor":{"id":"admin","name":"admin",
        "avatar":"/jira/secure/useravatar?avatarId=10122"},"completed":false,"sub-tasks":[]}], "color":"ghx-label-1"}]}]);
                      
        //declare the controller and inject our empty scope
        $controller('ProjectController', {
                  $scope: scope,
                  $http: http,
                  $cookieStore: cookieStore
              });
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
    
    
    // test the Project1 which has not been updated in 14 days will not shown in project list
    // only 3 projects will be returned
    it('should make a http GET request for projects and get 3 projects', function () {
        httpBackend.expectGET('undefined/rest/epic/1/projects.json?seconds=604800');   
        httpBackend.flush();
        expect(scope.projects).not.toBeNull();
        expect(scope.projects.length).toEqual(3);
        
    });
    
        
    // test the returned projects are time sorted    
    it('should sort the projects based on the timestamp', function(){    
    	httpBackend.flush();
        expect(scope.projects[0]).not.toBeNull();
        project1 = scope.projects[0];
        // Test "Project4" is the newest updated project
        
        expect(project1.name).toEqual("Project4");
        expect(project1.key).toEqual("WIRED");
        expect(project1.id).toEqual(10400);
       	expect(project1.timestamp).toEqual(timeInMs);
        project1 = scope.projects[1];
        expect(project1.name).toEqual("Scrum1");
        expect(project1.key).toEqual("TESTSCRUM");
        expect(project1.id).toEqual(10101);
        expect(project1.timestamp).toEqual(timeInMs-72800000);
        project1 = scope.projects[2];
        expect(project1.name).toEqual("Project2");
        expect(project1.key).toEqual("TEST");
        expect(project1.id).toEqual(10100);
        expect(project1.timestamp).toEqual(timeInMs-172800000);
   });
   
        
   it('should have a project with epic, story and contributor', function(){
   		httpBackend.flush();
        project1 = scope.projects[1];
        expect(project1.name).toEqual("Scrum1");
        expect(project1.key).toEqual("TESTSCRUM");
        expect(project1.id).toEqual(10101);
        expect(project1.timestamp).toEqual(timeInMs-72800000);
        var epic1 = project1.epics[0];
        expect(epic1.name).toEqual("Epic1");
        expect(epic1.key).toEqual("TESTSCRUM-1");
        expect(epic1.id).toEqual(10000);
        expect(epic1.description).toEqual("To test project containing epic");
        expect(epic1.timestamp).toEqual(timeInMs-72800000);
        var story1 = epic1.stories[0];
        expect(story1.name).toEqual("issue1");
        expect(story1.key).toEqual("TESTSCRUM-2");
        expect(story1.id).toEqual(10100);
        expect(story1.timestamp).toEqual(timeInMs-72800000);
        expect(story1.completed).toBe(false);
        expect(story1.contributor.id).toEqual("admin");
        expect(story1.contributor.name).toEqual("admin");
        expect(story1.contributor.avatar).toEqual("/jira/secure/useravatar?avatarId=10122");
    });
    
    it('should have epics time ordered', function(){
   		httpBackend.flush();
        project1 = scope.projects[1];
        var epic1 = project1.epics[0];
        expect(epic1.name).toEqual("Epic1");
        expect(epic1.timestamp).toEqual(timeInMs-72800000);
        epic1 = project1.epics[1];
        expect(epic1.name).toEqual("Other Stories");
        expect(epic1.timestamp).toEqual(timeInMs-95700000);
        
    });
    
    it('should have stories time ordered', function(){
   		httpBackend.flush();
        project1 = scope.projects[0];
        var epic1 = project1.epics[0];
        var story1 = epic1.stories[0];
        expect(story1.name).toEqual("story3");
        expect(story1.timestamp).toEqual(timeInMs);
        story1 = epic1.stories[1];
        expect(story1.name).toEqual("story1");
        expect(story1.timestamp).toEqual(timeInMs-179900000);
        story1 = epic1.stories[2];
        expect(story1.name).toEqual("story2");
        expect(story1.timestamp).toEqual(timeInMs-199900000);
        
    });
    
    // test "Project4" has 2 completed stories
    it('should have a project with 2 completed stories', function(){
   		httpBackend.flush();
        project1 = scope.projects[0];
        expect(project1.name).toEqual("Project4");
        expect(scope.getCompletedStories(project1)).toEqual(2);            
    });
    
    // test "Scrum1" has no completed stories
    it('should have a project named Scrum1 with 0 completed stories', function(){
   		httpBackend.flush();
        project1 = scope.projects[1];
        expect(project1.name).toEqual("Scrum1");
        expect(scope.getCompletedStories(project1)).toEqual(0);            
    });
    
    // test "Project2" has no contributor
    it('should have a project named Project2 with no contributor', function(){
   		httpBackend.flush();
        project1 = scope.projects[2];
        expect(project1.name).toEqual("Project2");
        expect(project1.id).toEqual(10100);
        expect(scope.getContributors(project1).length).toEqual(0);            
    });
    
    // test all the stories updated in "Project4" are done by 1 contributor
    it('should have a project named Project4 with 1 contributor', function(){
   		httpBackend.flush();
        project1 = scope.projects[0];
        expect(scope.getContributors(project1).length).toEqual(1);            
    });
    
    // test the stories updated in "Scrum1" are done by different contributors
    it('should have a project named Scrum1 with more than 1 contributor', function(){
   		httpBackend.flush();
        project1 = scope.projects[1];
        expect(project1.name).toEqual("Scrum1");
        expect(scope.getContributors(project1).length).toEqual(2);            
    });
    
    
    // test the alphabeticalProjects are alphabetically sorted
    it('should have alphabeticalProjects alphabetically sorted', function(){
   		httpBackend.flush();
        expect(scope.alphabeticalProjects().length).toEqual(3); 
        project1 = scope.alphabeticalProjects()[0]; 
        expect(project1.name).toEqual("Project2");
        project1 = scope.alphabeticalProjects()[1]; 
        expect(project1.name).toEqual("Project4");
        project1 = scope.alphabeticalProjects()[2]; 
        expect(project1.name).toEqual("Scrum1");
        
    });
    
    
    // test the timeOrderedProjects are sorted by time order
    it('should have timeOrderedProjects sorted by time order', function(){
   		httpBackend.flush();
        expect(scope.projects.length).toEqual(3); 
        project1 = scope.projects[0]; 
        expect(project1.name).toEqual("Project4");
        project1 = scope.projects[1]; 
        expect(project1.name).toEqual("Scrum1");
        project1 = scope.projects[2]; 
        expect(project1.name).toEqual("Project2");
        
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
    


          
      