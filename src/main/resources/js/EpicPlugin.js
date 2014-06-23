AJS.$(document).ready(function() {
    AJS.$.when(
        AJS.$.get("/jira/rest/epic/1/projects.json")
    ).then(function(results) {
        AJS.$("#projects tbody").empty();
        AJS.$(results.projects).each(function(index, element) {
            AJS.$("#projects tbody").append('<tr><td>' + element.name + '</td><td>'+element.id+'</td><td>'+element.key+'</td><td>'+element.description+'</td></tr>');
        });
    });
});