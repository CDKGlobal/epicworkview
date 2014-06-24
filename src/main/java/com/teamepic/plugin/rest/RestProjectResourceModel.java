package com.teamepic.plugin.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.project.Project;

import javax.xml.bind.annotation.*;
import java.util.List;


/**
 * Contains information about all projects in jira
 */
@XmlRootElement(name = "jira")
@XmlAccessorType(XmlAccessType.FIELD)
public class RestProjectResourceModel {

    @XmlElement(name = "projects")
    private RestProject[] projects;

	/**
	 * required for JAXB
	 */
    public RestProjectResourceModel() {
    }

	/**
	 * Constructs a resource that has information on all the projects in jira
	 * @param projects - all the projects in jira
	 * @param searchService - service used to search for issues
	 * @param user - currently logged in user
	 */
    public RestProjectResourceModel(List<Project> projects, SearchService searchService, User user) {
		this.projects = new RestProject[projects.size()];

		int i = 0;
		for(Project p : projects)
		{
			this.projects[i] = new RestProject(p, searchService, user);
			i++;
		}
    }

	public RestProject[] getProjects()
	{
		return projects;
	}
}