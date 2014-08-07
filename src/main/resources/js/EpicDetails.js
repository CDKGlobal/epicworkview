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
	$scope.averageTime = 0;
	$scope.chartMin = 0;
	$scope.chartMax = 0;
	
    $scope.workType = 1;
    
    $scope.$watch('workType', function() {
    	$scope.refresh();
    });

    $scope.points = [[],{}];

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
                    $scope.fullStories = $scope.fullStories.concat(e.data.issues);
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
    function countStories(stories, worktype) {
        var notStarted = 0;
        var inProgress = 0;
        var done = 0;

    	angular.forEach(stories, function(story, index) {
    		var resolution = story.fields.resolutiondate;
    		if (resolution !== undefined && resolution !== null) {
    			done += $scope.getValue(story, worktype);
    		} else if (jQuery.inArray(story.fields.status.name, notStartedNames) != -1) {
    			notStarted += $scope.getValue(story, worktype);
    		} else {
    			inProgress += $scope.getValue(story, worktype);
    		}
    	});

        return [notStarted, inProgress, done];
    }

    // creates a list of (date, number) pairs
    function getProgressList(stories) {
        var list = [];

        angular.forEach(stories, function(story, index) {
            var value = $scope.getValue(story, $scope.workType);
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
    $scope.getValue = function(story, worktype) {
        switch(worktype) {
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

            return (time / 3600);
        }
    };
    
    function getAverageTime(stories) {
    	var completedStories = 0;
    	var sumTime = 0;

        var day = 1000 * 60 * 60 * 24;
        var week = day * 7;

    	angular.forEach(stories, function(story, index) {
    		if(story.fields.resolutiondate !== null) {
    			completedStories++;
    			var completedTime = Date.parse(story.fields.resolutiondate) - Date.parse(story.fields.created);

                completedTime -= (2 * day * Math.floor(completedTime / week));
                completedTime /= 3;

    			sumTime+= completedTime;
            }
        });

		if(completedStories !== 0) {
        	return (sumTime/(completedStories* 60 * 60 * 1000));
        }
        return 0;
    }
    	
    
    // format the given number for display
    $scope.format = function(number) {
    	if ($scope.workType == 3) {
    		return number.toFixed(2);
    	}
    	return number;
    };
    
    // update the story counts and chart points
    $scope.refresh = function() {
    	var counts = countStories($scope.stories, $scope.workType);
        $scope.notStarted = counts[0];
        $scope.inProgress = counts[1];
        $scope.done = counts[2];

    	$scope.averageTime = getAverageTime($scope.stories).toFixed(2);
    	
    	// update points using full story list, so graph doesn't shrink
        var points = getProgressList($scope.fullStories);
        points.sort(function(a, b) {
            return a.date - b.date;
        });
        
        $scope.points = [
        {
            label: 'In Flight',
            lines: { steps: true },
            data: []
        },
        {
            label: 'Forecast',
            lines: { show: true },
            points: { show: true },
            data: []
        },
        {
            label: 'Created',
            data: []
        },
        {
            label: 'Resolved',
            data: []
        }];

        var runningTotal = 0;
        angular.forEach(points, function(elem, index) {
            runningTotal += elem.number;
            $scope.points[0].data.push([elem.date, runningTotal]);
        });

        //set the second series data to the forecasted list
        var temp = getAverageTime($scope.fullStories);
        temp *= 3;
        temp += (temp/(5 * 24)) * 48;
        $scope.points[1].data = getForecastLine($scope.points[0].data[$scope.points[0].data.length - 1], temp);
        
        $scope.points[2].data = getDataPoints(true);
        $scope.points[3].data = getDataPoints(false);
    };
    
    // return a list of points with numbers associated with dates for either story creation
    // or resolution numbers, depending on the given boolean
    function getDataPoints(creation) {
    	var points = [];
    	var numPoints = 5;
    	// if not zoomed in, set chart min and max
    	if ($scope.chartMin == $scope.chartMax) {
    		$scope.chartMin = $scope.points[0].data[0][0];
    		$scope.chartMax = $scope.points[0].data[$scope.points[0].data.length - 1][0];
    	}

        if($scope.chartMax > $scope.points[0].data[$scope.points[0].data.length - 1][0]) {
            $scope.chartMax = $scope.points[0].data[$scope.points[0].data.length - 1][0];
        }
    	
    	var range = ($scope.chartMax - $scope.chartMin) / numPoints;
        
        points.push([$scope.points[0].data[0][0], 0]);//adds the origin point to the line

    	for (var i = 0; i < numPoints; i++) {
    		points.push([($scope.chartMin + (i + 1) * range), 0]);
    	}
    	angular.forEach($scope.stories, function(story, index) {
    		var date = Date.parse(creation ? story.fields.created : story.fields.resolutiondate);
    		if (date > $scope.chartMin && date < $scope.chartMax) {
    			var i = Math.floor((date - $scope.chartMin) / range) + 1;
    			points[i][1]++;
    		}
    	});
    	return points;
    }

    //nicely format the date string
    $scope.doneDate = function(date) {
        if(date !== undefined && date !== null) {
            return new Date(Date.parse(date)).toLocaleString();
        }
        else {
            return 'unresolved';
        }
    };

    function getForecastLine(startPoint, averageTime) {
        var counts = countStories($scope.fullStories, 1);
        var stories = counts[0] + counts[1];
        return averageTime > 0 && stories > 0 ? [startPoint, [startPoint[0] + (stories * averageTime * 1000 * 60 * 60), 0]] : [];
    }
    
    // return a string representation of the work type
    $scope.workTypeToString = function() {
    	switch($scope.workType) {
        case 1:
            return "Stories";
        case 2:
            return "Points";
        case 3:
            return "Hours";
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
                            ticks.push(min);
                            min += step;
                        }
                        return ticks;
                    },
                    tickFormatter: function(val, axis) {
                        var range = axis.max - axis.min;
                        var day = 1000 * 60 * 60 * 24;

                        var date = new Date(val);

                        if(range >= 4 * day) {
                            return date.toLocaleDateString() + '<br/>&nbsp;';//hack to force using up som whitespace
                        }
                        else if(range >= day) {
                            return date.toLocaleDateString() + '<br/>' + date.toLocaleTimeString();
                        }
                        else {
                            return date.toLocaleTimeString() + '<br/>&nbsp;';
                        }
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
    			}
            };

            var overviewOpts = {
                legend: {
                    show: false
                },
            	series: {
        			lines: {
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
                var v2 = v.slice(0, 2);
                if(!chart) {
                	var chartElem = jQuery('#chart');
                	var overviewElem = jQuery('#overview');

                    chart = jQuery.plot(chartElem, v, opts);
                    overview = jQuery.plot(overviewElem, v2, overviewOpts);
                    chartElem.show();
                    overviewElem.show();
                    elem.show();
                }
                else {

                    chart.setData(v);
                    chart.setupGrid();
                    chart.draw();
                    overview.setData(v2);
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
    			scope.chartMin = min;
    			scope.chartMax = max;
    			// refresh the page, wrap in apply so that page updates
    			scope.$apply(function() {
    				scope.refresh();
    			});
    		}
        }
    };
}

