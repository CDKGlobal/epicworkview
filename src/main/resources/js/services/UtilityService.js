angular.module('epic-utilities', []).service('$utilities', function() {
    var isNull = function(variable) {
        return variable === undefined || variable === null;
    };
    this.isNull = isNull;

    /*
     * Finds if the element is already in the list and returns the index, based on the element ids
     * returns -1 if not found
     */
    var indexOf = function(list, elem) {
        if(!isNull(elem)) {
            for(var i = 0; i < list.length; i++) {
                //if element ids are equal
                if(list[i].id === elem.id) {
                    return i;
                }
            }
        }

        return -1;
    };

    this.indexOf = indexOf;

    // Returns the number of completed stories for the given project
    this.storyCount = function(project, completed) {
        var result = 0;
        angular.forEach(project.children, function(epic) {
            angular.forEach(epic.children, function(story) {
                if(story.completed === completed) {
                    result++;
                }
            });
        });
        return result;
    };

    var _contributors = function(result, element) {
        if (!isNull(element.contributor) && indexOf(result, element.contributor) === -1) {
            result.push(element.contributor);
        }
        if (!isNull(element.contributors)) {
            angular.forEach(element.contributors, function(contributor) {
                if (indexOf(result, contributor) === -1) {
                    result.push(contributor);
                }
            });
        }
        if (!isNull(element.children)) {
            angular.forEach(element.children, function(child) {
                _contributors(result, child);
            });
        }
    };

    this.getContributors = function(project) {
        var result = [];
        _contributors(result, project);
        return result;
    };
});