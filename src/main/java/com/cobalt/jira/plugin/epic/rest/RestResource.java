package com.cobalt.jira.plugin.epic.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.event.api.EventListener;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.event.ProjectUpdatedEvent;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.DataManager;
import com.cobalt.jira.plugin.epic.data.IJiraData;
import com.cobalt.jira.plugin.epic.data.JiraDataType;
import com.cobalt.jira.plugin.epic.rest.jaxb.*;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

import javax.annotation.PreDestroy;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;


/**
 * Entry point for REST calls for projects
 */
@Path("/")
public class RestResource {
    private UserManager userManager;
    private com.atlassian.jira.user.util.UserManager jiraUserManager;
    private DataManager dataManager;

    /**
     * Rest resource that use dependency injection to get necessary components
     *
     * @param userManager     - used to get the current user from the browser session
     * @param jiraUserManager - used to get the user in jira from the remote user
     */
    public RestResource(UserManager userManager,
                        com.atlassian.jira.user.util.UserManager jiraUserManager,
                        DataManager dataManager) {
        this.userManager = userManager;
        this.jiraUserManager = jiraUserManager;
        this.dataManager = dataManager;
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

        //get all project with epics
        List<IJiraData> preOrder = dataManager.getProjects(getCurrentUser(), seconds);

        while(preOrder.size() > 0) {
            buildJaxb(preOrder, projects);
        }

        return projects;
    }

    /**
     * Recursively builds up the jaxb data to send to the client
     *
     * @param input  list of issue to turn into jaxb
     * @param output list holding the output jaxb objects
     */
    @SuppressWarnings("unchecked")
    private <T extends JaxbIssue> void buildJaxb(List<IJiraData> input, List<T> output) {
        //if there are no more issues to convert
        if(input.size() == 0) {
            return;
        }

        IJiraData data = input.get(0);
        input.remove(0);

        //if were down to subtasks build the jaxb and return it
        if(data.getType() == JiraDataType.SUBTASK) {
            output.add((T) JaxbFactory.newJaxbIssue(data));
        }
        else {
            //make a new list to build up based on our current data type
            List temp;
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
                return;//should never get here
            }

            //while the next element is a subtype of data
            while(input.size() > 0 && input.get(0).getType().compareTo(data.getType()) > 0) {
                buildJaxb(input, temp);
            }

            //after build up all the sub types into a list create a new jaxb object of the current type
            switch(data.getType()) {
            case PROJECT:
                output.add((T) JaxbFactory.newJaxbProject(data, temp));
                break;
            case EPIC:
                output.add((T) JaxbFactory.newJaxbEpic(data, temp));
                break;
            case STORY:
                output.add((T) JaxbFactory.newJaxbStory(data, temp));
                break;
            default:
                return;//should never get here
            }
        }
    }
}