package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.cobalt.jira.plugin.epic.data.util.StatusUtil;
import org.codehaus.jackson.annotate.JsonIgnore;


/**
 * An IssueData represents a Jira Issue, which can be an epic, story, or subtask
 */
public class IssueData extends JiraData {
    @JsonIgnore
    Issue issue;

    /**
     * Creates a new IssueData
     * 
     * @param issue the issue to be held in this IssueData
     */
    public IssueData(Issue issue) {
        this.issue = issue;
        setUpdatedTimestamp(issue.getUpdated().getTime());

        if(StatusUtil.hasBeenWorkedOn(issue)) {
            setDisplayTimestamp(StatusUtil.lastWorkedOnTime(issue));
            setUpdatedTimestamp(getDisplayTimestamp());
        }
    }

    public JiraDataType getType() {
        return JiraDataType.SUBTASK;
    }

    public String getName() {
        return issue.getSummary();
    }

    public String getKey() {
        return issue.getKey();
    }

    public long getId() {
        return issue.getId();
    }

    public String getDescription() {
        return issue.getDescription();
    }

    public boolean completed() {
        return StatusUtil.enteredEndState(issue.getStatusObject().getName());
    }

    public User getAssignee() {
        return issue.getAssignee();
    }

    public IJiraData getProject() {
        return new ProjectData(issue.getProjectObject());
    }

    /**
     * Get the epic this issue is apart of
     *
     * @return the EpicData for this issue if it has one, otherwise returns a fake Epic
     */
    public IJiraData getEpic() {
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        Issue epic = (Issue)issue.getParentObject().getCustomFieldValue(manager.getCustomFieldObjectByName("Epic Link"));
        if(epic == null) {
            return new NullEpicData("Other Stories", "Stories without an epic");
        }
        return new EpicData(epic);
    }

    public IJiraData getStory() {
        return new StoryData(issue.getParentObject());
    }

    public void update(IJiraData updatedIssue) {
        super.update(updatedIssue);

        if(updatedIssue instanceof IssueData) {
            issue = ((IssueData)updatedIssue).issue;

            if(StatusUtil.hasBeenWorkedOn(issue)) {
                setDisplayTimestamp(StatusUtil.lastWorkedOnTime(issue));
            }
        }
    }
}
