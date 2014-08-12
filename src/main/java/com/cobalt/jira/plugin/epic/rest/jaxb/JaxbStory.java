package com.cobalt.jira.plugin.epic.rest.jaxb;

public class JaxbStory extends JaxbIssue {
    boolean completed;

    public JaxbStory() {
    }

    public boolean getCompleted() {
        return completed;
    }
}
