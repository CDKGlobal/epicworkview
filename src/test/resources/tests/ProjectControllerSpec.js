describe('Unit: ProjectController Tests', function() {
    var rootScope,
        scope,
        ctrl,
        baseTimestamp = 1408233600000;//august 17, 2014 00:00:00.000

    beforeEach(module('WorkView'));

    beforeEach(inject(function($rootScope, $controller) {
        rootScope = $rootScope;
        scope = $rootScope.$new();

        ctrl = $controller('projectController', {
            $scope: scope,
            $date: {
                now: function() {
                    return baseTimestamp;
                }
            }
        });
    }));

    it('should count the number of stories completed for a project', function() {
        var project = {
            children: [
                {
                    children: [
                        {
                            completed: true
                        },
                        {
                            completed: false
                        }
                    ]
                },
                {
                    children: [
                        {
                            completed: false
                        },
                        {
                            completed: true
                        }
                    ]
                }
            ]
        };

        expect(scope.getCompletedStories(project)).toEqual(2);
    });

    it('should change milliseconds to a friendly string', function() {
        //test seconds
        var delta = 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(1);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('second');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('s');

        delta = 2 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(2);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('seconds');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('s');

        //test minutes
        delta = 60 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(1);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('minute');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('m');

        delta = 2 * 60 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(2);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('minutes');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('m');

        //test hours
        delta = 60 * 60 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(1);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('hour');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('h');

        delta = 2 * 60 * 60 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(2);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('hours');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('h');

        //test days
        delta = 24 * 60 * 60 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(1);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('day');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('d');

        delta = 2 * 24 * 60 * 60 * 1000;
        expect(scope.millisecondToString(baseTimestamp - delta, false)[0]).toEqual(2);
        expect(scope.millisecondToString(baseTimestamp - delta, false)[1]).toEqual('days');
        expect(scope.millisecondToString(baseTimestamp - delta, true)[1]).toEqual('d');
    });

    it('should get a list of contributors for the project sorted in descending time order', function() {
        var project = {
            children: [
                { contributor: { id: 2, timestamp: 2 }}
            ],
            contributor: {
                id: 1,
                timestamp: 1
            },
            contributors: [
                { id: 3, timestamp: 3 },
                { id: 4, timestamp: 4 },
                { id: 1, timestamp: 1 },
                { id: 5, timestamp: 5 },
                { id: 6, timestamp: 6 },
                { id: 7, timestamp: 7 },
                { id: 8, timestamp: 8 },
                { id: 9, timestamp: 9 },
                { id: 10, timestamp: 10 },
                { id: 11, timestamp: 11 },
                { id: 12, timestamp: 12 },
                { id: 13, timestamp: 13 },
                { id: 14, timestamp: 14 },
                { id: 15, timestamp: 15 },
                { id: 16, timestamp: 16 }
            ]
        };

        expect(scope.getContributors(project).length).toEqual(16);
        project.contributors.push({ id: 17, timestamp: 17 });

        var contributors = scope.getContributors(project);

        expect(contributors.length).toEqual(15);

        for(var i = 0; i < contributors.length; i++) {
            expect(contributors[i].timestamp).toEqual(17 - i);
        }

        expect(project.contributorCount).toEqual(17);
    });

    it('should calculate the number of extra contributors', function() {
        var project = {
            contributorCount: 17
        };

        expect(scope.extraContributorCount({})).toEqual(0);
        expect(scope.extraContributorCount(project)).toEqual(2);
    });

    it('should toggle the clicked epic info when clicked', inject(function(ProjectsFactory) {
        var event = {
            stopPropagation: function() {}
        };

        var epic = {
            id: 100
        };

        var eventEpic = null;

        rootScope.$on('hideEpics', function(event, epic) {
            eventEpic = epic;
        });

        spyOn(ProjectsFactory, 'setRefresh');

        scope.toggleEpic(event, epic);

        expect(scope.clickedEpic).toEqual(epic);
        expect(ProjectsFactory.setRefresh.mostRecentCall.args[0]).toBeFalsy();
        expect(eventEpic).toEqual(epic);

        scope.toggleEpic(event, epic);

        expect(scope.clickedEpic).toEqual(null);
        expect(ProjectsFactory.setRefresh.mostRecentCall.args[0]).toBeTruthy();
        expect(eventEpic).toEqual(epic);


    }));

    it('should hide its epic info if it is not the clicked epic on a hide epics event', function() {
        var epic = {
            id: 100
        };

        scope.clickedEpic = epic;
        rootScope.$emit('hideEpics', null);

        expect(scope.clickedEpic).toBeNull();

        scope.clickedEpic = epic;
        rootScope.$emit('hideEpics', { id: 200 });

        expect(scope.clickedEpic).toBeNull();

        scope.clickedEpic = epic;
        rootScope.$emit('hideEpics', epic);

        expect(scope.clickedEpic).toEqual(epic);
    });

    it('should be able to determine if the given epic is clicked', function() {
        expect(scope.isClicked({ id: 100 })).toBeFalsy();
        scope.clickedEpic = { id: 100 };
        expect(scope.isClicked({ id: 100 })).toBeTruthy();
        expect(scope.isClicked({ id: 200 })).toBeFalsy();
    });

    it('should generate a list of offset for the post its based on the epic\'s name length', function() {
        expect(scope.getPostItOffsets('01234567890123456789012345678901')).toBeDefined();
    });

    it('should shorten long epic names', function() {
        var string = '01234567890123456789012345678901';
        expect(scope.shorten(string)).toEqual(string);
        expect(scope.shorten(string + '2')).toEqual(string + '...');
    })

    it('should be able to determine if epic info is being displayed', function() {
        expect(scope.showEpicInfo()).toBeFalsy();
        scope.clickedEpic = { id: 100 };
        expect(scope.showEpicInfo()).toBeTruthy();
    });

    it('should return a list of the clicked epic\'s stories with the given completed flag', function() {
        var epic = {
            children: [
                { completed: false },
                { completed: false },
                { completed: true },
                { completed: false },
                { completed: true }
            ]
        };

        expect(scope.getStories(true)).toBeNull();

        scope.clickedEpic = epic;

        expect(scope.getStories(true).length).toEqual(2);
    });
});