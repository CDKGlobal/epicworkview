describe('Unit: WorkViewController Tests', function() {
    var rootScope,
        scope,
        ctrl,
        window,
        projectsFactory,
        fullscreenFactory,
        projects = [],
        loading = true,
        refresh = true,
        filterDays = 7,
        fullscreen = true;

    beforeEach(module('WorkView'));

    beforeEach(inject(function($rootScope, $controller) {
        rootScope = $rootScope;
        scope = $rootScope.$new();

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
});