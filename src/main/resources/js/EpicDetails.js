function epicDetailsController ($scope, $http, $q, $location) {
	var notStartedNames = ["To Do", "Open"];
	
    $scope.contextPath = jQuery('meta[name="ajs-context-path"]').attr('content');
    $scope.key = $location.search().epic;
    $scope.epicName = '';
    $scope.fullStories = []; // the full list of stories
    $scope.stories = []; // the list of stories in the current date range
    $scope.notStarted = 0;
    $scope.inProgress = 0;
    $scope.done = 0;

    $scope.workType = 1;
    
    $scope.$watch('workType', function() {
    	$scope.refresh();
    });

    $scope.points = [[]];

    //map from constant name to custom field name
    var fieldMap = {
        'Epic Name': null,
        'Story Points': null
    };

    var epicQuery = $scope.contextPath + '/rest/api/2/';
    var storiesQuery = $scope.contextPath + '/rest/api/2/search?jql=';

    if($scope.key.indexOf('-') != -1) {
        epicQuery += 'issue';
        storiesQuery += '"Epic Link"=' + $scope.key;
    }
    else {
        epicQuery += 'project';
        storiesQuery += 'project=' + $scope.key + ' and "Epic Link" is empty and issuetype not in (Epic, Sub-task)';
    }

    epicQuery += '/' + $scope.key;
    storiesQuery += ' order by resolutiondate desc';

    $q.all([
        $http.get(epicQuery),
        $http.get(storiesQuery),
        $http.get($scope.contextPath + '/rest/api/2/field')
    ]).then(function(results) {
        var epic = results[0].data;
        var stories = results[1].data;
        var fields = results[2].data;

        //get the rest of the stories if there are more
        var maxResults = stories.maxResults;
        var total = stories.total;

        if(maxResults < total) {
            var requests = [];
            for(var i = maxResults; i < total; i += maxResults) {
                requests.push($http.get(storiesQuery + '&startAt=' + i));
            }

            $q.all(requests).then(function(results) {
                //add the new stories to the list
                angular.forEach(results, function(e, i) {
                    $scope.fullStories = $scope.fullsStories.concat(e.data.issues);
                    $scope.stories = $scope.stories.concat(e.data.issues);
                });

                //refresh the display
                $scope.refresh();
            });
        }

        //setup field map
        angular.forEach(fieldMap, function(value, key) {
            angular.forEach(fields, function(elem, index) {
                if(key === elem.name) {
                    fieldMap[key] = elem.id;
                }
            });
        });

        if($scope.key.indexOf('-') != -1) {
            $scope.epicName = getField(epic.fields, 'Epic Name');
        }
        else {
            $scope.epicName = 'Other stories (' + epic.name + ')';
        }

        $scope.fullStories = stories.issues;
        $scope.stories = $scope.fullStories;

        $scope.refresh();

    });

    function getField(data, field) {
        return data[fieldMap[field]];
    }
    
    // count the number of not started, in progress, and done stories
    function countStories(stories) {
        $scope.notStarted = 0;
        $scope.inProgress = 0;
        $scope.done = 0;

    	angular.forEach(stories, function(story, index) {
    		var resolution = story.fields.resolutiondate;
    		if (resolution !== undefined && resolution !== null) {
    			$scope.done += getValue(story);
    		} else if (jQuery.inArray(story.fields.status.name, notStartedNames) != -1) {
    			$scope.notStarted += getValue(story);
    		} else {
    			$scope.inProgress += getValue(story);
    		}
    	});
    }

    // creates a list of (date, number) pairs
    function getProgressList(stories) {
        var list = [];

        angular.forEach(stories, function(story, index) {
            var value = getValue(story);
            list.push({
                date: Date.parse(story.fields.created),
                number: value
            });
            
            var resolution = story.fields.resolutiondate;
            if(resolution !== undefined && resolution !== null) {
                list.push({
                    date: Date.parse(story.fields.resolutiondate),
                    number: -value
                });
            }
        });

        list.push({
            date: new Date().getTime(),
            number: 0
        });

        return list;
    }

    // get the value of the story based on which work type is selected
    function getValue(story) {
        switch($scope.workType) {
        case 1:
            return 1;
        case 2:
            var points = getField(story.fields, 'Story Points');
            return (points !== undefined && points !== null) ? points : 0;
        case 3:
            var resolution = story.fields.resolutiondate;
            var time = story.fields.aggregateprogress.total;

            if(resolution !== undefined && resolution !== null) {
                time = story.fields.aggregateprogress.progress;
            }

            return (time / 3600).toFixed(2);
        }
    }
    
    // update the story counts and chart points
    $scope.refresh = function() {
    	countStories($scope.stories);
    	
    	// update points using full story list, so graph doesn't shrink
        var points = getProgressList($scope.fullStories);
        points.sort(function(a, b) {
            return a.date - b.date;
        });
        $scope.points = [[]];
        var runningTotal = 0;
        angular.forEach(points, function(elem, index) {
            runningTotal += elem.number;
            $scope.points[0].push([elem.date, runningTotal]);
        });
    };

    //nicely format the date string
    $scope.doneDate = function(date) {
        if(date !== undefined && date !== null) {
            return new Date(Date.parse(date)).toLocaleString();
        }
        else {
            return 'unresolved';
        }
    };
}

