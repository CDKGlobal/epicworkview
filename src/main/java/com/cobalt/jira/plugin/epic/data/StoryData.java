package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.project.Project;


public class StoryData extends IssueData {
    public StoryData(Issue story) {
        super(story);
    }

    public Project getProject() {
        return issue.getProjectObject();
    }

    public Issue getEpic() {
        //TODO probably returns the key which we need to get the issue from
        Object o = issue.getCustomFieldValue(ComponentAccessor.getCustomFieldManager().getCustomFieldObjectByName("Epic Link"));
        System.out.println(o);
        if(o instanceof Issue)
            return (Issue)o;
        return null;
    }
}
