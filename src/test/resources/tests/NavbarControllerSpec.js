describe('Unit: NavbarController Tests', function() {
    var rootScope,
        scope,
        ctrl,
        location,
        cookieStore;

    beforeEach(module('WorkView'));

    beforeEach(inject(function($rootScope, $controller, $location, $cookieStore) {
        rootScope = $rootScope;
        scope = $rootScope.$new();

        location = $location;
        cookieStore = $cookieStore;

        //clear out cookies to start fresh each time
        cookieStore.remove('projectIds');

        ctrl = $controller('navBarController', {
            $scope: scope
        });
    }));

    it('should initialize the cookie and location', function() {
        expect(location.search().ids).toEqual('');
        expect(cookieStore.get('projectIds')).toEqual([]);
    });

    it('should update the cookie to the given project ids in the url', function() {
        var projects = [10000,10200,10400];

        location.search('ids', projects.join());
        scope.init();

        expect(cookieStore.get('projectIds')).toEqual(projects);
    });

    it('should overwrite the cookie with the given project ids', function() {
        var projects = [10000,10200,10400];

        cookieStore.put('projectIds', [100,200,300]);
        location.search('ids', projects.join());
        scope.init();

        expect(cookieStore.get('projectIds')).toEqual(projects);
    });

    it('should add a project to the projects list on a new project event', function() {
        rootScope.$broadcast('newProject', {
            id: 10000,
            name: 'abc'
        });

        expect(scope.projects.length).toEqual(1);
    });

    it('should add projects in alphabetical order', function() {
        rootScope.$broadcast('newProject', {
            id: 10000,
            name: 'xyz'
        });

        rootScope.$broadcast('newProject', {
            id: 10200,
            name: 'abc'
        });

        rootScope.$broadcast('newProject', {
            id: 10400,
            name: 'aaa'
        });

        expect(scope.projects[0].name).toEqual('aaa');
        expect(scope.projects[1].name).toEqual('abc');
    });

    it('should initialize projects to be unchecked when the id is in the cookie', function() {
        scope.uncheckedProjectIds = [10000];
        rootScope.$broadcast('newProject', {
            id: 10000,
            name: 'aaa'
        });

        rootScope.$broadcast('newProject', {
            id: 10200,
            name: 'abc'
        });

        expect(scope.projects[0].included).toBeFalsy();//aaa
        expect(scope.projects[1].included).toBeTruthy();//abc
    });

    it('should remove a project on delete project events', function() {
        rootScope.$broadcast('newProject', {
            id: 10000,
            name: 'aaa'
        });

        var projectToDelete = {
            id: 10200,
            name: 'abc'
        };

        rootScope.$broadcast('newProject', projectToDelete);

        rootScope.$broadcast('deleteProject', {
            id: 10400,
            name: 'xyz'
        })

        expect(scope.projects.length).toEqual(2);

        rootScope.$broadcast('deleteProject', projectToDelete);

        expect(scope.projects.length).toEqual(1);
        expect(scope.projects).not.toContain(projectToDelete);
    });

    it('should search on a project\'s name and group', function() {
        scope.query = 'test';
        var item = {
            group: 'no category',
            name: 'abc'
        };

        expect(scope.search(item)).toBeFalsy();

        item = {
            group: 'no category',
            name: 'test'
        };

        expect(scope.search(item)).toBeTruthy();

        item = {
            group: 'test category',
            name: 'abc'
        };

        expect(scope.search(item)).toBeTruthy();
    });

    it('should add the project id when the project included changes to false', function() {
        scope.checkProject({
            included: false,
            id: 10000
        });

        expect(scope.uncheckedProjectIds).toContain(10000);
    });

    it('should remove the project id when the project included changes to true', function() {
        scope.uncheckedProjectIds = [10000];

        scope.checkProject({
            included: true,
            id: 10000
        });

        expect(scope.uncheckedProjectIds).not.toContain(10000);
    });

    it('should add all project ids from filtered project when clear checkboxes is called', function() {
        spyOn(scope, 'checkProject');

        var project1 = {
            id: 1000,
            included: true
        };

        var project2 = {
            id: 1100,
            included: false
        };

        scope.filteredProjects = [ project1, project2 ];

        scope.clearCheckboxes();

        expect(scope.checkProject).toHaveBeenCalledWith(project1);
        expect(project1.included).toBeFalsy();
        expect(scope.checkProject).not.toHaveBeenCalledWith(project2);
    });

    it('should remove all project ids from filtered project when check checkboxes is called', function() {
        spyOn(scope, 'checkProject');

        var project1 = {
            id: 1000,
            included: true
        };

        var project2 = {
            id: 1100,
            included: false
        };

        scope.filteredProjects = [ project1, project2 ];

        scope.checkCheckboxes();

        expect(scope.checkProject).not.toHaveBeenCalledWith(project1);
        expect(scope.checkProject).toHaveBeenCalledWith(project2);
        expect(project2.included).toBeTruthy();
    });

    it('should update filter days when changed', inject(function(ProjectsFactory) {
        spyOn(ProjectsFactory, 'setFilterDays').andCallThrough();
        scope.changeFilterDays(7);

        expect(scope.filterDays).toEqual(7);
        expect(ProjectsFactory.setFilterDays).not.toHaveBeenCalled();

        scope.changeFilterDays(14);

        expect(scope.filterDays).toEqual(14);
        expect(ProjectsFactory.setFilterDays).toHaveBeenCalledWith(14);
    }));

    it('should toggle fullscreen mode', inject(function(FullscreenFactory) {
         spyOn(FullscreenFactory, 'toggleFullscreen').andCallThrough();
         scope.toggleFullscreen();

         expect(scope.isFullscreen).toBeTruthy();
         expect(FullscreenFactory.toggleFullscreen).toHaveBeenCalled();
    }));
});