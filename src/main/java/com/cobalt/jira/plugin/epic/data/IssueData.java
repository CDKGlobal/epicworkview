package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.issue.Issue;


public class IssueData implements JiraDataInterface{
    Issue issue;

    public IssueData(Issue issue) {
        this.issue = issue;
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

    public long getTimestamp() {
        return issue.getUpdated().getTime();
    }

    public String toString() {
        return getName();
    }
}
