package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.codehaus.jackson.annotate.JsonIgnore;


@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NONE)
public interface IJiraData {



    public void remove();

    public void setUpdatedTimestamp(long timestamp);

    public long getUpdatedTimestamp();

    /**
     * Sets the timestamp of this jira data to the given if it is greater than the one currently stored
     *
     * @param timestamp - the time to update to
     */
    public void setDisplayTimestamp(long timestamp);

    /**
     * Gets the type of jira object being stored
     *
     * @return the type of jira object
     */
    public JiraDataType getType();

    /**
     * Returns the name of the issue
     *
     * @return the name of the issue
     */
    public String getName();

    /**
     * Returns the description of the issue
     *
     * @return the description of the issue
     */
    public String getDescription();

    /**
     * Returns the id of the issue
     *
     * @return the id of the issue
     */
    public long getId();

    /**
     * Returns the key of the issue
     *
     * @return the key of the issue
     */
    public String getKey();

    /**
     * Gets the time of this object's last update
     * @return the last update time in milliseconds
     */
    public long getDisplayTimestamp();

    /**
     * Returns whether this issue is considered completed
     *
     * @return true if and only if the status is in a done state
     */
    public boolean completed();

    /**
     * Gets the assignee for this issue
     *
     * @return the assigned user for the issue, null otherwise
     */
    public User getAssignee();

    /**
     * Get the project this issue is apart of
     *
     * @return the ProjectData for this issue
     */
    @JsonIgnore
    public IJiraData getProject();

    /**
     * Get the epic this issue is apart of
     *
     * @return the EpicData for this issue
     */
    @JsonIgnore
    public IJiraData getEpic();

    /**
     * Get the story this issue is apart of
     *
     * @return the StoryData for this issue
     */
    @JsonIgnore
    public IJiraData getStory();

    /**
     * Updates this issue with the given issue
     * @param updatedIssue - the issue to get the updated values from
     */
    public void update(IJiraData updatedIssue);
}
