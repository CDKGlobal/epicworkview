describe('ProjectController', function(){
    var scope;//we'll use this scope in our tests
    var httpBackend, http, controller;
    var projects;
    
    
 
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('EpicPlugin'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend, $http){
        //create an empty scope
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        controller = $controller;
        http = $http;

        httpBackend.when("GET", "/jira/rest/epic/1/projects.json").respond([
        {"name":"newpro","key":"NEW","id":10102,"description":"","epics":[]},
        {"name":"Project1","key":"PROJ","id":10000,"description":"","epics":[]},
        {"name":"Project2","key":"TEST","id":10100,"description":"","epics":[]},
        {"name":"Scrum1","key":"TESTSCRUM","id":10101,"description":"","epics":[
        {"description":"To test project containing epic","key":"TESTSCRUM-1","id":10000,"name":"Epic1"}]}]);
                      
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
    
    
    
    it('should make a http GET request for projects and get 4 projects', function () {
        httpBackend.expectGET('/jira/rest/epic/1/projects.json');
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
        expect(project1.name).toBe("newpro");
        expect(project1.key).toBe("NEW");
        expect(project1.id).toBe(10102);
       
        project1 = scope.projects[1];
        expect(project1.name).toBe("Project1");
        expect(project1.key).toBe("PROJ");
        expect(project1.id).toBe(10000);
        project1 = scope.projects[2];
        expect(project1.name).toBe("Project2");
        expect(project1.key).toBe("TEST");
        expect(project1.id).toBe(10100);
   });
   
   it('should have a project with epic', function(){
   		httpBackend.flush();
        var project2 = scope.projects[3];
        expect(project2.name).toBe("Scrum1");
        expect(project2.key).toBe("TESTSCRUM");
        expect(project2.id).toBe(10101);
        var epic1 = project2.epics[0];
        expect(epic1.name).toBe("Epic1");
        expect(epic1.key).toBe("TESTSCRUM-1");
        expect(epic1.id).toBe(10000);
        expect(epic1.description).toBe("To test project containing epic");
    });
    
    
});





          
      