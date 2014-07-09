package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.changehistory.ChangeHistory;
import com.atlassian.jira.issue.history.ChangeItemBean;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;

import java.util.*;


/**
 * A DataManager manages getting data out of the Jira database
 */
public class DataManager {
    //issues that has changed in the given time span excluding a list of given issues
    private static final String QUERY = "(status CHANGED FROM (Open, 'To Do') AFTER %s OR status CHANGED TO (Closed, Resolved, Done) AFTER %s) AND issuetype not in (%s) ORDER BY updated DESC";
    private static final String DEFAULT_QUERY = String.format(QUERY, "-14d", "-14d", "Epic");

    private NaryTree tree;
    private ProjectService projectService;

    public static StringBuilder DebugLog = new StringBuilder("Log Start:\r\n");

    /**
     * Constructs a new DataManager
     * 
     */
    public DataManager(ProjectService projectService) {
        this.projectService = projectService;
    }

    public void init(SearchService searchService, UserUtil userUtil) {
        User admin = null;
        Collection<User> admins = userUtil.getJiraSystemAdministrators();
        Iterator<User> iter = admins.iterator();
        if(iter.hasNext())
            admin = iter.next();

        tree = new NaryTree();

        List<Issue> issues = null;
        try {
            Query q = searchService.parseQuery(admin, DEFAULT_QUERY).getQuery();
            issues = searchService.search(admin, q, PagerFilter.getUnlimitedFilter()).getIssues();
        }
        catch(SearchException e) {
            e.printStackTrace();
        }

        tree = new NaryTree();

        for(Issue i : issues) {
            insertIssue(i);
        }
    }

    public void destroy() {
        tree = null;
    }

    public List<IJiraData> getProjects(User user) {
        return getProjects(user, 7 * 24 * 60 * 60);//get project in the last 7 days
    }

    /**
     * Get the projects from Jira according to the desired query.
     * Changing the global query variable will change which projects are retrieved.
     * Projects contain epics which contain stories which contain subtasks
     *
     * @param user the current user
     * @requires all issues have projects, all subtasks have stories
     * @return a list of projects, an empty list if there are none
     */
    public List<IJiraData> getProjects(User user, int seconds) {
        if(tree == null)
            return new ArrayList<IJiraData>();

        //loop and get stuff the user can see and happen in the last x seconds
        List<IJiraData> issues = tree.getPreOrder();

        List<Project> projects = projectService.getAllProjects(user).getReturnedValue();
        HashSet<Long> projectIds = new HashSet<Long>();
        for(Project p : projects) {
            projectIds.add(p.getId());
        }

        boolean remove = false;
        long time = System.currentTimeMillis() - seconds * 1000;

        Iterator<IJiraData> iter = issues.iterator();
        while(iter.hasNext()) {
            IJiraData ijd = iter.next();

            if(ijd.getType() == IJiraData.DataType.PROJECT) {
                remove = !projectIds.contains(ijd.getId());
            }

            if(remove || ijd.getTimestamp() < time) {
                iter.remove();
            }
        }

        return issues;
    }

    public void newIssueEvent(IssueEvent issueEvent) {
        Issue issue = issueEvent.getIssue();
        List<ChangeHistory> histories = ComponentAccessor.getChangeHistoryManager().getChangeHistories(issue);

        if(histories.size() > 0) {
            ChangeHistory changeHistory = histories.get(histories.size() - 1);

            List<ChangeItemBean> cibs = changeHistory.getChangeItemBeans();

            ChangeItemBean cib = cibs.get(cibs.size() - 1);
            System.out.println("Most Recent From: " + cib.getFromString());
            System.out.println("Most Recent From: " + cib.getToString());

            if((cib.getFromString() == null || cib.getToString() == null) && cibs.size() > 1) {
                cib = cibs.get(cibs.size() - 2);
                System.out.println("Second Recent From: " + cib.getFromString());
                System.out.println("Second Recent From: " + cib.getToString());
            }

            boolean insert = false;

            String s = cib.getFromString();
            if(s != null && s.equals("Open")) {
                insert = true;
            }

            String s1 = cib.getToString();
            if(s1 != null && (s1.equals("Closed") || s1.equals("Resolved"))) {
                insert = true;
            }

            if(insert) {
                insertIssue(issue);
            }
        }
    }

    private void insertIssue(Issue issue) {
        IJiraData data;

        if(issue.isSubTask()) {
            data = new IssueData(issue);
        }
        else {
            data = new StoryData(issue);
        }
        tree.insert(data);
    }
}
