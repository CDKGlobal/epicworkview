describe('epicDetailsController', function(){
    var scope;//we'll use this scope in our tests
    var controller, httpBackend, http, location, q, rootScope;
    
    var app = angular.module('EpicDetails', []);
    
    
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('EpicDetails'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend, $http, $location, $browser, $window){
        //create an empty scope
        scope = $rootScope.$new();
        
        //rootScope = $rootScope;
        
        httpBackend = $httpBackend;
        controller = $controller;
        http = $http;
        location = $location;
        location.search().epic = "ADVADM-316";
        
        httpBackend.when("GET", scope.getBaseURL+"/rest/api/2/issue/ADVADM-316").respond({
        "expand":"renderedFields,names,schema,transitions,operations,editmeta,changelog",
        "id":"194808","self":"localhost:2990/rest/api/2/issue/194808","key":"ADVADM-316",
        "fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.",
        "iconUrl":"","name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{"48x48":"","24x24":"",
        "16x16":"","32x32":""},"projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012",
        "id":"10012","description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-316/watchers","watchCount":1,"isWatching":false},
        "created":"2014-07-28T13:54:56.093-0700","customfield_10140":null,"customfield_10340":null,
        "priority":{"self":"localhost:2990/rest/api/2/priority/3", "iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10p280:","timeestimate":null,"aggregatetimeoriginalestimate":null,
        "versions":[],"customfield_11747":null,"issuelinks":[],"assignee":null,"updated":"2014-08-06T14:51:19.850-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"localhost:2990/images/icons/statuses/open.png","name":"Open","id":"1",
        "statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,"customfield_10011":null,
        "customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,
        "customfield_11940":"0|1000a4:","timetracking":{},"customfield_10005":null,"customfield_10841":null,
        "customfield_10842":"Market Class Intent","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-4","attachment":[],"aggregatetimeestimate":null,
        "summary":"Add support for storing market classification for makes/models in user profiles",
        "creator":{"self":"","name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"",
        "16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},"subtasks":[],
        "customfield_10040":"146161", "customfield_10240":"156144","reporter":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm",
        "name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"customfield_10241":null,"customfield_10000":null,
        "aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,"customfield_10364":null,
        "customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},
        "comment":{"startAt":0,"maxResults":0,"total":0,"comments":[]},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-316/votes","votes":0,"hasVoted":false},
        "worklog":{"startAt":0,"maxResults":20,"total":0,"worklogs":[]}}});
        
        httpBackend.when("GET", scope.getBaseURL+'/rest/api/2/search?jql="Epic Link"=ADVADM-316 order by resolutiondate desc')
        .respond({"expand":"schema,names","startAt":0,"maxResults":50,"total":6,"issues":[{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194818",
        "self":"localhost:2990/rest/api/2/issue/194818","key":"ADVADM-322","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/7","id":"7","description":"","iconUrl":"","name":"Story",
        "subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,"project":{
        "self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM","name":"Ad AdMission",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,"customfield_10474":null,
        "aggregatetimespent":null,"customfield_10475":null,"resolution":null,"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-322/watchers","watchCount":1,"isWatching":false},
        "created":"2014-07-28T14:07:29.000-0700","customfield_10140":null,"customfield_10340":null,
        "customfield_11352":{"self":"localhost:2990/rest/api/2/customFieldOption/11539","value":"Development",
        "id":"11539"},"priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10p2a8:","timeestimate":null,"aggregatetimeoriginalestimate":null,
        "versions":[],"customfield_11747":null,"issuelinks":[],"assignee":null,"updated":"2014-07-29T16:38:43.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/1","description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/2","id":2,
        "key":"new","colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true","timeoriginalestimate":null,
        "description":"This may or may not be a good idea.","customfield_10010":null,"customfield_10011":null,
        "customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,"customfield_11940":"0|100014:",
        "customfield_10005":null,"customfield_10841":"ADVADM-316","aggregatetimeestimate":null,
        "summary":"Retargeting Service","creator":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm",
        "name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary",
        "active":true},"subtasks":[],"customfield_10040":"146171","customfield_10240":"6",
        "reporter":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,"customfield_10640":"Not Started",
        "customfield_10003":0.0,"customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,
        "progress":{"progress":0,"total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-322/votes","votes":0,
        "hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194815",
        "self":"localhost:2990/rest/api/2/issue/194815","key":"ADVADM-320","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/7","id":"7","description":"","iconUrl":"","name":"Story",
        "subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,"project":{
        "self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{
        "48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"","name":"Advertising"}},
        "customfield_10472":null,"fixVersions":[],"customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-320/watchers",
        "watchCount":1,"isWatching":false},"created":"2014-07-28T14:04:22.000-0700","customfield_10140":null,"customfield_10340":null,
        "customfield_11352":{"self":"localhost:2990/rest/api/2/customFieldOption/11539","value":"Development","id":"11539"},
        "priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},"labels":[],
        "customfield_11941":"0|10p29k:","timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":null,"updated":"2014-07-28T14:11:11.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1","description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/2",
        "id":2,"key":"new","colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":"Once TagIt returns marketclass, store marketclass to the user profile.",
        "customfield_10010":null,"customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|10000o:","customfield_10005":null,"customfield_10841":"ADVADM-316",
        "aggregatetimeestimate":null,"summary":"Display Tracker: Store marketclass segment received from TagIt",
        "creator":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "subtasks":[],"customfield_10040":"146168","customfield_10240":"4","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,
        "customfield_10364":null,"customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,
        "customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},
        "votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-320/votes","votes":0,"hasVoted":false}}},
        {"expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194816",
        "self":"localhost:2990/rest/api/2/issue/194816","key":"ADVADM-321","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/7","id":"7","description":"","iconUrl":"","name":"Story","subtask":false},
        "timespent":null,"customfield_10030":null,"customfield_10350":null,"project":{
        "self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM","name":"Ad AdMission",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"","name":"Advertising"}},
        "customfield_10472":null,"fixVersions":[],"customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-321/watchers","watchCount":1,"isWatching":false},
        "created":"2014-07-28T14:06:06.000-0700","customfield_10140":null,"customfield_10340":null,"customfield_11352":{
        "self":"localhost:2990/rest/api/2/customFieldOption/11539","value":"Development","id":"11539"},
        "priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},"labels":[],
        "customfield_11941":"0|10p29s:","timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":null,"updated":"2014-07-29T16:38:27.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.","iconUrl":"","name":"Open",
        "id":"1","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new","colorName":"blue-gray",
        "name":"New"}},"components":[],"customfield_11140":"true","timeoriginalestimate":null,
        "description":"This may or may not be a good idea.","customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,
        "customfield_11940":"0|10000w:","customfield_10005":null,"customfield_10841":"ADVADM-316","aggregatetimeestimate":null,
        "summary":"DCM: Support market class in targeting expression","creator":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "subtasks":[],"customfield_10040":"146169","customfield_10240":"5","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"","avatarUrls":{
        "48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,"customfield_10364":null,
        "customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-321/votes","votes":0,"hasVoted":false}}},
        {"expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194814",
        "self":"localhost:2990/rest/api/2/issue/194814","key":"ADVADM-319","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/7","id":"7","description":"","iconUrl":"","name":"Story","subtask":false},
        "timespent":null,"customfield_10030":null,"customfield_10350":[""],"project":{
        "self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{
        "48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012",
        "id":"10012","description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,
        "customfield_10474":null,"aggregatetimespent":null,"customfield_10475":null,"resolution":{
        "self":"localhost:2990/rest/api/2/resolution/1","id":"1","description":"A fix for this issue is checked into the tree and tested.",
        "name":"Fixed"},"customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":"2014-08-08T11:01:41.000-0700","workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-319/watchers","watchCount":1,"isWatching":false},
        "created":"2014-07-28T14:03:25.000-0700","customfield_10140":null,"customfield_10340":null,"customfield_11352":{
        "self":"localhost:2990/rest/api/2/customFieldOption/11539","value":"Development","id":"11539"},"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10p29c:",
        "timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,"issuelinks":[],
        "assignee":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"","avatarUrls":
        {"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},"updated":"2014-08-08T11:01:41.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/6","description":"The issue is considered finished","iconUrl":"",
        "name":"Closed","id":"6","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/3","id":3,"key":"done",
        "colorName":"green","name":"Complete"}},"components":[],"customfield_11140":"true","timeoriginalestimate":null,
        "description":"Add Market Class selector to test tool","customfield_10010":null,"customfield_10011":null,
        "customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,"customfield_11940":"0|100007:m",
        "customfield_10005":null,"customfield_10841":"ADVADM-316","aggregatetimeestimate":null,
        "summary":"CJ Service: Add support for marketclass","creator":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm",
        "name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"subtasks":[],"customfield_10040":"146167","customfield_10240":"3",
        "reporter":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,
        "customfield_10364":null,"customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,
        "customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},
        "votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-319/votes","votes":0,"hasVoted":false}}},{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194813",
        "self":"localhost:2990/rest/api/2/issue/194813","key":"ADVADM-318","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/7","id":"7","description":"","iconUrl":"","name":"Story","subtask":false},
        "timespent":null,"customfield_10030":null,"customfield_10350":[""],"project":{
        "self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM","name":"Ad AdMission",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"","name":"Advertising"}},
        "customfield_10472":null,"fixVersions":[],"customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":{"self":"localhost:2990/rest/api/2/resolution/1","id":"1",
        "description":"A fix for this issue is checked into the tree and tested.","name":"Fixed"},"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":"2014-08-07T14:36:31.000-0700","workratio":-1,
        "lastViewed":null,"watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-318/watchers","watchCount":1,"isWatching":false},
        "created":"2014-07-28T14:02:11.000-0700","customfield_10140":null,"customfield_10340":null,"customfield_11352":{
        "self":"https://atlassian03.cobaltgroup.com/rest/api/2/customFieldOption/11539","value":"Development","id":"11539"},
        "priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},"labels":[],
        "customfield_11941":"0|10p294:","timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm",
        "name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"updated":"2014-08-07T14:36:31.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/6","description":"The issue is considered finished",
        "iconUrl":"","name":"Closed","id":"6","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/3",
        "id":3,"key":"done","colorName":"green","name":"Complete"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":"Will behave just like make/model/condition","customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,
        "customfield_11940":"0|100006:","customfield_10005":null,"customfield_10841":"ADVADM-316","aggregatetimeestimate":null,
        "summary":"CJ Library: Add support for marketclass intent element","creator":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "subtasks":[],"customfield_10040":"146166","customfield_10240":"2",
        "reporter":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,
        "customfield_10364":null,"customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,
        "customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},
        "votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-318/votes","votes":0,"hasVoted":false}}},
        {"expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194810",
        "self":"localhost:2990/rest/api/2/issue/194810","key":"ADVADM-317","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/7","id":"7","description":"","iconUrl":"","name":"Story","subtask":false},
        "timespent":null,"customfield_10030":null,"customfield_10350":[""],"project":{
        "self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM","name":"Ad AdMission",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"","name":"Advertising"}},
        "customfield_10472":null,"fixVersions":[],"customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":{"self":"localhost:2990/rest/api/2/resolution/1","id":"1",
        "description":"A fix for this issue is checked into the tree and tested.","name":"Fixed"},"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":"2014-08-05T16:03:44.000-0700","workratio":-1,
        "lastViewed":null,"watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-317/watchers","watchCount":2,"isWatching":false},
        "created":"2014-07-28T13:57:20.000-0700","customfield_10140":null,"customfield_10340":null,"customfield_11352":{
        "self":"hlocalhost:2990/rest/api/2/customFieldOption/11539","value":"Development","id":"11539"},"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},"labels":[],
        "customfield_11941":"0|10p28g:","timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm",
        "name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"updated":"2014-08-05T16:03:44.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/5","description":"A resolution has been taken.",
        "iconUrl":"","name":"Resolved","id":"5","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/3",
        "id":3,"key":"done","colorName":"green","name":"Complete"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":"Will the profile dictionary be the source for this data",
        "customfield_10010":null,"customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|100004:","customfield_10005":null,"customfield_10841":"ADVADM-316",
        "aggregatetimeestimate":null,"summary":"Add market class to the profile dictionary",
        "creator":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},
        "subtasks":[],"customfield_10040":"146163","customfield_10240":"1","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm","emailAddress":"","avatarUrls":{
        "48x48":"","24x24":"","16x16":"","32x32":""},"displayName":"Pawlowski, Mary","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,"customfield_10364":null,
        "customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-317/votes","votes":0,"hasVoted":false}}}]});
        
        
        httpBackend.when("GET", scope.getBaseURL+'/rest/api/2/field').respond([{"id":"customfield_10470",
        "name":"Target Milestones or Bug Numbers","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10470]","Target Milestones or Bug Numbers"],"schema":{"type":"string",
        "custom":"","customId":10470}},{"id":"customfield_10471","name":"Engagement/Product Managers",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10471]","Engagement/Product Managers"],
        "schema":{"type":"array","items":"user","custom":"","customId":10471}},{"id":"customfield_10350","name":"Sprint",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10350]","Sprint"],"schema":{
        "type":"array","items":"string","custom":"","customId":10350}},{"id":"customfield_10472","name":"JIRA Capture User Agent",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10472]","JIRA Capture User Agent"],
        "schema":{"type":"string","custom":"com.atlassian.bonfire.plugin:bonfire-text","customId":10472}},{"id":"customfield_11044",
        "name":"QMSmLink","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11044]","QMSmLink"],
        "schema":{"type":"string","custom":"","customId":11044}},{"id":"fixVersions","name":"Fix Version/s","custom":false,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["fixVersion"],"schema":{"type":"array",
        "items":"version","system":"fixVersions"}},{"id":"customfield_11440","name":"External issue ID","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11440]","External issue ID"],
        "schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:textfield","customId":11440}},
        {"id":"customfield_10473","name":"JIRA Capture Browser","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10473]","JIRA Capture Browser"],"schema":{"type":"string","custom":"","customId":10473}},
        {"id":"customfield_10474","name":"JIRA Capture Operating System","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10474]","JIRA Capture Operating System"],"schema":{"type":"string",
        "custom":"","customId":10474}},{"id":"resolution","name":"Resolution","custom":false,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["resolution"],"schema":{"type":"resolution","system":"resolution"}},{"id":"customfield_10475",
        "name":"JIRA Capture URL","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10475]","JIRA Capture URL"],"schema":{"type":"string","custom":"","customId":10475}},{
        "id":"customfield_10476","name":"JIRA Capture Screen Resolution","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10476]","JIRA Capture Screen Resolution"],"schema":{"type":"string",
        "custom":"","customId":10476}},{"id":"customfield_10477","name":"JIRA Capture jQuery Version","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10477]","JIRA Capture jQuery Version"],
        "schema":{"type":"string","custom":"","customId":10477}},{"id":"customfield_10467","name":"Release Page Creation Status",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10467]","Release Page Creation Status"],
        "schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons","customId":10467}},{
        "id":"customfield_10468","name":"Release Page Template","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10468]","Release Page Template"],"schema":{"type":"string","custom":"","customId":10468}},{
        "id":"customfield_10469","name":"Release Window Dates","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10469]","Release Window Dates"],"schema":{"type":"string","custom":"","customId":10469}},{
        "id":"lastViewed","name":"Last Viewed","custom":false,"orderable":false,"navigable":true,"searchable":false,
        "clauseNames":["lastViewed"],"schema":{"type":"datetime","system":"lastViewed"}},{"id":"customfield_10460",
        "name":"Release Parent Page","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10460]","Release Parent Page"],"schema":{"type":"string","custom":"","customId":10460}},{
        "id":"customfield_10340","name":"Impediment","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10340]","Impediment"],"schema":{"type":"string","custom":"","customId":10340}},{"id":"customfield_10461",
        "name":"Product Outage","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10461]",
        "Product Outage"],"schema":{"type":"string","custom":"","customId":10461}},{"id":"customfield_10462",
        "name":"Release Start Date/Time","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10462]","Release Start Date/Time"],"schema":{"type":"datetime","custom":"","customId":10462}},{
        "id":"priority","name":"Priority","custom":false,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["priority"],"schema":{"type":"priority","system":"priority"}},{"id":"customfield_10463","name":"QA Engineers",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10463]","QA Engineers"],
        "schema":{"type":"array","items":"user","custom":"","customId":10463}},{"id":"customfield_10464",
        "name":"QA Verified Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10464]","QA Verified Date"],"schema":{"type":"date","custom":"","customId":10464}},{
        "id":"customfield_10343","name":"Social Team Retrospective Checklist","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10343]","Social Team Retrospective Checklist"],"schema":{"type":"array",
        "items":"string","custom":"","customId":10343}},{"id":"customfield_10740","name":"Core I18N Checklist","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10740]","Core I18N Checklist"],
        "schema":{"type":"array","items":"string","custom":"","customId":10740}},{"id":"customfield_10465",
        "name":"Release Major Deliverables","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10465]","Release Major Deliverables"],"schema":{"type":"string","custom":"","customId":10465}},{
        "id":"labels","name":"Labels","custom":false,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["labels"],
        "schema":{"type":"array","items":"string","system":"labels"}},{"id":"customfield_10466","name":"Release Name","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10466]","Release Name"],"schema":{"type":"string",
        "custom":"","customId":10466}},{"id":"customfield_10456","name":"Mock Date/Time","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10456]","Mock Date/Time"],"schema":{"type":"datetime",
        "custom":"","customId":10456}},{"id":"customfield_10457","name":"Developers","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10457]","Developers"],"schema":{"type":"array","items":"user",
        "custom":"","customId":10457}},{"id":"customfield_11941","name":"Global Rank","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[11941]","Global Rank"],"schema":{"type":"array","items":"string",
        "custom":"com.pyxis.greenhopper.jira:gh-lexo-rank","customId":11941}},{"id":"customfield_10458","name":"Launch Managers",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10458]","Launch Managers"],
        "schema":{"type":"array","items":"user","custom":"","customId":10458}},{"id":"customfield_10459","name":"Other Components",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10459]","Other Components"],
        "schema":{"type":"string","custom":"","customId":10459}},{"id":"timeestimate","name":"Remaining Estimate","custom":false,
        "orderable":false,"navigable":true,"searchable":false,"clauseNames":["remainingEstimate","timeestimate"],
        "schema":{"type":"number","system":"timeestimate"}},{"id":"aggregatetimeoriginalestimate","name":"Σ Original Estimate",
        "custom":false,"orderable":false,"navigable":true,"searchable":false,"clauseNames":[],"schema":{"type":"number",
        "system":"aggregatetimeoriginalestimate"}},{"id":"versions","name":"Affects Version/s","custom":false,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["affectedVersion"],"schema":{"type":"array","items":"version",
        "system":"versions"}},{"id":"issuelinks","name":"Linked Issues","custom":false,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":[],"schema":{"type":"array","items":"issuelinks","system":"issuelinks"}},{"id":"assignee",
        "name":"Assignee","custom":false,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["assignee"],
        "schema":{"type":"user","system":"assignee"}},{"id":"status","name":"Status","custom":false,"orderable":false,
        "navigable":true,"searchable":true,"clauseNames":["status"],"schema":{"type":"status","system":"status"}},{
        "id":"components","name":"Component/s","custom":false,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["component"],"schema":{"type":"array","items":"component","system":"components"}},{"id":"issuekey",
        "name":"Key","custom":false,"orderable":false,"navigable":true,"searchable":false,
        "clauseNames":["id","issue","issuekey","key"]},{"id":"customfield_11140","name":"PerforceJob","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11140]","PerforceJob"],"schema":{
        "type":"string","custom":"","customId":11140}},{"id":"customfield_11540","name":"DOD - Definition of Done",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11540]","DOD - Definition of Done"],
        "schema":{"type":"array","items":"string","custom":"","customId":11540}},{"id":"customfield_10451","name":"Financials",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10451]","Financials"],
        "schema":{"type":"number","custom":"com.atlassian.jira.plugin.system.customfieldtypes:float","customId":10451}},{
        "id":"customfield_10452","name":"GA Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10452]","GA Date"],"schema":{"type":"date","custom":"","customId":10452}},{"id":"customfield_10453",
        "name":"Launch","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10453]","Launch"],
        "schema":{"type":"string","custom":"","customId":10453}},{"id":"customfield_10454","name":"Launch Major Deliverables",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10454]","Launch Major Deliverables"],
        "schema":{"type":"string","custom":"","customId":10454}},{"id":"customfield_11940","name":"Rank","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11940]","Rank"],"schema":{"type":"array",
        "items":"string","custom":"","customId":11940}},{"id":"customfield_10445","name":"CDCC Component","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["CDCC Component","cf[10445]"],"schema":{"type":"string",
        "custom":"","customId":10445}},{"id":"customfield_10841","name":"Epic Link","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10841]","Epic Link"],"schema":{"type":"array","items":"string",
        "custom":"","customId":10841}},{"id":"customfield_10446","name":"DB Components","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10446]","DB Components"],"schema":{"type":"string",
        "custom":"","customId":10446}},{"id":"customfield_10842","name":"Epic Name","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10842]","Epic Name"],"schema":{"type":"string",
        "custom":"","customId":10842}},{"id":"customfield_10843","name":"Epic Status","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10843]","Epic Status"],"schema":{"type":"string",
        "custom":"com.pyxis.greenhopper.jira:gh-epic-status","customId":10843}},{"id":"customfield_10448",
        "name":"Dependencies","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10448]","Dependencies"],"schema":{"type":"string","custom":"","customId":10448}},{
        "id":"customfield_10844","name":"Epic Colour","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10844]","Epic Colour"],"schema":{"type":"string","custom":"com.pyxis.greenhopper.jira:gh-epic-color",
        "customId":10844}},{"id":"aggregatetimeestimate","name":"Σ Remaining Estimate","custom":false,"orderable":false,
        "navigable":true,"searchable":false,"clauseNames":[],"schema":{"type":"number","system":"aggregatetimeestimate"}},{
        "id":"creator","name":"Creator","custom":false,"orderable":false,"navigable":true,"searchable":true,"clauseNames":["creator"],
        "schema":{"type":"user","system":"creator"}},{"id":"subtasks","name":"Sub-Tasks","custom":false,"orderable":false,
        "navigable":true,"searchable":false,"clauseNames":["subtasks"],"schema":{"type":"array","items":"issuelinks",
        "system":"subtasks"}},{"id":"customfield_10040","name":"Global Rank (Obsolete)","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10040]","Global Rank (Obsolete)"],"schema":{"type":"array",
        "items":"string","custom":"com.pyxis.greenhopper.jira:gh-global-rank","customId":10040}},{"id":"reporter","name":"Reporter",
        "custom":false,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["reporter"],"schema":{"type":"user",
        "system":"reporter"}},{"id":"customfield_10560","name":"Release Readiness Date 3","custom":true,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["cf[10560]","Release Readiness Date 3"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10560}},{"id":"aggregateprogress",
        "name":"Σ Progress","custom":false,"orderable":false,"navigable":true,"searchable":false,"clauseNames":[],"schema":{
        "type":"progress","system":"aggregateprogress"}},{"id":"customfield_10440","name":"Bugzilla Products","custom":true,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["Bugzilla Products","cf[10440]"],
        "schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:textfield","customId":10440}},{
        "id":"customfield_10561","name":"Release Readiness Link","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10561]","Release Readiness Link"],"schema":{"type":"string","custom":"","customId":10561}},{
        "id":"customfield_10562","name":"Go/No-Go Checklist Link","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10562]","Go/No-Go Checklist Link"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10562}},{"id":"customfield_10442",
        "name":"Business Drivers ","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Business Drivers ","cf[10442]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10442}},{"id":"customfield_10443",
        "name":"Code Freeze Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10443]","Code Freeze Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10443}},{"id":"customfield_10444",
        "name":"Create Branch Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10444]","Create Branch Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10444}},{"id":"customfield_10840",
        "name":"JIRA Capture Document Mode","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10840]","JIRA Capture Document Mode"],"schema":{"type":"string","custom":"","customId":10840}},{
        "id":"customfield_10555","name":"QA Deploy Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10555]","QA Deploy Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10555}},{"id":"customfield_10556",
        "name":"QA Environment","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10556]","QA Environment"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":10556}},{"id":"customfield_10557",
        "name":"Release Notes Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10557]","Release Notes Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10557}},{"id":"customfield_10558",
        "name":"Release Readiness Date 1","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10558]","Release Readiness Date 1"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10558}},{"id":"customfield_10559",
        "name":"Release Readiness Date 2","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10559]","Release Readiness Date 2"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10559}},{"id":"progress",
        "name":"Progress","custom":false,"orderable":false,"navigable":true,"searchable":false,"clauseNames":["progress"],
        "schema":{"type":"progress","system":"progress"}},{"id":"votes","name":"Votes","custom":false,"orderable":false,
        "navigable":true,"searchable":false,"clauseNames":["votes"],"schema":{"type":"array","items":"votes","system":"votes"}},{
        "id":"worklog","name":"Log Work","custom":false,"orderable":true,"navigable":false,"searchable":true,"clauseNames":[],
        "schema":{"type":"array","items":"worklog","system":"worklog"}},{"id":"issuetype","name":"Issue Type","custom":false,
        "orderable":true,"navigable":true,"searchable":true,"clauseNames":["issuetype","type"],"schema":{"type":"issuetype",
        "system":"issuetype"}},{"id":"timespent","name":"Time Spent","custom":false,"orderable":false,"navigable":true,
        "searchable":false,"clauseNames":["timespent"],"schema":{"type":"number","system":"timespent"}},{"id":"customfield_10030",
        "name":"Requester","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10030]","Requester"],
        "schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:textfield","customId":10030}},{
        "id":"project","name":"Project","custom":false,"orderable":false,"navigable":true,"searchable":true,
        "clauseNames":["project"],"schema":{"type":"project","system":"project"}},{"id":"customfield_11241","name":"QMSmRef",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11241]","QMSmRef"],"schema":{
        "type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:readonlyfield","customId":11241}},{
        "id":"customfield_10550","name":"Mock End Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10550]","Mock End Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10550}},{"id":"aggregatetimespent",
        "name":"Σ Time Spent","custom":false,"orderable":false,"navigable":true,"searchable":false,"clauseNames":[],
        "schema":{"type":"number","system":"aggregatetimespent"}},{"id":"customfield_10551","name":"IT Outage Request Link",
        "custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10551]","IT Outage Request Link"],
        "schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10551}},{
        "id":"customfield_10552","name":"Outage State","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10552]","Outage State"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":10552}},{"id":"customfield_11640",
        "name":"issueFunction","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11640]",
        "issueFunction"],"schema":{"type":"array","items":"string",
        "custom":"com.onresolve.jira.groovy.groovyrunner:jqlFunctionsCustomFieldType","customId":11640}},
        {"id":"customfield_10553","name":"Perf Test End Date","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10553]","Perf Test End Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10553}},{"id":"customfield_10554",
        "name":"Perf Test Start Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10554]","Perf Test Start Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10554}},{"id":"customfield_10544",
        "name":"Dependency Notification Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10544]","Dependency Notification Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10544}},{"id":"customfield_10545",
        "name":"Deployment Plan Link","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10545]","Deployment Plan Link"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10545}},{"id":"customfield_10546",
        "name":"Deployment Plan Review Date/Time","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10546]","Deployment Plan Review Date/Time"],"schema":{"type":"datetime",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datetime","customId":10546}},{"id":"customfield_10547",
        "name":"Go/No-Go Date/Time","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10547]",
        "Go/No-Go Date/Time"],"schema":{"type":"datetime","custom":"com.atlassian.jira.plugin.system.customfieldtypes:datetime",
        "customId":10547}},{"id":"customfield_10548","name":"KIR2 End Date","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10548]","KIR2 End Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10548}},{"id":"customfield_10549",
        "name":"KIR2 Start Date","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10549]","KIR2 Start Date"],"schema":{"type":"date",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datepicker","customId":10549}},{"id":"resolutiondate",
        "name":"Resolved","custom":false,"orderable":false,"navigable":true,"searchable":true,
        "clauseNames":["resolutiondate","resolved"],"schema":{"type":"datetime","system":"resolutiondate"}},{"id":"workratio",
        "name":"Work Ratio","custom":false,"orderable":false,"navigable":true,"searchable":true,"clauseNames":["workratio"],
        "schema":{"type":"number","system":"workratio"}},{"id":"watches","name":"Watchers","custom":false,"orderable":false,
        "navigable":true,"searchable":false,"clauseNames":["watchers"],"schema":{"type":"array","items":"watches",
        "system":"watches"}},{"id":"thumbnail","name":"Images","custom":false,"orderable":false,"navigable":true,"searchable":false,
        "clauseNames":[]},{"id":"created","name":"Created","custom":false,"orderable":false,"navigable":true,"searchable":true,
        "clauseNames":["created","createdDate"],"schema":{"type":"datetime","system":"created"}},{"id":"customfield_10140",
        "name":"Bonfire Url","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Bonfire Url","cf[10140]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10140}},{"id":"customfield_11351",
        "name":"External issue ID","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11351]",
        "External issue ID"],"schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:textfield",
        "customId":11351}},{"id":"customfield_10141","name":"Distractions","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10141]","Distractions"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10141}},{"id":"customfield_11350",
        "name":"Release End Date/Time","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11350]","Release End Date/Time"],"schema":{"type":"datetime",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:datetime","customId":11350}},{"id":"customfield_10020",
        "name":"What Went Well","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10020]","What Went Well"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10020}},{"id":"customfield_10142",
        "name":"Action Items","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Action Items","cf[10142]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10142}},{"id":"customfield_10021"
        ,"name":"What Didn't Go Well","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10021]","What Didn't Go Well"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10021}},{"id":"customfield_11352",
        "name":"Env","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11352]","Env"],
        "schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":11352}},{
        "id":"customfield_11751","name":"Dev Team Business value rating","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[11751]","Dev Team Business value rating"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":11751}},{"id":"customfield_11750",
        "name":"Accept Test","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Accept Test","cf[11750]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":11750}},{"id":"customfield_10542",
        "name":"Branch Integrity Link","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Branch Integrity Link","cf[10542]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10542}},{"id":"customfield_10543",
        "name":"Bug List Link","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Bug List Link","cf[10543]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10543}},{"id":"customfield_11752",
        "name":"PO Business value rating","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11752]","PO Business value rating"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":11752}},{"id":"customfield_11348",
        "name":"External Resources","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11348]","External Resources"],"schema":{"type":"array","items":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes","customId":11348}},{
        "id":"customfield_11347","name":"Additional Deployment steps","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["Additional Deployment steps","cf[11347]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":11347}},{"id":"customfield_11746",
        "name":"User Type","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[11746]",
        "User Type"],"schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:select",
        "customId":11746}},{"id":"customfield_11745","name":"QA Assignee","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[11745]","QA Assignee"],"schema":{"type":"user",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:userpicker","customId":11745}},{"id":"customfield_11748",
        "name":"Epic Rank","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11748]","Epic Rank"],"schema":{"type":"number",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:float","customId":11748}},{"id":"customfield_11747",
        "name":"Root Cause","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11747]","Root Cause"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":11747}},{"id":"customfield_11749",
        "name":"Business Value Justification","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Business Value Justification","cf[11749]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":11749}},{"id":"updated",
        "name":"Updated","custom":false,"orderable":false,"navigable":true,"searchable":true,
        "clauseNames":["updated","updatedDate"],"schema":{"type":"datetime","system":"updated"}},{"id":"timeoriginalestimate",
        "name":"Original Estimate","custom":false,"orderable":false,"navigable":true,"searchable":false,
        "clauseNames":["originalEstimate","timeoriginalestimate"],"schema":{"type":"number","system":"timeoriginalestimate"}},{
        "id":"description","name":"Description","custom":false,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["description"],"schema":{"type":"string","system":"description"}},{"id":"customfield_10010",
        "name":"Confluence Link","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["cf[10010]",
        "Confluence Link"],"schema":{"type":"string","custom":"com.atlassian.jira.plugin.system.customfieldtypes:url",
        "customId":10010}},{"id":"customfield_10011","name":"Bugzilla link","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["Bugzilla link","cf[10011]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10011}},{"id":"customfield_10012",
        "name":"Acceptance Criteria","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Acceptance Criteria","cf[10012]"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10012}},{"id":"customfield_11344",
        "name":"Reboot(s) required?","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11344]","Reboot(s) required?"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons","customId":11344}},{"id":"customfield_10013",
        "name":"Code Collaborator Review","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10013]","Code Collaborator Review"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:url","customId":10013}},{"id":"customfield_10014",
        "name":"Release Vehicle","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10014]","Release Vehicle"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:select","customId":10014}},{"id":"timetracking",
        "name":"Time Tracking","custom":false,"orderable":true,"navigable":false,"searchable":true,"clauseNames":[],
        "schema":{"type":"timetracking","system":"timetracking"}},{"id":"customfield_11345",
        "name":"Requires Outage Notification? ","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[11345]","Requires Outage Notification? "],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons","customId":11345}},{
        "id":"customfield_10005","name":"Release Version History","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10005]","Release Version History"],"schema":{"type":"version",
        "custom":"com.pyxis.greenhopper.jira:greenhopper-releasedmultiversionhistory","customId":10005}},{"id":"security",
        "name":"Security Level","custom":false,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["level"],
        "schema":{"type":"securitylevel","system":"security"}},{"id":"attachment","name":"Attachment","custom":false,
        "orderable":true,"navigable":false,"searchable":true,"clauseNames":["attachments"],"schema":{"type":"array",
        "items":"attachment","system":"attachment"}},{"id":"summary","name":"Summary","custom":false,"orderable":true,
        "navigable":true,"searchable":true,"clauseNames":["summary"],"schema":{"type":"string","system":"summary"}},{
        "id":"customfield_10240","name":"Rank (Obsolete)","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10240]","Rank (Obsolete)"],"schema":{"type":"array","items":"string",
        "custom":"com.pyxis.greenhopper.jira:gh-global-rank","customId":10240}},{"id":"customfield_10241",
        "name":"Bonfire URL","custom":true,"orderable":true,"navigable":true,"searchable":true,"clauseNames":[
        "Bonfire URL","cf[10241]"],"schema":{"type":"string","custom":"com.atlassian.bonfire.plugin:bonfire-url",
        "customId":10241}},{"id":"customfield_10000","name":"Flagged","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10000]","Flagged"],"schema":{"type":"array","items":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes","customId":10000}},{
        "id":"customfield_10242","name":"Pair","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10242]","Pair"],"schema":{"type":"array","items":"user",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:multiuserpicker","customId":10242}},{"id":"customfield_10001",
        "name":"Epic/Theme","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10001]","Epic/Theme"],"schema":{"type":"array","items":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:labels","customId":10001}},{"id":"customfield_10243",
        "name":"Side Effect","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10243]","Side Effect"],"schema":{"type":"string",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:textarea","customId":10243}},{"id":"customfield_10364",
        "name":"Test Session(s)","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10364]","Test Session(s)"],"schema":{"type":"string",
        "custom":"com.atlassian.bonfire.plugin:bonfire-multi-session-cft","customId":10364}},{"id":"customfield_10365",
        "name":"Raised During","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10365]","Raised During"],"schema":{"type":"string",
        "custom":"com.atlassian.bonfire.plugin:bonfire-session-cft","customId":10365}},{"id":"customfield_10640",
        "name":"Testing Status","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["cf[10640]","Testing Status"],"schema":{"type":"array","items":"string",
        "custom":"com.atlassian.bonfire.plugin:bonfire-testing-status-cft","customId":10640}},{
        "id":"customfield_10003","name":"Story Points","custom":true,"orderable":true,"navigable":true,
        "searchable":true,"clauseNames":["cf[10003]","Story Points"],"schema":{"type":"number",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:float","customId":10003}},{"id":"customfield_10004",
        "name":"Business Value","custom":true,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["Business Value","cf[10004]"],"schema":{"type":"number",
        "custom":"com.atlassian.jira.plugin.system.customfieldtypes:float","customId":10004}},{
        "id":"environment","name":"Environment","custom":false,"orderable":true,"navigable":true,"searchable":true,
        "clauseNames":["environment"],"schema":{"type":"string","system":"environment"}},{"id":"duedate",
        "name":"Due Date","custom":false,"orderable":true,"navigable":true,"searchable":true,"clauseNames":["due","duedate"],
        "schema":{"type":"date","system":"duedate"}},{"id":"comment","name":"Comment","custom":false,"orderable":true,
        "navigable":false,"searchable":true,"clauseNames":["comment"],"schema":{"type":"array","items":"comment",
        "system":"comment"}}]);
        
        httpBackend.when("GET", scope.getBaseURL+'/rest/api/2/search?jql=project="ADVADM" and issuetype="Epic"').
        respond({"expand":"schema,names","startAt":0,"maxResults":50,"total":23,"issues":[{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"194808",
        "self":"localhost:2990/rest/api/2/issue/194808","key":"ADVADM-316","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"","name":"Epic",
        "subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,
        "project":{"self":"","id":"13192","key":"ADVADM","name":"Ad AdMission",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,
        "customfield_10474":null,"aggregatetimespent":null,"customfield_10475":null,
        "resolution":null,"customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-316/watchers","watchCount":1,
        "isWatching":false},"created":"2014-07-28T13:54:56.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3",
        "iconUrl":"https://atlassian03.cobaltgroup.com/images/icons/priorities/major.png",
        "name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10p280:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,"issuelinks":[],
        "assignee":null,"updated":"2014-08-06T14:51:19.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|1000a4:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"Market Class Intent","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-4","aggregatetimeestimate":null,
        "summary":"Add support for storing market classification for makes/models in user profiles",
        "creator":{"self":"https://localhost:2990/rest/api/2/user?username=pawlowsm",
        "name":"pawlowsm","emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"",
        "32x32":""},"displayName":"Pawlowski, Mary","active":true},"subtasks":[],
        "customfield_10040":"146161","customfield_10240":"156144","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"customfield_10241":null,"customfield_10000":null,
        "aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,"customfield_10364":null,
        "customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,
        "customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,
        "progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-316/votes","votes":0,"hasVoted":false}}},{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"189484",
        "self":"localhost:2990/rest/api/2/issue/189484","key":"ADVADM-267","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,
        "project":{"self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM",
        "name":"Ad AdMission","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012",
        "description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":null,"workratio":-1,"lastViewed":null,
        "watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-267/watchers","watchCount":1,
        "isWatching":false},"created":"2014-07-08T13:54:04.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"",
        "name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10o7xk:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,"issuelinks":[],
        "assignee":null,"updated":"2014-08-04T09:54:20.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|1002uf:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"AWS - Perf Env","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-3","aggregatetimeestimate":null,
        "summary":"Set up a Perf Env with AWS for feasibility study ","creator":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"subtasks":[],"customfield_10040":"141254",
        "customfield_10240":"134603","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-267/votes",
        "votes":0,"hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"188982","self":"localhost:2990/rest/api/2/issue/188982",
        "key":"ADVADM-259","fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6",
        "id":"6","description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{"48x48":"","24x24":"",
        "16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012",
        "description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":null,
        "workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-259/watchers","watchCount":1,
        "isWatching":false},"created":"2014-07-07T11:29:24.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3",
        "iconUrl":"","name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10o560:",
        "timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":null,
        "updated":"2014-07-07T11:32:09.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|1009q0:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"AdReports DCM Support",
        "customfield_10843":{"self":"localhost:2990/rest/api/2/customFieldOption/10612",
        "value":"To Do","id":"10612"},"customfield_10844":"ghx-label-4","aggregatetimeestimate":null,
        "summary":"Update API to support DCM Data and Ubercron queued jobs","creator":{
        "self":"localhost:2990/rest/api/2/user?username=verghesr","name":"verghesr",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Verghese, Riya","active":true},"subtasks":[],"customfield_10040":"140806",
        "customfield_10240":"152713","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=verghesr","name":"verghesr",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Verghese, Riya","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-259/votes","votes":0,
        "hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"185288","self":"localhost:2990/rest/api/2/issue/185288","key":"ADVADM-229",
        "fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{"48x48":"","24x24":"",
        "16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,
        "customfield_10474":null,"aggregatetimespent":null,"customfield_10475":null,
        "resolution":null,"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":null,"workratio":-1,"lastViewed":null,
        "watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-229/watchers","watchCount":1,
        "isWatching":false},"created":"2014-06-23T08:44:57.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3",
        "iconUrl":"","name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10nj14:",
        "timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":null,
        "updated":"2014-08-06T14:50:56.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"localhost:2990/images/icons/statuses/open.png","name":"Open",
        "id":"1","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/2",
        "id":2,"key":"new","colorName":"blue-gray","name":"New"}},"components":[],
        "customfield_11140":"true","timeoriginalestimate":null,"description":null,
        "customfield_10010":null,"customfield_10011":null,"customfield_10012":"Done when: ",
        "customfield_10013":null,"customfield_10014":null,"customfield_11940":"0|100ba8:",
        "customfield_10005":null,"customfield_10841":null,
        "customfield_10842":"Retargeting Service Improvements","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-7","aggregatetimeestimate":null,
        "summary":"Improvements to retargeting service. srsly.","creator":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"subtasks":[],"customfield_10040":"137220",
        "customfield_10240":"148658","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-229/votes",
        "votes":0,"hasVoted":false}}},{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"183864",
        "self":"localhost:2990/rest/api/2/issue/183864","key":"ADVADM-228","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{"48x48":"","24x24":"",
        "16x16":"","32x32":""},"projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012",
        "id":"10012","description":"","name":"Advertising"}},"customfield_10472":null,
        "fixVersions":[],"customfield_10473":null,"customfield_10474":null,
        "aggregatetimespent":null,"customfield_10475":null,"resolution":null,
        "customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-228/watchers","watchCount":1,
        "isWatching":false},"created":"2014-06-17T09:35:51.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major",
        "id":"3"},"labels":[],"customfield_11941":"0|10naz4:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-07-07T09:59:04.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|1007cw:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"AWS Investigation",
        "customfield_10843":{"self":"localhost:2990/rest/api/2/customFieldOption/10610",
        "value":"Done","id":"10610"},"customfield_10844":"ghx-label-6",
        "aggregatetimeestimate":null,
        "summary":"is AWS a feasible replacement for DC2 and upcoming ideas about data centers?",
        "creator":{"self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"subtasks":[],"customfield_10040":"135915",
        "customfield_10240":"134605","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,
        "customfield_10364":null,"customfield_10365":null,"customfield_10640":"Not Started",
        "customfield_10003":0.0,"customfield_10004":null,"customfield_10840":null,"environment":null,
        "duedate":null,"progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-228/votes","votes":0,"hasVoted":false}}},{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"181896",
        "self":"localhost:2990/rest/api/2/issue/181896","key":"ADVADM-213","fields":{"issuetype":{
        "self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"","name":"Epic",
        "subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,
        "project":{"self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM",
        "name":"Ad AdMission","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012",
        "description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":null,"workratio":-1,
        "lastViewed":null,"watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-213/watchers",
        "watchCount":1,"isWatching":false},"created":"2014-06-09T11:41:08.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10mzns:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,"issuelinks":[],
        "assignee":null,"updated":"2014-06-09T11:43:12.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.","iconUrl":"",
        "name":"Open","id":"1","statusCategory":{"self":"localhost:2990/rest/api/2/statuscategory/2",
        "id":2,"key":"new","colorName":"blue-gray","name":"New"}},"components":[],
        "customfield_11140":"true","timeoriginalestimate":null,"description":null,
        "customfield_10010":null,"customfield_10011":null,"customfield_10012":"Done when: ",
        "customfield_10013":null,"customfield_10014":null,"customfield_11940":"0|100f74:",
        "customfield_10005":null,"customfield_10841":null,
        "customfield_10842":"Prevent Database Locking and resulting disasters","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10610","value":"Done","id":"10610"},
        "customfield_10844":"ghx-label-3","aggregatetimeestimate":null,
        "summary":"we're having issues with DBs locking","creator":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"subtasks":[],
        "customfield_10040":"134082","customfield_10240":"144320","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra","emailAddress":"",
        "avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Fineshriber, Aaron","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,
        "progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-213/votes","votes":0,"hasVoted":false}}},{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"181844",
        "self":"localhost:2990/rest/api/2/issue/181844","key":"ADVADM-206","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{"48x48":"",
        "24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":null,"workratio":-1,
        "lastViewed":null,"watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-206/watchers",
        "watchCount":1,"isWatching":false},"created":"2014-06-09T10:19:58.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":
        {"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10mzco:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-07-29T16:34:52.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|100fj4:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"Custom Ad Sizes","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-5","aggregatetimeestimate":null,
        "summary":"Support custom ad sizes throughout AdMission product lines",
        "creator":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"subtasks":[],"customfield_10040":"134032",
        "customfield_10240":"144296","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm",
        "emailAddress":"","avatarUrls":{"48x48":"","24x24":"","16x16":"","32x32":""},
        "displayName":"Pawlowski, Mary","active":true},"customfield_10241":null,
        "customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{
        "progress":0,"total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-206/votes",
        "votes":0,"hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"181467","self":"localhost:2990/rest/api/2/issue/181467","key":"ADVADM-188",
        "fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{"48x48":"",
        "24x24":"","16x16":"","32x32":""},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,
        "customfield_10474":null,"aggregatetimespent":null,"customfield_10475":null,
        "resolution":null,"customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-188/watchers","watchCount":1,"isWatching":false},
        "created":"2014-06-06T09:47:08.000-0700","customfield_10140":null,"customfield_10340":null,
        "priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major",
        "id":"3"},"labels":[],"customfield_11941":"0|10mx6g:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,"issuelinks":[],
        "assignee":null,"updated":"2014-06-09T11:43:03.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new","colorName":"blue-gray",
        "name":"New"}},"components":[],"customfield_11140":"true","timeoriginalestimate":null,
        "description":null,"customfield_10010":null,"customfield_10011":null,
        "customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,
        "customfield_11940":"0|100d4g:","customfield_10005":null,"customfield_10841":null,
        "customfield_10842":"DB Optimization","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-1","aggregatetimeestimate":null,"summary":"DB Optimization",
        "creator":{"self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm",
        "emailAddress":"","avatarUrls":{},"displayName":"Pawlowski, Mary","active":true},
        "subtasks":[],"customfield_10040":"133680","customfield_10240":"144124","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=pawlowsm","name":"pawlowsm",
        "emailAddress":"","avatarUrls":{},"displayName":"Pawlowski, Mary","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,
        "total":0},"customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-188/votes","votes":0,
        "hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"178456","self":"localhost:2990/rest/api/2/issue/178456","key":"ADVADM-165",
        "fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{},
        "projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012",
        "description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":null,"workratio":-1,
        "lastViewed":null,"watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-165/watchers",
        "watchCount":1,"isWatching":false},"created":"2014-05-27T14:48:32.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10me28:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-08-06T14:51:50.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|1007u0:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"Component Setup for New Envs",
        "customfield_10843":{"self":"localhost:2990/rest/api/2/customFieldOption/10612",
        "value":"To Do","id":"10612"},"customfield_10844":"ghx-label-4",
        "aggregatetimeestimate":null,"summary":"Make components configuring for easier setup",
        "creator":{"self":"localhost:2990/rest/api/2/user?username=dominyr","name":"dominyr",
        "emailAddress":"","avatarUrls":{},"displayName":"Dominy, Robert","active":true},
        "subtasks":[],"customfield_10040":"130583","customfield_10240":"142356","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=dominyr","name":"dominyr",
        "emailAddress":"","avatarUrls":{},"displayName":"Dominy, Robert","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,
        "total":0},"customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-165/votes",
        "votes":0,"hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"177463","self":"localhost:2990/rest/api/2/issue/177463","key":"ADVADM-155",
        "fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,
        "customfield_10474":null,"aggregatetimespent":null,"customfield_10475":null,
        "resolution":null,"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":null,"workratio":-1,"lastViewed":null,
        "watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-155/watchers","watchCount":1,
        "isWatching":false},"created":"2014-05-21T15:29:26.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3",
        "iconUrl":"","name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10m8fs:",
        "timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":null,
        "updated":"2014-05-21T16:45:03.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|100ax4:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"House Ad Reduction","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-5","aggregatetimeestimate":null,
        "summary":"steps we can take to prevent accidental","creator":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{},"displayName":"Fineshriber, Aaron","active":true},
        "subtasks":[],"customfield_10040":"129672","customfield_10240":"141828","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=fineshra","name":"fineshra",
        "emailAddress":"","avatarUrls":{},"displayName":"Fineshriber, Aaron","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,
        "total":0},"customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-155/votes","votes":0,
        "hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"177085","self":"localhost:2990/rest/api/2/issue/177085","key":"ADVADM-152","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"","name":"Epic",
        "subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,
        "project":{"self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM",
        "name":"Ad AdMission","avatarUrls":{},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],"customfield_10473":null,
        "customfield_10474":null,"aggregatetimespent":null,"customfield_10475":null,
        "resolution":null,"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":null,"workratio":-1,"lastViewed":null,
        "watches":{"self":"localhost:2990/rest/api/2/issue/ADVADM-152/watchers",
        "watchCount":1,"isWatching":false},"created":"2014-05-20T23:53:16.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10m6ko:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-06-19T15:37:24.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|100du8:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"TapAd","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10610","value":"Done","id":"10610"},
        "customfield_10844":"ghx-label-4","aggregatetimeestimate":null,
        "summary":"TapAd Integration","creator":{
        "self":"localhost:2990/rest/api/2/user?username=james","name":"james",
        "emailAddress":"","avatarUrls":{},"displayName":"James","active":true},"subtasks":[],
        "customfield_10040":"129370","customfield_10240":"141585","reporter":{
        "self":"localhost:2990/rest/api/2/user?username=james","name":"james",
        "emailAddress":"","avatarUrls":{},"displayName":"James","active":true},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,
        "total":0},"customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,
        "total":0},"votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-152/votes",
        "votes":0,"hasVoted":false}}},{
        "expand":"operations,editmeta,changelog,transitions,renderedFields","id":"165984",
        "self":"localhost:2990/rest/api/2/issue/165984","key":"ADVADM-120","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{},
        "projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012",
        "id":"10012","description":"","name":"Advertising"}},"customfield_10472":null,
        "fixVersions":[],"customfield_10473":null,"customfield_10474":null,
        "aggregatetimespent":null,"customfield_10475":null,"resolution":null,
        "customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-120/watchers","watchCount":1,
        "isWatching":false},"created":"2014-05-07T15:28:51.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10lm7k:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-07-07T09:59:21.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|1005u8:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"Cookie Jar Optimization",
        "customfield_10843":{"self":"localhost:2990/rest/api/2/customFieldOption/10610",
        "value":"Done","id":"10610"},"customfield_10844":"ghx-label-6",
        "aggregatetimeestimate":null,"summary":"Changes to Cookie Jar to optimize",
        "creator":{},"subtasks":[],"customfield_10040":"126071","customfield_10240":"138366",
        "reporter":{},"customfield_10241":null,"customfield_10000":null,
        "aggregateprogress":{"progress":0,"total":0},"customfield_10001":null,
        "customfield_10364":null,"customfield_10365":null,"customfield_10640":"Not Started",
        "customfield_10003":0.0,"customfield_10004":null,"customfield_10840":null,
        "environment":null,"duedate":null,"progress":{"progress":0,"total":0},
        "votes":{"self":"localhost:2990/rest/api/2/issue/ADVADM-120/votes","votes":0,
        "hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"164954","self":"localhost:2990/rest/api/2/issue/164954","key":"ADVADM-104",
        "fields":{"issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{},
        "projectCategory":{"self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012",
        "description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":null,
        "workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-104/watchers","watchCount":1,
        "isWatching":false},"created":"2014-05-05T09:23:58.000-0700",
        "customfield_10140":null,"customfield_10340":null,"priority":{
        "self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major",
        "id":"3"},"labels":[],"customfield_11941":"0|10lg94:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-08-06T14:51:28.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,
        "customfield_10011":null,"customfield_10012":"Done when: ","customfield_10013":null,
        "customfield_10014":null,"customfield_11940":"0|10090o:","customfield_10005":null,
        "customfield_10841":null,"customfield_10842":"System or Process Improvements",
        "customfield_10843":{"self":"localhost:2990/rest/api/2/customFieldOption/10612",
        "value":"To Do","id":"10612"},"customfield_10844":"ghx-label-4",
        "aggregatetimeestimate":null,"summary":"Not an OPS task list","creator":{},
        "subtasks":[],"customfield_10040":"125106","customfield_10240":"137762",
        "reporter":{},"customfield_10241":null,"customfield_10000":null,"aggregateprogress":{
        "progress":0,"total":0},"customfield_10001":null,"customfield_10364":null,
        "customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,
        "customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,
        "progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-104/votes","votes":0,"hasVoted":false}}},
        {"expand":"operations,editmeta,changelog,transitions,renderedFields","id":"164397",
        "self":"localhost:2990/rest/api/2/issue/164397","key":"ADVADM-89","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012",
        "description":"","name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":{"self":"localhost:2990/rest/api/2/resolution/1",
        "id":"1","description":"A fix for this issue is checked into the tree and tested.",
        "name":"Fixed"},"customfield_11640":null,"customfield_10476":null,
        "customfield_10477":null,"resolutiondate":"2014-06-23T09:43:23.000-0700",
        "workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-89/watchers","watchCount":1,
        "isWatching":false},"created":"2014-05-01T11:31:24.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3",
        "iconUrl":"localhost:2990/images/icons/priorities/major.png","name":"Major","id":"3"},
        "labels":[],"customfield_11941":"0|10ld4w:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":{"self":"localhost:2990/rest/api/2/user?username=dominyr",
        "name":"dominyr","emailAddress":"","avatarUrls":{},"displayName":"","active":true},
        "updated":"2014-06-23T09:43:23.000-0700",
        "status":{"self":"localhost:2990/rest/api/2/status/6",
        "description":"The issue is considered finished, the resolution is correct.",
        "iconUrl":"","name":"Closed","id":"6","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/3","id":3,"key":"done",
        "colorName":"green","name":"Complete"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":"Requirements doc",
        "customfield_10010":null,"customfield_10011":null,"customfield_10012":"Done when: ",
        "customfield_10013":null,"customfield_10014":null,"customfield_11940":"0|100f28:",
        "customfield_10005":null,"customfield_10841":null,"customfield_10842":"Dealer",
        "customfield_10843":{"self":"localhost:2990/rest/api/2/customFieldOption/10610",
        "value":"Done","id":"10610"},"customfield_10844":"ghx-label-3",
        "aggregatetimeestimate":null,"summary":"Use location data","creator":{},
        "subtasks":[],"customfield_10040":"124601","customfield_10240":"137478",
        "reporter":{},"customfield_10241":null,"customfield_10000":null,"aggregateprogress":{
        "progress":0,"total":0},"customfield_10001":null,"customfield_10364":null,
        "customfield_10365":null,"customfield_10640":"Not Started","customfield_10003":0.0,
        "customfield_10004":null,"customfield_10840":null,"environment":null,"duedate":null,
        "progress":{"progress":0,"total":0},"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-89/votes","votes":0,"hasVoted":false}}},
        {"expand":"operations,editmeta,changelog,transitions,renderedFields","id":"163683",
        "self":"localhost:2990/rest/api/2/issue/163683","key":"ADVADM-88","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"",
        "name":"Epic","subtask":false},"timespent":null,"customfield_10030":null,
        "customfield_10350":null,"project":{"self":"localhost:2990/rest/api/2/project/13192",
        "id":"13192","key":"ADVADM","name":"Ad AdMission","avatarUrls":{},"projectCategory":{
        "self":"localhost:2990/rest/api/2/projectCategory/10012","id":"10012","description":"",
        "name":"Advertising"}},"customfield_10472":null,"fixVersions":[],
        "customfield_10473":null,"customfield_10474":null,"aggregatetimespent":null,
        "customfield_10475":null,"resolution":null,"customfield_11640":null,
        "customfield_10476":null,"customfield_10477":null,"resolutiondate":null,
        "workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-88/watchers","watchCount":1,"isWatching":false},
        "created":"2014-04-29T10:14:48.000-0700","customfield_10140":null,"customfield_10340":null,
        "priority":{"self":"localhost:2990/rest/api/2/priority/3","iconUrl":"","name":"Major",
        "id":"3"},"labels":[],"customfield_11941":"0|10l8lc:","timeestimate":null,
        "aggregatetimeoriginalestimate":null,"versions":[],"customfield_11747":null,
        "issuelinks":[],"assignee":null,"updated":"2014-07-21T13:24:33.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1","statusCategory":{
        "self":"localhost:2990/rest/api/2/statuscategory/2","id":2,"key":"new",
        "colorName":"blue-gray","name":"New"}},"components":[],"customfield_11140":"true",
        "timeoriginalestimate":null,"description":null,"customfield_10010":null,"customfield_10011":null,
        "customfield_10012":"Done when: ","customfield_10013":null,"customfield_10014":null,
        "customfield_11940":"0|100c0w:","customfield_10005":null,"customfield_10841":null,
        "customfield_10842":"Monitors and Alerts","customfield_10843":{
        "self":"localhost:2990/rest/api/2/customFieldOption/10612","value":"To Do","id":"10612"},
        "customfield_10844":"ghx-label-7","aggregatetimeestimate":null,
        "summary":"Creating Monitors and Alerts for our essential environments","creator":{},
        "subtasks":[],"customfield_10040":"123865","customfield_10240":"137133","reporter":{},
        "customfield_10241":null,"customfield_10000":null,"aggregateprogress":{"progress":0,"total":0},
        "customfield_10001":null,"customfield_10364":null,"customfield_10365":null,
        "customfield_10640":"Not Started","customfield_10003":0.0,"customfield_10004":null,
        "customfield_10840":null,"environment":null,"duedate":null,"progress":{"progress":0,"total":0},
        "votes":{"self":"https://atlassian03.cobaltgroup.com/rest/api/2/issue/ADVADM-88/votes",
        "votes":0,"hasVoted":false}}},{"expand":"operations,editmeta,changelog,transitions,renderedFields",
        "id":"162419","self":"localhost:2990/rest/api/2/issue/162419","key":"ADVADM-67","fields":{
        "issuetype":{"self":"localhost:2990/rest/api/2/issuetype/6","id":"6",
        "description":"A big user story that needs to be broken down.","iconUrl":"","name":"Epic",
        "subtask":false},"timespent":null,"customfield_10030":null,"customfield_10350":null,
        "project":{"self":"localhost:2990/rest/api/2/project/13192","id":"13192","key":"ADVADM",
        "name":"Ad AdMission","avatarUrls":{},"projectCategory":{
        "self":"https://atlassian03.cobaltgroup.com/rest/api/2/projectCategory/10012",
        "id":"10012","description":"","name":"Advertising"}},"customfield_10472":null,
        "fixVersions":[],"customfield_10473":null,"customfield_10474":null,
        "aggregatetimespent":null,"customfield_10475":null,"resolution":null,
        "customfield_11640":null,"customfield_10476":null,"customfield_10477":null,
        "resolutiondate":null,"workratio":-1,"lastViewed":null,"watches":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-67/watchers","watchCount":1,
        "isWatching":false},"created":"2014-04-23T11:06:26.000-0700","customfield_10140":null,
        "customfield_10340":null,"priority":{"self":"localhost:2990/rest/api/2/priority/3",
        "iconUrl":"","name":"Major","id":"3"},"labels":[],"customfield_11941":"0|10l1kg:",
        "timeestimate":null,"aggregatetimeoriginalestimate":null,"versions":[],
        "customfield_11747":null,"issuelinks":[],"assignee":null,
        "updated":"2014-04-23T12:14:25.000-0700","status":{
        "self":"localhost:2990/rest/api/2/status/1",
        "description":"The issue is open and ready for the assignee to start work on it.",
        "iconUrl":"","name":"Open","id":"1"}, },"votes":{
        "self":"localhost:2990/rest/api/2/issue/ADVADM-4/votes","votes":0,"hasVoted":false}}]});
        
        
        
        //declare the controller and inject our empty scope
        $controller('epicDetailsController', {
                  $scope: scope,
                  $http: http,
                  $location: location
              });
              
    }));
    
    
    
    //test
    
    // test whether the default worktype is story    
    it('should initially take the worktype as stories', function(){
   		expect(scope.workType).toEqual(1);
    });
    
    // test it get the epic key
    it('should get the epic key', function(){
    	expect(scope.key).toEqual("ADVADM-316");
    });
    
    
    // test it make 4 http GET requests
    it('should make 4 http GET requests for epic details', function () {
    	httpBackend.expectGET(scope.getBaseURL+"/rest/api/2/issue/ADVADM-316");
        httpBackend.expectGET(scope.getBaseURL+'/rest/api/2/search?jql="Epic Link"=ADVADM-316 order by resolutiondate desc'); 
        httpBackend.expectGET(scope.getBaseURL+'/rest/api/2/field'); 
        httpBackend.expectGET(scope.getBaseURL+'/rest/api/2/search?jql=project="ADVADM" and issuetype="Epic"');
        httpBackend.flush();
        
    });

	// verify the eipc name
    it('should get the eipic name', function(){
    	httpBackend.flush();
    	expect(scope.epicName).toEqual("Market Class Intent");
    });
    
    
    it('should get the project name', function(){
    	httpBackend.flush();
    	expect(scope.projectName).toEqual("Ad AdMission");
    });
    
    
    
    it('should have 6 stories in its full story list', function(){
    	httpBackend.flush();
    	expect(scope.fullStories.length).toEqual(6);
    });
    
    it('should initially have 6 stories in its selected story list', function(){
    	httpBackend.flush();
    	expect(scope.stories.length).toEqual(6);
    });
    
    it('should count the notStarted storie, inProgress stories and done stories', function(){
    	httpBackend.flush();
    	expect(scope.notStarted).toEqual(3);
        expect(scope.inProgress).toEqual(0);
        expect(scope.done).toEqual(3);
    });
    
    it('should completed 0 stories in the past 7 days', function(){
    	httpBackend.flush();
    	expect(scope.numofStories).toEqual(0);
    });
    
    it('should completed 0 story points in the past 7 days', function(){
    	scope.workType = 2;
    	httpBackend.flush();
    	expect(scope.numofStories).toEqual(0);
    });
    
    it('should completed 0 work hours in the past 7 days', function(){
    	scope.workType = 3;
    	httpBackend.flush();
    	expect(scope.numofStories).toEqual(0);
    });
    
    it('should get the correspondent worktype string according to the selection of worktype', function(){
    	scope.workType = 0;
    	expect(scope.workTypeToString()).toEqual("Unknown");
    	scope.workType = 1;
    	expect(scope.workTypeToString()).toEqual("Stories");
    	scope.workType = 2;
    	expect(scope.workTypeToString()).toEqual("Story Points");
    	scope.workType = 3;
    	expect(scope.workTypeToString()).toEqual("Work Hours");
    });
    
    
    it('should format the work hours', function(){
    	scope.workType = 3;
    	expect(scope.format(2.543923)).toBe("2.54");
    	scope.workType = 1;
    	expect(scope.format(3)).toBe(3);
    });
    
});             
      

    
 
   