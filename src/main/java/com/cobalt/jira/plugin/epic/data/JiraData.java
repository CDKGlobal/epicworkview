package com.cobalt.jira.plugin.epic.data;

public abstract class JiraData implements IJiraData {
    private long timestamp = -1l;

    public void setTimestamp(long timestamp) {
        if(timestamp > this.timestamp)
            this.timestamp = timestamp;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void update(IJiraData updatedIssue) {
        setTimestamp(updatedIssue.getTimestamp());
    }
}
