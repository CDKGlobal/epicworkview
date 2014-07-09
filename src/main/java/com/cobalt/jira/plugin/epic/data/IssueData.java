package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.cobalt.jira.plugin.epic.data.util.StatusUtil;


/**
 * An IssueData represents a Jira Issue, which can be an epic, story, or subtask
 */
public class IssueData extends JiraData {
    Issue issue;

    /**
     * Creates a new IssueData
     * 
     * @param issue the issue to be held in this IssueData
     */
    public IssueData(Issue issue) {
        this.issue = issue;
        setTimestamp(issue.getUpdated().getTime());
    }

    @Override
    public DataType getType() {
        return DataType.SUBTASK;
    }

    /**
     * Returns the name of the issue
     * 
     * @return the name of the issue
     */
    public String getName() {
        return issue.getSummary();
    }

    /**
     * Returns the key of the issue
     * 
     * @return the key of the issue
     */
    public String getKey() {
        return issue.getKey();
    }

    /**
     * Returns the id of the issue
     * 
     * @return the id of the issue
     */
    public long getId() {
        return issue.getId();
    }

    /**
     * Returns the description of the issue
     * 
     * @return the description of the issue
     */
    public String getDescription() {
        return issue.getDescription();
    }

    public boolean completed() {
        return StatusUtil.enteredEndState(issue.getStatusObject().getName());
    }

    public User getAssignee() {
        return issue.getAssignee();
    }

    @Override
    public IJiraData getProject() {
        return new ProjectData(issue.getProjectObject());
    }

    @Override
    public IJiraData getEpic() {
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        Issue epic = (Issue)issue.getParentObject().getCustomFieldValue(manager.getCustomFieldObjectByName("Epic Link"));
        if(epic == null) {
            return new NullEpicData("Other Stories", "Stories without an epic");
        }
        return new EpicData(epic);
    }

    @Override
    public IJiraData getStory() {
        return new StoryData(issue.getParentObject());
    }

    public void update(IJiraData updatedIssue) {
        super.update(updatedIssue);

        if(updatedIssue instanceof IssueData) {
            issue = ((IssueData)updatedIssue).issue;
        }
    }
}
