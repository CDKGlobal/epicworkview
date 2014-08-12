package com.cobalt.jira.plugin.epic.rest.jaxb;

import java.util.List;


public class JaxbStory extends JaxbIssue {
    boolean completed;
    List<JaxbUser> contributors;

    public JaxbStory() {
    }

    public boolean getCompleted() {
        return completed;
    }

    public List<JaxbUser> getContributors() {
        return contributors;
    }
}
