function epicDetailsController ($scope, $http, $q, $location) {
    var notStartedNames = ["To Do", "Open"];

    $scope.contextPath = jQuery('meta[name="ajs-context-path"]').attr('content');
    $scope.key = $location.search().epic;
    $scope.epicName = '';
    $scope.fullStories = []; // the full list of stories
    $scope.stories = []; // the list of stories in the current date range

    // number of stories in that state
    $scope.notStarted = 0;
    $scope.inProgress = 0;
    $scope.done = 0;

    // average time to complete a story
    $scope.averageTime = 0;

    // the min and max time values of what is displayed in the chart
    $scope.chartMin = 0;
    $scope.chartMax = 0;

    // initial work type is 1, stories
    $scope.workType = 1;

    // refresh page on change in work type
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

    if($scope.key.indexOf('-') !== -1) {
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
            // more stories than first request, so make more requests
            var requests = [];
            for(var i = maxResults; i < total; i += maxResults) {
                requests.push($http.get(storiesQuery + '&startAt=' + i));
            }

            $q.all(requests).then(function(results) {
                //add the new stories to the list
                angular.forEach(results, function(e) {
                    $scope.fullStories = $scope.fullStories.concat(e.data.issues);
                    $scope.stories = $scope.stories.concat(e.data.issues);
                });

                //refresh the display
                $scope.refresh();
            });
        }

        //setup field map
        angular.forEach(fieldMap, function(value, key) {
            angular.forEach(fields, function(elem) {
                if(key === elem.name) {
                    fieldMap[key] = elem.id;
                }
            });
        });

        // set epic name
        if($scope.key.indexOf('-') !== -1) {
            $scope.epicName = getField(epic.fields, 'Epic Name');
        }
        else {
            // given key is a project key, so this is an "other stories" epic
            $scope.epicName = 'Other stories (' + epic.name + ')';
        }

        $scope.fullStories = stories.issues;
        $scope.stories = $scope.fullStories;

        $scope.refresh();

    });

    // return the given field for the given data.
    // field is a string that represents a field in data
    function getField(data, field) {
        return data[fieldMap[field]];
    }

    // return a list containing the number of not started, in progress, and done stories
    function countStories(stories, worktype) {
        var notStarted = 0;
        var inProgress = 0;
        var done = 0;

        angular.forEach(stories, function(story) {
            var resolution = story.fields.resolutiondate;
            if (resolution !== undefined && resolution !== null) {
                done += $scope.getValue(story, worktype);
            } else if (jQuery.inArray(story.fields.status.name, notStartedNames) !== -1) {
                notStarted += $scope.getValue(story, worktype);
            } else {
                inProgress += $scope.getValue(story, worktype);
            }
        });

        return [notStarted, inProgress, done];
    }

    // creates a list of (date, number) pairs
    // where date is the date of action
    // and number is the added value of that action (+ for creation, - for resolution)
    function getProgressList(stories) {
        var list = [];

        angular.forEach(stories, function(story) {
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
        default:
            return 0;
        }
    };

    // return the average length of a story from creation to completion, in hours
    function getAverageTime(stories) {
        var completedStories = 0;
        var sumTime = 0;

        var day = 1000 * 60 * 60 * 24;
        var week = day * 7;

        angular.forEach(stories, function(story) {
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

    // format the given value for display
    $scope.format = function(number) {
        if ($scope.workType === 3) {
            return number.toFixed(2);
        }
        return number;
    };

    // update the story counts, average time and chart points
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
        angular.forEach(points, function(elem) {
            runningTotal += elem.number;
            $scope.points[0].data.push([elem.date, runningTotal]);
        });

        //set the second series data to the forecasted list
        var temp = getAverageTime($scope.fullStories);
        temp *= 3;
        temp += Math.floor(temp/(5 * 24)) * 48;
        $scope.points[1].data = getForecastLine($scope.points[0].data[$scope.points[0].data.length - 1], temp);

        $scope.points[2].data = getDataPoints(true);
        $scope.points[3].data = getDataPoints(false);
    };

    // return a list of points with numbers associated with dates for either story creation
    // or resolution numbers, depending on the given boolean
    function getDataPoints(creation) {
        var points = [];
        var numPoints = 5;
        // the largest point on the chart, excluding the forecast
        var dataMax = $scope.points[0].data[$scope.points[0].data.length - 1][0];
        // if no zoom yet, set chart min and max to be min and max points on chart
        if ($scope.chartMin === $scope.chartMax) {
            $scope.chartMin = $scope.points[0].data[0][0];
            var forecast = $scope.points[1].data;
            $scope.chartMax = forecast.length > 0 ? forecast[forecast.length - 1][0] : dataMax;
        }
        var max = $scope.chartMax;
        var min = $scope.chartMin;
        // make sure the max is no larger than the last data point (excluding the forecast)
        if(max > dataMax) {
            max = dataMax;
        }
        // range for one section to count creations or resolutions
        var range = (max - min) / numPoints;

        points.push([min, 0]);//adds the origin point to the line
        // add a point for each section
        for (var i = 0; i < numPoints; i++) {
            points.push([(min + (i + 1) * range), 0]);
        }
        // add to each point for each story in that range section
        angular.forEach($scope.stories, function(story) {
            // if creation is true, use story's created date. Otherwise, use resolution date
            var date = Date.parse(creation ? story.fields.created : story.fields.resolutiondate);
            // add to the point
            if (date > min && date < max) {
                var i = Math.floor((date - min) / range) + 1;
                points[i][1] += $scope.getValue(story, $scope.workType);
            }
        });
        return points;
    }

    //nicely format the date string
    $scope.formatResolutionDate = function(date) {
        if(date !== undefined && date !== null) {
            return 'resolved: ' + new Date(Date.parse(date)).toLocaleString();
        }
        else {
            return 'unresolved';
        }
    };

    // return a list of points for the forecast line
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
            return "Story Points";
        case 3:
            return "Work Hours";
        default:
            return "Unknown";
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

            // options for the chart
            var opts = {
                xaxis: {
                    // set ticks so they begin and end at chart edges
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
                    // format ticks to be nice time values
                    tickFormatter: function(val, axis) {
                        var range = axis.max - axis.min;
                        var day = 1000 * 60 * 60 * 24;

                        var date = new Date(val);

                        if(range >= 4 * day) {
                            return date.toLocaleDateString() + '<br/>&nbsp;';//hack to force using up some whitespace
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
                    // round down y-axis ticks
                    tickFormatter: function(val) {
                        return Math.floor(parseFloat(val));
                    }
                },
                // selectable along x-axis
                selection: {
                    mode: "x"
                }
            };

            // options for the overview
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
                       // display two ticks on selected area
                       ticks: function() {
                           return [scope.chartMin, scope.chartMax];
                       },
                       // format ticks to be dates
                    tickFormatter: function(val) {
                        // range of zoomed chart
                        var range = scope.chartMax - scope.chartMin;

                        // range of total chart
                        var totalMin = scope.points[0].data[0][0];
                        var totalMax = scope.points[0].data[scope.points[0].data.length - 1][0];
                        var totalRange = totalMax - totalMin;

                        // if range is small, don't display date because it's too large
                        if (range < (totalRange / 12)) {
                            return '^';
                        }

                        // return formatted date
                        return new Date(val).toLocaleDateString();
                    },
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

            // create or update the charts
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

            // watch for chart selection
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
            // watch for overview chart selection
            jQuery("#overview").bind("plotselected", function (event, ranges) {
                chart.setSelection(ranges);
            });

            // zoom to the given minimum and maximum millisecond values
            // update the current data to be a subset between the values
            function zoom(min, max) {
                scope.stories = [];
                angular.forEach(scope.fullStories, function(story) {
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

