package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


@XmlRootElement(name = "story")
public class JaxbStory extends JaxbIssue {
    @XmlElement(name = "sub-tasks")
    List<JaxbIssue> subtasks;

    public JaxbStory() {
    }

    public List<JaxbIssue> getSubtasks() {
        return subtasks;
    }
}
