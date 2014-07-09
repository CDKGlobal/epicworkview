package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


@XmlRootElement(name = "story")
public class JaxbStory extends JaxbIssue {
    @XmlElement(name = "completed")
    boolean completed;

    @XmlElement(name = "subtasks")
    List<JaxbIssue> subtasks;

    public JaxbStory() {
    }

    public boolean getCompleted() {
        return completed;
    }

    public List<JaxbIssue> getSubtasks() {
        return subtasks;
    }
}
