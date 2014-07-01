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
        Object o = issue.getCustomFieldValue(ComponentAccessor.getCustomFieldManager().getCustomFieldObjectByName("Epic Link"));
        return o instanceof Issue ? (Issue)o : null;
    }
}
