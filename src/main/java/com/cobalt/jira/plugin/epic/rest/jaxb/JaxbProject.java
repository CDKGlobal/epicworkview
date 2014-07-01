package com.cobalt.jira.plugin.epic.rest.jaxb;

import com.atlassian.jira.project.Project;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


/**
 * Contains information about a single project in jira
 */
@XmlRootElement(name = "project")
public class JaxbProject
{
	@XmlElement(name = "name")
	private String name;

	@XmlElement(name = "key")
	private String key;

	@XmlElement(name = "id")
	private long id;

	@XmlElement(name = "description")
	private String description;

	@XmlElement(name = "epics")
	private List<JaxbEpic> epics;

	/**
	 * required for JAXB
	 */
	public JaxbProject() {
	}

	/**
	 * Constructs a project that the REST Api can send to the client
	 * @param p - the project to store
     * @param epics - the epics associated with this project
	 */
	public JaxbProject(Project p, List<JaxbEpic> epics) {
		//store information that we want about the project
		name = p.getName();
		key = p.getKey();
		id = p.getId();
		description = p.getDescription();
        this.epics = epics;
	}

	public String getName()
	{
		return name;
	}

	public String getKey()
	{
		return key;
	}

	public long getId()
	{
		return id;
	}

	public String getDescription()
	{
		return description;
	}

	public List<JaxbEpic> getEpics()
	{
		return epics;
	}
}
