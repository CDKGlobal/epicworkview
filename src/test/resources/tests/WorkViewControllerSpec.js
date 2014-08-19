describe('Unit: WorkViewController Tests', function() {
    var rootScope,
        timeout,
        scope,
        ctrl,
        window,
        projectsFactory,
        fullscreenFactory,
        projects,
        loading,
        refresh,
        filterDays,
        fullscreen;

    beforeEach(function() {

    });

    beforeEach(module('WorkView'));

    beforeEach(inject(function($rootScope, $controller, $timeout) {
        rootScope = $rootScope;
        timeout = $timeout;
        scope = $rootScope.$new();

        projects = [];
        loading = true;
        refresh = true;
        filterDays = 7;
        fullscreen = true;

        projectsFactory = {
            getProjects: function() {
                return projects;
            },
            isLoading: function() {
                return loading;
            },
            setRefresh: function(newRefresh) {
                refresh = newRefresh;
            },
            getFilterDays: function() {
                return filterDays;
            }
        };

        window = {
            location: {
                href: ''
            }
        };

        fullscreenFactory = {
            getFullscreen: function() {
                return fullscreen;
            }
        };

        ctrl = $controller('workViewController', {
            $scope: scope,
            $window: window,
            ProjectsFactory: projectsFactory,
            FullscreenFactory: fullscreenFactory,
            Context: '/jira'
        });
    }));

    it('should initialize projects to an empty array', function() {
        expect(scope.projects).toEqual(projects);
    });

    it('should initialize loading to true', function() {
        expect(scope.loading).toBeTruthy();
    });

    it('should be should update loading when the value is changed in projectsFactory', function() {
        //change loading to false and simulate scope apply
        loading = false;
        scope.$apply();

        expect(scope.loading).toBeFalsy();
    });

    it('shouldn\'t be using new colors if the projects have no children epics', function() {
        var projects = [
            {
                name: 'test'
            },
            {
                name: 'test2',
                children: null
            },
            {
                name: 'test3',
                children: []
            }
        ];

        expect(scope.isUsingNewColors(projects)).toBeFalsy();
    });

    it('shouldn\'t be using new colors if the epics in the project aren\'t', function() {
        var projects = [
            {
                name: 'test',
                children: [
                    {
                        id: 1,
                        color: '#ffeedd'
                    }
                ]
            }
        ];

        expect(scope.isUsingNewColors(projects)).toBeFalsy();
    });

    it('should be using new colors if the epics in the project are', function() {
        var projects = [
            {
                name: 'test',
                children: [
                    {
                        id: 1,
                        color: 'ghx-label-1'
                    }
                ]
            }
        ];

        expect(scope.isUsingNewColors(projects)).toBeTruthy();
    });

    it('should be ignoring epics with negative ids when determining using new colors', function() {
        var projects = [
            {
                name: 'test',
                children: [
                    {
                        id: -1,
                        color: '#ffeedd'
                    },
                    {
                        id: 1,
                        color: '#ffeedd'
                    },
                ]
            }
        ];

        expect(scope.isUsingNewColors(projects)).toBeFalsy();

        projects[0].children[1].color = 'ghx-label-1';

        expect(scope.isUsingNewColors(projects)).toBeTruthy();
    });

    it('shouldn\'t translate a null value color', function() {
        expect(scope.translateColor(undefined)).toBeNull();
        expect(scope.translateColor(null)).toBeNull();
    });

    it('should\'t translate a color if we aren\'t using new colors', function() {
        expect(scope.translateColor('#ffeedd')).toEqual('#ffeedd');
        expect(scope.translateColor('ffeedd')).toEqual('ffeedd');
    });

    it('should translate a color if we are using new colors', function() {
        scope.usingNewColors = true;

        expect(scope.translateColor('#ffeedd')).toEqual('ghx-label-3');
        expect(scope.translateColor('ffeedd')).toEqual('ffeedd');
    });

    it('should return black font if not using new colors', function() {
        expect(scope.getFontColor()).toEqual('#000');
    });

    it('should return white font if using new colors', function() {
        scope.usingNewColors = true;

        expect(scope.getFontColor()).toEqual('#fff');
    });

    it('should set refresh and notify listeners when epic info is hidden', function() {
        refresh = false;
        var called = false;
        rootScope.$on('hideEpics', function(event, epic) {
            called = true;
        });

        scope.hideEpicInfo();

        expect(refresh).toBeTruthy();
        expect(called).toBeTruthy();
    });

    it('should redirect the browser when not in fullscreen mode', function() {
        fullscreen = false;
        scope.setupModal('test/url/redirect');

        expect(window.location.href).toEqual('test/url/redirect');
    });

    it('should get filter days from projects factory', function() {
        expect(scope.getFilterDays()).toEqual(filterDays);
        filterDays = 14;
        expect(scope.getFilterDays()).toEqual(filterDays);
    });

    it('should create a url for the user', function() {
        spyOn(scope, 'setupModal');
        scope.setActiveUser(100);
        var regex = /^\/jira(.)*100$/; //starts with /jira and ends with 100
        expect(scope.setupModal.calls[0].args).toMatch(regex);
    });

    it('should create a url for the issue', function() {
        spyOn(scope, 'setupModal');
        scope.setActivePage({ key: 'TPT-3' });

        var regex = /^\/jira(.)*TPT-3$/; //starts with /jira and ends with TPT-3
        expect(scope.setupModal.calls[0].args).toMatch(regex);
    });

    it('should create a url for epic details', function() {
        spyOn(scope, 'setupModal');
        scope.setActiveEpic({ id: 10000, key: 'TPT-3' }, {});

        var regex = /^\/jira(.)*TPT-3$/; //starts with /jira and ends with TPT-3
        expect(scope.setupModal.calls[0].args).toMatch(regex);

        scope.setActiveEpic({ id: -1, key: 'TPT-3' }, { key: 'TPT' });

        regex = /^\/jira(.)*TPT$/; //starts with /jira and ends with TPT
        expect(scope.setupModal.calls[1].args).toMatch(regex);
    });

    it('should hide epic info after 90 seconds when in fullscreen', function() {
        var called = false;
        rootScope.$on('hideModal', function(event) {
            called = true;
        });

        scope.inactivityReset();
        timeout.flush(90000);

        expect(called).toBeTruthy();

        called = false;
        fullscreen = false;

        scope.inactivityReset();
        timeout.flush(90000);

        expect(called).toBeFalsy();
        timeout.verifyNoPendingTasks();
    });
});