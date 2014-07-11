package com.cobalt.jira.plugin.epic.data;

/**
 * Abstract class that implements fields common to all types of jira objects
 */
public abstract class JiraData implements IJiraData {
    private long timestamp = -1l;

    public void setTimestamp(long timestamp) {
        if(timestamp > this.timestamp)
            this.timestamp = timestamp;
    }

    public long getTimestamp() {
        return timestamp;
    }

    /**
     * Updates the timestamp of with the given issue
     *
     * @param updatedIssue - issue to get the new timestamp from
     */
    public void update(IJiraData updatedIssue) {
        setTimestamp(updatedIssue.getTimestamp());
    }
}
