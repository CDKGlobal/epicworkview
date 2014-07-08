package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;

import java.util.List;

/**
 * A DataManager manages getting data out of the Jira database
 */
public class DataManager {
    //issues that has changed in the given time span excluding a list of given issues
    private static final String QUERY = "(status CHANGED FROM (Open, 'To Do') AFTER %s OR status CHANGED TO (Closed, Resolved, Done) AFTER %s) AND issuetype not in (%s) ORDER BY updated DESC";

    private SearchService searchService;

    /**
     * Constructs a new DataManager
     * 
     * @param searchService a Jira object for querying Jira
     */
    public DataManager(SearchService searchService) {
        this.searchService = searchService;
    }

    public List<IJiraData> getProjects(User user) {
        return getProjects(user, 7);
    }

    public List<IJiraData> getProjects(User user, int days) {
        String timePeriod = "-" + days + "d";
        return getProjectsFromQuery(user, String.format(QUERY, timePeriod, timePeriod, "Epic"));
    }

    /**
     * Get the projects from Jira according to the desired query.
     * Changing the global query variable will change which projects are retrieved.
     * Projects contain epics which contain stories which contain subtasks
     *
     * @param user the current user
     * @param query the query used to search for issues
     * @requires all issues have projects, all subtasks have stories
     * @return a list of projects, an empty list if there are none
     */
    private List<IJiraData> getProjectsFromQuery(User user, String query) {
    	assert(searchService != null);

        //get all issues that changed status (stories and subtasks)
        Query q = searchService.parseQuery(user, query).getQuery();
        List<Issue> issues;
        try {
            issues = searchService.search(user, q, PagerFilter.getUnlimitedFilter()).getIssues();
        }
        catch(SearchException e) {
            e.printStackTrace();
            return null;
        }

        NaryTree tree = new NaryTree();

        for(Issue i : issues) {
            IJiraData data;

            if(i.isSubTask()) {
                data = new IssueData(i);
            }
            else {
                data = new StoryData(i);
            }
            tree.insert(data);
        }

        return tree.getPreOrder();
    }
}
