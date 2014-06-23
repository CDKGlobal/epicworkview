package com.teamepic.plugin.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.project.Project;

import javax.xml.bind.annotation.*;
import java.util.List;


@XmlRootElement(name = "jira")
@XmlAccessorType(XmlAccessType.FIELD)
public class RestProjectResourceModel {

    @XmlElement(name = "projects")
    private RestProject[] projects;

    public RestProjectResourceModel() {
    }

    public RestProjectResourceModel(List<Project> projects, SearchService searchService, User user) {
		this.projects = new RestProject[projects.size()];

		int i = 0;
		for(Project p : projects)
		{
			this.projects[i] = new RestProject(p, searchService, user);
			i++;
		}
    }
}