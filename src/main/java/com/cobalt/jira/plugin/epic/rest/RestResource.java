package com.cobalt.jira.plugin.epic.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.event.api.EventListener;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.bc.ServiceOutcome;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.jql.builder.JqlQueryBuilder;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.query.Query;
import com.atlassian.query.order.SortOrder;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.*;
import com.cobalt.jira.plugin.epic.rest.jaxb.*;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;


/**
 * Entry point for REST calls for projects
 */
@Path("/")
public class RestResource implements InitializingBean, DisposableBean {


    private ProjectService projectService;
    private SearchService searchService;
    private UserManager userManager;
    private com.atlassian.jira.user.util.UserManager jiraUserManager;
    private EventPublisher eventPublisher;
    private DataManager dataManager;

    /**
     * Rest resource that use dependency injection to get necessary components
     *
     * @param projectService  - used to get projects from jira
     * @param searchService   - used to search for issue in jira
     * @param userManager     - used to get the current user from the browser session
     * @param jiraUserManager - used to get the user in jira from the remote user
     * @param eventPublisher  - used to register listeners to jira's notification system
     */
    public RestResource(ProjectService projectService, SearchService searchService,
                        UserManager userManager, com.atlassian.jira.user.util.UserManager jiraUserManager,
                        EventPublisher eventPublisher) {
        this.projectService = projectService;
        this.searchService = searchService;
        this.userManager = userManager;
        this.jiraUserManager = jiraUserManager;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Called when the plugin has been enabled.
     *
     * @throws Exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        //remove any listeners already registered, in case jira enables this plugin without first disabling it
        eventPublisher.unregister(this);
        // register ourselves with the EventPublisher
        eventPublisher.register(this);//add this object to listen for events
        dataManager = new DataManager(searchService);
    }

    /**
     * Called when the plugin is being disabled or removed.
     *
     * @throws Exception
     */
    @Override
    public void destroy() throws Exception {
        // unregister ourselves with the EventPublisher
        eventPublisher.unregister(this);
        dataManager = null;
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
    public List<JaxbProject> getProjects() {
        List<JaxbProject> projects = new ArrayList<JaxbProject>();

        List<JiraData> ps = dataManager.getProjects(getCurrentUser());
        for(JiraData project : ps) {
            List<JaxbEpic> epics = new ArrayList<JaxbEpic>();

            Iterator<JiraDataInterface> epicIter = project.getIterator();
            while(epicIter.hasNext()) {
                JiraData epic = (JiraData)epicIter.next();

                List<JaxbStory> stories = new ArrayList<JaxbStory>();

                Iterator<JiraDataInterface> storyIter = epic.getIterator();
                while(storyIter.hasNext()) {
                    JiraData story = (JiraData)storyIter.next();

                    List<JaxbIssue> subtasks = new ArrayList<JaxbIssue>();

                    Iterator<JiraDataInterface> subtaskIter = story.getIterator();
                    while(subtaskIter.hasNext()) {
                        IssueData subtask = (IssueData)subtaskIter.next();
                        JaxbIssue jaxbIssue = JaxbFactory.newJaxbIssue(subtask);
                        subtasks.add(jaxbIssue);
                    }

                    JaxbStory jaxbStory = JaxbFactory.newJaxbStory((StoryData)story.getData(), story.getTimestamp(), subtasks);
                    stories.add(jaxbStory);
                }

                JaxbEpic jaxbEpic = JaxbFactory.newJaxbEpic((EpicData)epic.getData(), epic.getTimestamp(), stories);
                epics.add(jaxbEpic);
            }

            JaxbProject jaxbProject = JaxbFactory.newJaxbProject((ProjectData)project.getData(), project.getTimestamp(), epics);
            projects.add(jaxbProject);
        }

        return projects;
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
        System.out.println(query);
        return Response.ok().build();
    }

    /**
     * Event listening testing
     *
     * @param issueEvent
     */
    @EventListener
    public void issueEventListener(IssueEvent issueEvent) {
    }
}