package com.teamepic.plugin.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.jira.project.ProjectManager;
import com.atlassian.sal.api.user.UserManager;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


/**
 * Entry point for REST calls for projects
 */
@Path("/projects")
public class RestProjectResource {

	private ProjectManager projectManager;
	private SearchService searchService;
	private UserManager userManager;
	private com.atlassian.jira.user.util.UserManager jiraUserManager;

	public RestProjectResource(ProjectManager projectManager, SearchService searchService,
							   UserManager userManager, com.atlassian.jira.user.util.UserManager jiraUserManager) {
		this.projectManager = projectManager;
		this.searchService = searchService;
		this.userManager = userManager;
		this.jiraUserManager = jiraUserManager;
	}

	/**
	 * Gets the current user that is logged into jira
	 * @return the user currently logged in
	 */
	private User getCurrentUser()
	{
		// To get the current user, we first get the username from the session.
		// Then we pass that over to the jiraUserManager in order to get an
		// actual User object.
		return jiraUserManager.getUserByName(userManager.getRemoteUsername()).getDirectoryUser();
	}

	/**
	 * Called when the rest url is submitted
	 * @return all the projects in jira in either xml or json
	 */
    @GET
    @AnonymousAllowed
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getProjects() {
       return Response.ok(new RestProjectResourceModel(projectManager.getProjectObjects(), searchService, getCurrentUser())).build();
    }
}