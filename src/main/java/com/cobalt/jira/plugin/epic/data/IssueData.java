package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.issue.Issue;

/**
 * An IssueData represents a Jira Issue, which can be an epic, story, or subtask
 */
public class IssueData implements JiraDataInterface{
    Issue issue;

    /**
     * Creates a new IssueData
     * 
     * @param issue the issue to be held in this IssueData
     */
    public IssueData(Issue issue) {
        this.issue = issue;
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

    /**
     * Returns the last updated time of the issue
     * 
     * @return the last updated time of the issue
     */
    public long getTimestamp() {
        return issue.getUpdated().getTime();
    }

    public String toString() {
        return getName();
    }
}
