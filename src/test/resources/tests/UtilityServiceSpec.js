describe('Unit: UtilityService Tests', function() {
    var utilities;

    beforeEach(module('epic-utilities'));

    beforeEach(inject(function($utilities) {
        utilities = $utilities;
    }));

    it('should be able to get the indexOf an object based on the id', function() {
        var list = [
            { id: 100 },
            { id: 200 },
            { id: 300 },
            { id: 400 }
        ];

        expect(utilities.indexOf(list, null)).toEqual(-1);
        expect(utilities.indexOf(list, { id: 500 })).toEqual(-1);
        expect(utilities.indexOf(list, { id: 300 })).toEqual(2);
    });

    it('should be able to determine if something is null', function() {
        expect(utilities.isNull(undefined)).toBeTruthy();
        expect(utilities.isNull(null)).toBeTruthy();
        expect(utilities.isNull({})).toBeFalsy();
    });

    it('should be able to get the list of contributors in a project', function() {
        var contributors = utilities.getContributors({
            contributors: [
                { id: 100 },
                { id: 200 },
                { id: 200 },
            ],
            children: [
                { contributor: { id: 100 } },
                { contributor: { id: 300 } }
            ]
        });

        expect(contributors.length).toEqual(3);
    });
});