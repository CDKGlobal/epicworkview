package com.cobalt.jira.plugin.epic.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.project.Project;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbProject;

import javax.xml.bind.annotation.*;
import java.util.List;


/**
 * Contains information about all projects in jira
 */
@XmlRootElement(name = "jira")
public class RestProjectResourceModel {

    @XmlElement(name = "projects")
    private JaxbProject[] jaxbProjects;

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
		jaxbProjects = new JaxbProject[projects.size()];

		int i = 0;
		for(Project p : projects)
		{
			jaxbProjects[i] = new JaxbProject(p, searchService, user);
			i++;
		}
    }

	public JaxbProject[] getJaxbProjects() {
		return jaxbProjects;
	}
}