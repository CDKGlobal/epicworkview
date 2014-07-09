package com.cobalt.jira.plugin.epic.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.event.api.EventListener;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.event.type.EventType;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.*;
import com.cobalt.jira.plugin.epic.rest.jaxb.*;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;


/**
 * Entry point for REST calls for projects
 */
@Path("/")
public class RestResource implements InitializingBean, DisposableBean {
    private SearchService searchService;
    private UserManager userManager;
    private com.atlassian.jira.user.util.UserManager jiraUserManager;
    private EventPublisher eventPublisher;
    private DataManager dataManager;
    private UserUtil userUtil;

    private boolean enabled = false;

    /**
     * Rest resource that use dependency injection to get necessary components
     *
     * @param searchService   - used to search for issue in jira
     * @param userManager     - used to get the current user from the browser session
     * @param jiraUserManager - used to get the user in jira from the remote user
     * @param eventPublisher  - used to register listeners to jira's notification system
     */
    public RestResource(SearchService searchService, UserManager userManager,
                        com.atlassian.jira.user.util.UserManager jiraUserManager,
                        EventPublisher eventPublisher, UserUtil userUtil,
                        ProjectService projectService) {
        this.searchService = searchService;
        this.userManager = userManager;
        this.jiraUserManager = jiraUserManager;
        this.eventPublisher = eventPublisher;
        this.userUtil = userUtil;

        dataManager = new DataManager(projectService);
    }

    /**
     * Called when the plugin has been enabled.
     *
     * @throws Exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        if(!enabled) {
            // remove any listeners already registered, in case jira enables this plugin without first disabling it
            eventPublisher.unregister(this);
            // register ourselves with the EventPublisher
            eventPublisher.register(this);//add this object to listen for events

            // have datamanager initialize its resources
            dataManager.init(searchService, userUtil);

            enabled = true;
        }
    }

    /**
     * Called when the plugin is being disabled or removed.
     *
     * @throws Exception
     */
    @Override
    public void destroy() throws Exception {
        if(enabled) {
            // unregister ourselves with the EventPublisher
            eventPublisher.unregister(this);

            // have datamanager clean up its resources
            dataManager.destroy();

            enabled = false;
        }
    }

    /**
     * Gets the current user that is logged into jira
     *
     * @return the user currently logged in
     */
    private User getCurrentUser() {
        // To get the current user, we first get the username from the session.
        // Then we pass that over to the jiraUserManager in order to get an
        // actual User object.
        UserProfile ru = userManager.getRemoteUser();

        //if there is a user profile
        if(ru != null) {
            ApplicationUser appUser = jiraUserManager.getUserByName(ru.getUsername());

            //if there is an application user
            if(appUser != null) {
                return appUser.getDirectoryUser();
            }
        }

        return null;
    }

    /**
     * Called when the rest url is submitted for projects
     *
     * @return all the projects in jira in either xml or json viewable to the current user
     */
    @Path("/projects")
    @GET
    @AnonymousAllowed
    @Produces(MediaType.APPLICATION_JSON)
    public List<JaxbProject> getProjects(@DefaultValue("5") @QueryParam("seconds") int seconds) {
        List<JaxbProject> projects = new ArrayList<JaxbProject>();

        if(enabled) {
            //get all project with epics
            List<IJiraData> preOrder = dataManager.getProjects(getCurrentUser(), seconds);

            while(preOrder.size() > 0)
                buildJaxb(preOrder, projects);
        }

        return projects;
    }

    @SuppressWarnings("unchecked")
    private <T extends JaxbIssue> void buildJaxb(List<IJiraData> input, List<T> output) {
        if(input.size() == 0)
            return;

        IJiraData data = input.get(0);
        input.remove(0);

        if(data.getType() == IJiraData.DataType.SUBTASK)
            output.add((T)JaxbFactory.newJaxbIssue(data));
        else {
            List temp = null;
            switch(data.getType()) {
            case PROJECT:
                temp = new ArrayList<JaxbEpic>();
                break;
            case EPIC:
                temp = new ArrayList<JaxbStory>();
                break;
            case STORY:
                temp = new ArrayList<JaxbIssue>();
                break;
            default:
                return;
            }

            //while the next element is a subtype of data
            while(input.size() > 0 && input.get(0).getType().compareTo(data.getType()) > 0) {
                buildJaxb(input, temp);
            }

            switch(data.getType()) {
            case PROJECT:
                output.add((T)JaxbFactory.newJaxbProject(data, temp));
                break;
            case EPIC:
                output.add((T)JaxbFactory.newJaxbEpic(data, temp));
                break;
            case STORY:
                output.add((T)JaxbFactory.newJaxbStory(data, temp));
                break;
            default:
                return;
            }
        }
    }

    /**
     * Called by the client to get all saved filters
     *
     * @return all of the saved filter for current user
     */
    @Path("/filter")
    @GET
    @AnonymousAllowed
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFilters() {
        return Response.ok().build();
    }

    /**
     * Called by the client to save the query filter
     *
     * @param query - the filter to save
     * @return the filter that was saved
     */
    @Path("/filter/{query}")
    @GET
    @AnonymousAllowed
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveFilter(@PathParam("query") String query) {
        return Response.ok().build();
    }

    /**
     * Event listening testing
     *
     * @param issueEvent - the event containing the issue
     */
    @EventListener
    public void issueEventListener(IssueEvent issueEvent) {
        dataManager.newIssueEvent(issueEvent);
    }

    /**
     * Used for unit testing only
     * @param dataManager - the dataManager the rest resource will use
     */
    public void setDataManager(DataManager dataManager) {
        this.dataManager = dataManager;
    }
}