// Directive for creating charts
// Creates a chart with an overview chart for selecting time ranges
function chartDirective() {
    return {
        restrict: 'E',
        template: "<div class='chart-container'><div id='chart'></div></div>" +
        		  "<div class='overview-container'><div id='overview'></div></div>",
        link: function(scope, elem, attrs) {
            var chart = null;
            var overview = null;

            var opts = {
                xaxis: {
                    ticks: function(axis) {
                        var min = axis.min;
                        var step = Math.floor((axis.max - axis.min) / 4);

                        var ticks = [];

                        for(var i = 0; i < 5; i++) {
                            ticks.push([min, new Date(min).toLocaleDateString()]);
                            min += step;
                        }
                        return ticks;
                    }
                },
                yaxis: {
                    minTickSize: 1,
                    tickFormatter: function(val, axis) {
                        return Math.floor(parseFloat(val));
                    }
                },
                selection: {
    				mode: "x"
    			},
                series: {
                    lines: {
                        steps: true
                    }
                }
            };

            var overviewOpts = {
            	series: {
        			lines: {
                        steps: true,
        				show: true,
        				lineWidth: 1
        			},
        			shadowSize: 0
       			},
       			xaxis: {
       				ticks: [],
       				mode: "time"
        		},
        		yaxis: {
        			ticks: [],
       				min: 0,
       				autoscaleMargin: 0.1
       			},
        		selection: {
        			mode: "x"
       			}
            };
            
            scope.$watch(attrs.ngModel, function(v) {
                if(!chart) {
                	var chartElem = jQuery('#chart');
                	var overviewElem = jQuery('#overview');

                    chart = jQuery.plot(chartElem, v, opts);
                    overview = jQuery.plot(overviewElem, v, overviewOpts);
                    chartElem.show();
                    overviewElem.show();
                    elem.show();
                }
                else {

                    chart.setData(v);
                    chart.setupGrid();
                    chart.draw();
                    overview.setData(v);
                    overview.setupGrid();
                    overview.draw();
                }
            });
            
            jQuery("#chart").bind("plotselected", function (event, ranges) {

    			// do the zooming
    			jQuery.each(chart.getXAxes(), function(_, axis) {
    				var opts = axis.options;
    				opts.min = ranges.xaxis.from;
    				opts.max = ranges.xaxis.to;
    				zoom(opts.min, opts.max);
    			});
    			chart.setupGrid();
    			chart.draw();
    			chart.clearSelection();

    			// don't fire event on the overview to prevent eternal loop

    			overview.setSelection(ranges, true);
    		});
    		jQuery("#overview").bind("plotselected", function (event, ranges) {
    			chart.setSelection(ranges);
    		});
    		
    		// zoom to the given minimum and maximum millisecond values
    		// update the current data to be a subset between the values
    		function zoom(min, max) {
    			scope.stories = [];
    			angular.forEach(scope.fullStories, function(story, index) {
    				var created = Date.parse(story.fields.created);
    				var resolved = story.fields.resolutiondate !== null ? Date.parse(story.fields.resolutiondate) : null;
    				if (created <= max && (resolved === null || resolved >= min)) {
    					scope.stories.push(story);
    				}
    			});
    			// refresh the page, wrap in apply so that page updates
    			scope.$apply(function() {
    				scope.refresh();
    			});
    		}
        }
    };
}

