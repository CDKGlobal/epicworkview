describe('Unit: HeaderController Tests', function() {
    var scope,
        utilities,
        ctrl;

    beforeEach(module('WorkView'));

    beforeEach(inject(function($rootScope, $controller, $utilities) {
        scope = $rootScope.$new();


        utilities = $utilities;

        ctrl = $controller('headerController', {
            $scope: scope,
            ProjectsFactory: {
                getProjects: function() {
                    return [
                        { id: 100, included: true },
                        { id: 200, included: false },
                        { id: 300, included: true },
                    ];
                }
            }
        });
    }));

    it('should use only included projects', function() {
        expect(scope.projects().length).toEqual(2);
    });

    it('should count up included projects', function() {
        expect(scope.projectCount()).toEqual(2);
    });

    it('should count up story based on the given completed state', function() {
        spyOn(utilities, 'storyCount').andCallFake(function(project, completed) {
            return completed ? 1: 0;
        });

        expect(scope.countStories(true)).toEqual(2);
        expect(scope.countStories(false)).toEqual(0);
    });

    it('should count the number of unique contributors across all projects', function() {
        spyOn(utilities, 'getContributors').andCallFake(function(project) {
            if(project.id == 100) {
                return [ { id: 10000 }, { id: 20000} ];
            }
            return [ {id: 10000 }];
        });

        expect(scope.contributors()).toEqual(2);
    });
});