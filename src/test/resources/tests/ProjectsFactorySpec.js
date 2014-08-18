describe('Unit: ProjectsFactory Tests', function() {
    beforeEach(function() {
        //need to add a context path for the context factory to initialize properly
        $('head').append('<meta name="ajs-context-path" content="/jira"></meta>');
        module('WorkView');
    });

    afterEach(function() {
        //need to remove the added meta tag to stop the dom from being cluttered
        //and reset to a clean state
        $('meta[name="ajs-context-path"]').remove();
    });

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

    //todo test rest api code here
});