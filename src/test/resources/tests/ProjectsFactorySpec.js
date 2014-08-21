describe('Unit: ProjectsFactory Tests', function() {
    var rootScope,
        httpBackend,
        interval,
        baseTimestamp;

    //before each create mock implementation of some services
    beforeEach(function() {
        baseTimestamp = 1408233600000;//august 17, 2014 00:00:00.000
        angular.mock.module('WorkView', function($provide) {
            $provide.factory('Context', function() {
                return '/jira';
            });

            $provide.factory('$date', function() {
                return {
                    now: function() {
                        return baseTimestamp;
                    }
                };
            });
        });
    });

    //save some services for testing purposes
    beforeEach(inject(function($rootScope, $interval, $httpBackend) {
        rootScope = $rootScope;
        interval = $interval;

        httpBackend = $httpBackend;
    }));

    it('can get an instance of the projects factory', inject(function(ProjectsFactory) {
        expect(ProjectsFactory).toBeDefined();
    }));

    it('should initialize project to an empty array', inject(function(ProjectsFactory) {
        expect(ProjectsFactory.getProjects()).toEqual([]);
    }));

    it('should initialize filter days to 7', inject(function(ProjectsFactory) {
        expect(ProjectsFactory.getFilterDays()).toEqual(7);
    }));

    it('should initialize loading to be true', inject(function(ProjectsFactory) {
        expect(ProjectsFactory.isLoading()).toBeTruthy();
    }));

    it('should update filter days to be 14', inject(function(ProjectsFactory) {
        ProjectsFactory.setFilterDays(14);
        expect(ProjectsFactory.getFilterDays()).toEqual(14);
    }));

    it('should send out an initial ajax request on initialization', inject(function($injector) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([]);

        //using the injector to lazy load the factory so that we can setup httpBackend
        var projectsFactory = $injector.get('ProjectsFactory');
        httpBackend.flush();

        expect(projectsFactory.isLoading()).toBeFalsy();
    }));

    it('should remove projects older than filter days', inject(function($injector) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([
            {
                id: 100,
                //timestamps are in milliseconds
                timestamp: baseTimestamp - (7 * 24 * 60 * 60 * 1000) - 1
            }
        ]);

        //using the injector to lazy load the factory so that we can setup httpBackend
        var projectsFactory = $injector.get('ProjectsFactory');
        httpBackend.flush();

        expect(projectsFactory.getProjects()).toEqual([]);
    }));

    it('should request an update from the server every 5 seconds', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([]);
        httpBackend.flush();

        httpBackend.expectGET('/jira/rest/epic/1/projects.json?seconds=5').respond([]);
        baseTimestamp += 5000;
        interval.flush(5000);
        httpBackend.flush();
    }));

    it('should do a re-sync request every 5 minutes', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([]);
        httpBackend.flush();

        httpBackend.expectGET('/jira/rest/epic/1/projects.json?seconds=5').respond([]);
        baseTimestamp += 5000;
        interval.flush(5000);
        httpBackend.flush();
        httpBackend.resetExpectations();

        httpBackend.whenGET('/jira/rest/epic/1/projects.json?seconds=5').respond([]);
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([]);
        baseTimestamp += 5000;
        interval.flush((5 * 60 * 1000) - 5000);

        httpBackend.flush();
    }));

    it('should sort projects in descending time order', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([
            { id: 100, timestamp: baseTimestamp - 3 },
            { id: 200, timestamp: baseTimestamp - 1 },
            { id: 300, timestamp: baseTimestamp - 2 }
        ]);
        httpBackend.flush();

        var projects = ProjectsFactory.getProjects();
        for(var i = 1; i <= 3; i++) {
            expect(projects[i - 1].timestamp).toEqual(baseTimestamp - i);
        }
    }));

    it('should update a project when a duplicate id is given', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([
            { id: 100, timestamp: baseTimestamp - 3 },
            {
                id: 100,
                timestamp: baseTimestamp - 1,
                name: 'test',
                key: 'key',
                description: 'this is a test',
                contributor: 'me'
            }
        ]);
        httpBackend.flush();

        var projects = ProjectsFactory.getProjects();
        expect(projects.length).toEqual(1);

        expect(projects[0].id).toEqual(100);
        expect(projects[0].timestamp).toEqual(baseTimestamp - 1);
        expect(projects[0].name).toEqual('test');
        expect(projects[0].key).toEqual('key');
        expect(projects[0].description).toEqual('this is a test');
        expect(projects[0].contributor).toEqual('me');
    }));

    it('should remove the project when the timestamp is the flag value -1', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([
            { id: 100, timestamp: baseTimestamp - 3 },
            {
                id: 100,
                timestamp: -1
            }
        ]);
        httpBackend.flush();

        expect(ProjectsFactory.getProjects().length).toEqual(0);
    }));

    it('shouldn\'t send out ajax requests when refresh if set to false', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([]);
        httpBackend.flush();
        httpBackend.resetExpectations();

        ProjectsFactory.setRefresh(false);
        interval.flush(5 * 60 * 1000);
        httpBackend.verifyNoOutstandingRequest();
    }));

    it('should add or update project children', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([
            {
                id: 100,
                timestamp: baseTimestamp - 2,
                children: [
                    { id: 10000, timestamp: baseTimestamp - 2 }
                ]
            },
            {
                id: 100,
                timestamp: baseTimestamp - 1,
                children: [
                    { id: 10000, timestamp: baseTimestamp - 1 }
                ]
            }
        ]);
        httpBackend.flush();

        var projects = ProjectsFactory.getProjects();
        expect(projects[0].children).toBeDefined();

        var children = projects[0].children;

        expect(children.length).toEqual(1);
        expect(children[0].id).toEqual(10000);
        expect(children[0].timestamp).toEqual(baseTimestamp - 1);

    }));

    it('should update stories completed and contributors fields', inject(function(ProjectsFactory) {
        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=' + (7 * 24 * 60 * 60)
        ).respond([{
            id: 100,
            timestamp: baseTimestamp - 2,
            children: [{
                id: 10000,
                timestamp: baseTimestamp - 2,
                children: [{ id: 10100, timestamp: baseTimestamp - 2 }]
            }]
        }]);
        httpBackend.flush();

        httpBackend.expectGET(
            '/jira/rest/epic/1/projects.json?seconds=5'
        ).respond([{
            id: 100,
            timestamp: baseTimestamp - 1,
            children: [{
                id: 10000,
                timestamp: baseTimestamp - 1,
                children: [{
                    id: 10100,
                    timestamp: baseTimestamp - 1,
                    completed: true,
                    contributors: []
                }]
            }]
        }]);
        baseTimestamp += 5000;
        interval.flush(5000);
        httpBackend.flush();

        var story = ProjectsFactory.getProjects()[0].children[0].children[0];

        expect(story.completed).toBeTruthy();
        expect(story.contributors).toEqual([]);
    }));
});