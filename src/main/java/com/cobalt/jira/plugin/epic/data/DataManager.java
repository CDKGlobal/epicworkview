package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.event.api.EventListener;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.event.ProjectUpdatedEvent;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.event.type.EventType;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;
import com.cobalt.jira.plugin.epic.data.util.StatusUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;

import java.util.*;


/**
 * A DataManager manages getting data out of the Jira database
 */
public class DataManager implements DisposableBean {
    private static final Logger logger = LoggerFactory.getLogger(DataManager.class);

    //issues that has changed in the given time span excluding a list of given issues
    private static final String QUERY = "(status CHANGED FROM (%s) AFTER %s OR status CHANGED TO (%s) AFTER %s) AND issuetype not in (%s) ORDER BY updated DESC";
    private static final long MAX_DAYS = 14;
    private static final String DEFAULT_QUERY = String.format(QUERY, StatusUtil.getInitialStates(), "-" + MAX_DAYS + "d", StatusUtil.getEndStates(), "-" + MAX_DAYS + "d", "Epic");

    private NaryTree tree;
    private ProjectService projectService;
    private SearchService searchService;
    private UserUtil userUtil;
    private EventPublisher eventPublisher;

    /**
     * Constructs a new DataManager
     * 
     */
    public DataManager(ProjectService projectService, SearchService searchService, UserUtil userUtil, EventPublisher eventPublisher) {
        this.projectService = projectService;
        this.searchService = searchService;
        this.userUtil = userUtil;
        this.eventPublisher = eventPublisher;

        logger.warn("*******************************************");
        logger.warn("Epic DataManager has finished constructing");
        logger.warn("*******************************************");
    }

    /**
     * Builds up the initial tree
     */
    public void afterPropertiesSet() {
        if(tree == null) {
            logger.warn("*******************************************");
            logger.warn("Epic is currently initializing");
            logger.warn("*******************************************");
            eventPublisher.register(this);
            
            //build the tree with what a user with full access would see

            //get an admin in jira
            User admin = null;
            Collection<User> admins = userUtil.getJiraSystemAdministrators();
            Iterator<User> iter = admins.iterator();
            if(iter.hasNext()) {
                admin = iter.next();
            }

            tree = new NaryTree();

            try {
                //search the database for issues to build up the initial tree
                Query q = searchService.parseQuery(admin, DEFAULT_QUERY).getQuery();
                List<Issue> issues = searchService.search(admin, q, PagerFilter.getUnlimitedFilter()).getIssues();

                for(Issue i : issues) {
                    tree.insert(getJiraDataIssue(i));
                }
            }
            catch(SearchException e) {
                e.printStackTrace();
            }
            logger.warn("*******************************************");
            logger.warn("Epic is done initializing");
            logger.warn("*******************************************");
        }
        else {
            logger.warn("*******************************************");
            logger.warn("Epic has already been initialized");
            logger.warn("*******************************************");
        }
    }

    /**
     * free up memory used by the DataManager
     */
    @Override
    public void destroy() {
        logger.warn("*******************************************");
        logger.warn("Epic is shutting down");
        logger.warn("*******************************************");

        eventPublisher.unregister(this);
        tree = null;

        logger.warn("*******************************************");
        logger.warn("Epic is shutdown");
        logger.warn("*******************************************");
    }

    /**
     * get all projects from jira that the given user can see in the last 7 days
     * This method is necessary as a default if no seconds are provided
     * 
     * @param user - user to prune the tree down
     * @return list of projects
     */
    public List<IJiraData> getProjects(User user) {
        return getProjects(user, 7 * 24 * 60 * 60);//get project in the last 7 days
    }

    /**
     * Get the projects from Jira according to the desired query.
     * Changing the global query variable will change which projects are retrieved.
     * Projects contain epics which contain stories which contain subtasks
     *
     * @param user the current user
     * @param seconds the number of seconds back to look for projects
     * @requires all issues have projects, all subtasks have stories
     * @return a list of projects, an empty list if there are none
     */
    public List<IJiraData> getProjects(User user, long seconds) {
        //if datamanager has yet to be initialized return an empty list
        if(tree == null)
            return new ArrayList<IJiraData>();

        tree.pruneOldData(MAX_DAYS * 24 * 60 * 60 * 1000);//remove all nodes older than MAX_DAYS

        //loop and get stuff the user can see and happen in the last x seconds
        List<IJiraData> issues = tree.getPreOrder();

        List<Project> projects = projectService.getAllProjects(user).getReturnedValue();
        HashSet<Long> projectIds = new HashSet<Long>();
        for(Project p : projects) {
            projectIds.add(p.getId());
        }

        boolean remove = false;
        long time = System.currentTimeMillis() - (seconds * 1000l);

        //for each issue
        Iterator<IJiraData> iter = issues.iterator();
        while(iter.hasNext()) {
            IJiraData ijd = iter.next();

            //if its a project and the user isn't allowed to view it set a flag
            if(ijd.getType() == JiraDataType.PROJECT) {
                remove = !projectIds.contains(ijd.getId());
            }

            //if the issue isn't allowed to be viewed or is to old remove it from the list
            if(remove || ijd.getUpdatedTimestamp() < time) {
                iter.remove();
            }
        }

        return issues;
    }

    /**
     * Event listener for when changes occur. 
     * Updates the tree accordingly
     * @param issueEvent the issue that triggered the listener
     */
    @EventListener
    public void newIssueEvent(IssueEvent issueEvent) {
        long eventId = issueEvent.getEventTypeId();
        Issue issue = issueEvent.getIssue();

        //if the datamanager has yet to be initialized
        if(tree == null) {
            return;
        }
        else if(eventId == EventType.ISSUE_DELETED_ID) {
            tree.remove(getJiraDataIssue(issue));
        }
        else if(eventId != EventType.ISSUE_CREATED_ID) {
            CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
            Object object = issue.getCustomFieldValue(manager.getCustomFieldObjectByName("Epic Name"));

            if(object != null) {
                tree.insert(new EpicData(issue));
            }
            else if(StatusUtil.hasBeenWorkedOn(issue)) {
                tree.insert(getJiraDataIssue(issue));
            }
        }
    }

    /**
     * insert the given issue into the tree
     * @param issue - issue to add
     */
    private IJiraData getJiraDataIssue(Issue issue) {
        return issue.isSubTask() ? new IssueData(issue) : new StoryData(issue);
    }

    /**
     * update a project in the tree if it is currently being stored otherwise it will do nothing
     * @param event - update event for the project
     */
    @EventListener
    public void newProjectUpdatedEvent(ProjectUpdatedEvent event) {
        if(tree != null) {
            tree.insert(new ProjectData(event.getProject(), event.getTime().getTime()));
        }
    }

    /**
     * Return the tree
     * @return the tree
     */
    public NaryTree getTree() {
        return tree;
    }
}
