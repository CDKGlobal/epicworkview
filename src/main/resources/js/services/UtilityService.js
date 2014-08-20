angular.module('epic-utilities', []).service('$utilities', function() {
    this.isNull = function(variable) {
        return variable === undefined || variable === null;
    };

    /*
     * Finds if the element is already in the list and returns the index, based on the element ids
     * returns -1 if not found
     */
    this.indexOf = function(list, elem) {
        if(!this.isNull(elem)) {
            for(var i = 0; i < list.length; i++) {
                //if element ids are equal
                if(list[i].id === elem.id) {
                    return i;
                }
            }
        }

        return -1;
    };

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
});