package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;


public interface IJiraData {

    /**
     * enumeration for the different types of jira data stored
     */
    public static enum DataType {
        PROJECT, EPIC, STORY, SUBTASK;

        //explicitly set the order of the enum values
        private static final DataType[] order = {PROJECT, EPIC, STORY, SUBTASK};

        /**
         * Gets the level of a data type in JIRA's hierarchy
         * @param dt - DataType to check
         * @return the level of the DataType given, -1 if null or not in the JIRA hierarchy
         */
        public static int getLevel(DataType dt) {
            for(int i = 0; i < order.length; i++) {
                if(dt == order[i]) {
                    return i;
                }
            }

            return -1;
        }
    }

    /**
     * Sets the timestamp of this jira data to the given if it is greater than the one currently stored
     *
     * @param timestamp - the time to update to
     */
    public void setTimestamp(long timestamp);

    /**
     * Gets the type of jira object being stored
     *
     * @return the type of jira object
     */
    public DataType getType();

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
    public long getTimestamp();

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
    public IJiraData getProject();

    /**
     * Get the epic this issue is apart of
     *
     * @return the EpicData for this issue
     */
    public IJiraData getEpic();

    /**
     * Get the story this issue is apart of
     *
     * @return the StoryData for this issue
     */
    public IJiraData getStory();

    /**
     * Updates this issue with the given issue
     * @param updatedIssue - the issue to get the updated values from
     */
    public void update(IJiraData updatedIssue);
}
