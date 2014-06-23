package com.teamepic.plugin.rest;

import com.atlassian.jira.project.Project;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name = "project")
public class RestProject
{
	@XmlElement(name = "name")
	private String name;

	@XmlElement(name = "key")
	private String key;

	@XmlElement(name = "id")
	private long id;

	@XmlElement(name = "description")
	private String description;


	public RestProject() {
	}

	public RestProject(Project p) {
		name = p.getName();
		key = p.getKey();
		id = p.getId();
		description = p.getDescription();
	}
}
