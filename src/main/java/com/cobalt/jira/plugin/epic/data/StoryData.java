package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
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
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        Object o = issue.getCustomFieldValue(manager.getCustomFieldObjectByName("Epic Link"));
        return o instanceof Issue ? (Issue)o : null;
    }
}
