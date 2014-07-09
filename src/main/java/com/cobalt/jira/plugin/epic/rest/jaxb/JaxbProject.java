package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


/**
 * Contains information about a single project in jira
 */
@XmlRootElement(name = "project")
public class JaxbProject extends JaxbIssue
{
	@XmlElement(name = "epics")
	List<JaxbEpic> epics;

    @XmlElement(name = "completedStories")
    int completedStories;

    @XmlElement(name = "contributers")
    List<JaxbUser> contributers;

	/**
	 * required for JAXB
	 */
	public JaxbProject() {
	}

	public List<JaxbEpic> getEpics()
	{
		return epics;
	}

    public int getCompletedStories() {
        return completedStories;
    }
}
