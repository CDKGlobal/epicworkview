package com.teamepic.plugin.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.ServiceOutcome;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.sal.api.user.UserManager;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.LinkedList;
import java.util.List;


/**
 * Entry point for REST calls for projects
 */
@Path("/projects")
public class RestProjectResource {

	private ProjectService projectService;
	private SearchService searchService;
	private UserManager userManager;
	private com.atlassian.jira.user.util.UserManager jiraUserManager;

	public RestProjectResource(ProjectService projectService, SearchService searchService,
							   UserManager userManager, com.atlassian.jira.user.util.UserManager jiraUserManager) {
		this.projectService = projectService;
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
		ApplicationUser appUser = jiraUserManager.getUserByName(userManager.getRemoteUser().getUsername());
		return appUser != null ? appUser.getDirectoryUser() : null;
	}

	/**
	 * Called when the rest url is submitted
	 * @return all the projects in jira in either xml or json viewable to the current user
	 */
    @GET
    @AnonymousAllowed
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getProjects() {
		User user = getCurrentUser();

		//get the projects viewable to the current user
		ServiceOutcome<List<Project>> outcome =  projectService.getAllProjects(user);

		List<Project> projects = outcome != null ? outcome.get() : new LinkedList<Project>();

        return Response.ok(new RestProjectResourceModel(projects, searchService, user)).build();
    }
}