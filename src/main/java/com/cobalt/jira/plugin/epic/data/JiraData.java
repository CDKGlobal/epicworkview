package com.cobalt.jira.plugin.epic.data;

/**
 * Abstract class that implements fields common to all types of jira objects
 */
public abstract class JiraData implements IJiraData {
    private long displayTimestamp = 0l;
    private long updatedTimestamp = 0l;

    public void remove() {
        this.displayTimestamp = -1;
    }

    public void setUpdatedTimestamp(long timestamp) {
        if(timestamp > this.updatedTimestamp)
            this.updatedTimestamp = timestamp;
    }

    public long getUpdatedTimestamp() {
        return updatedTimestamp;
    }

    public void setDisplayTimestamp(long timestamp) {
        if(timestamp > this.displayTimestamp)
            this.displayTimestamp = timestamp;
    }

    public long getDisplayTimestamp() {
        return displayTimestamp;
    }

    /**
     * Updates the displayTimestamp of with the given issue
     *
     * @param updatedIssue - issue to get the new displayTimestamp from
     */
    public void update(IJiraData updatedIssue) {
        setUpdatedTimestamp(updatedIssue.getUpdatedTimestamp());
    }


}
