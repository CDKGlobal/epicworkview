package com.teamepic.plugin.rest;

import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.jira.project.ProjectManager;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Path("/projects")
public class RestProjectResource {

	private ProjectManager projectManager;

	public RestProjectResource(ProjectManager projectManager) {
		this.projectManager = projectManager;
	}

    @GET
    @AnonymousAllowed
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getMessage() {
       return Response.ok(new RestProjectResourceModel(projectManager.getProjectObjects())).build();
    }
}