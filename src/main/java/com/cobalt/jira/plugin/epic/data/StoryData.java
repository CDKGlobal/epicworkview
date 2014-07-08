package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;


public class StoryData extends IssueData {
    public StoryData(Issue story) {
        super(story);
    }

    public DataType getType() {
        return DataType.STORY;
    }

    @Override
    public IJiraData getEpic() {
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        Issue epic = (Issue)issue.getCustomFieldValue(manager.getCustomFieldObjectByName("Epic Link"));
        if(epic == null) {
            return new NullEpicData("Other Stories", "Stories without an epic");
        }
        return new EpicData(epic);
    }

    public IJiraData getStory() {
        return this;
    }
}
