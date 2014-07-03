package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * A DataManager manages getting data out of the Jira database
 */
public class DataManager {
    //issues that has changed in the given time span excluding a list of given issues
    private static final String QUERY = "(status CHANGED FROM (Open, 'To Do') AFTER %s OR status CHANGED TO (Closed, Resolved, Done) AFTER %s) AND issuetype not in (%s) ORDER BY updated DESC";
    private static final String DEFAULT_QUERY = String.format(QUERY, "-2w", "-2w", "Epic");

    private SearchService searchService;

    /**
     * Constructs a new DataManager
     * 
     * @param searchService a Jira object for querying Jira
     */
    public DataManager(SearchService searchService) {
        this.searchService = searchService;
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
    public List<JiraData> getProjects(User user) {
    	assert(searchService != null);
    	
        //list of projects
        List<JiraData> projects = new ArrayList<JiraData>();

        try {
            //get all issues that changed status (stories and subtasks)
            Query q = searchService.parseQuery(user, DEFAULT_QUERY).getQuery();
            List<Issue> issues = searchService.search(user, q, PagerFilter.getUnlimitedFilter()).getIssues();

            //list of stories
            List<JiraData> stories = new ArrayList<JiraData>();

            //loop through all issues
            for(Issue i : issues) {
                Issue helper = null, story;
                if(i.isSubTask()) {
                    //this issue is a subtask, get parent story
                    story = i.getParentObject();
                    helper = i;
                }
                else {
                	//this issue is a story
                    story = i;
                }

                //get the story if it is in the list of stories
                JiraData issueData = (JiraData)getData(stories.iterator(), story.getId());

                //if the story is not in the list already, create it and add it
                if(issueData == null) {
                    issueData = new JiraData(new StoryData(story));
                    stories.add(issueData);
                }

                //if the subtask does not exist yet, create it and add it to the story
                if(helper != null) {
                    issueData.addToList(new IssueData(i));
                }
            }

            //loop through all stories
            for(JiraData storyData : stories) {
                //get the epic and project of the story
                Project p = ((StoryData)storyData.getData()).getProject();
                Issue epic = ((StoryData)storyData.getData()).getEpic();

                //get the project if it is in the list of projects
                JiraData projectData = (JiraData)getData(projects.iterator(), p.getId());

                //if the project is not in the list already, create it and add it
                if(projectData == null) {
                    projectData = new JiraData(new ProjectData(p));
                    projects.add(projectData);
                }

                //adding an epic to a project
                JiraData epicData;

                //get the id for the epic
                long id = -1;
                if(epic != null) {
                    id = epic.getId();
                }

                //get the epicdata if it already exist
                epicData = (JiraData)getData(projectData.getIterator(), id);

                //create a new epicdata if it doesn't
                if(epicData == null) {
                    //if the story has no epic create a fake epic
                    if(id == -1) {
                        epicData = new JiraData(new NullData("Other Stories", "Other Stories"));
                    }
                    else { //otherwise make a new epic
                        epicData = new JiraData(new EpicData(epic));
                    }

                    //add the epic to the project
                    projectData.addToList(epicData);
                }

                //add the story to the epic
                epicData.addToList(storyData);
            }
        }
        catch(SearchException e) {
            e.printStackTrace();
        }

        return projects;
    }

    /*
     * Loops through the given iterator searching for an element with the given id. 
     * Returns an element with the given id if it exists. 
     * Otherwise, returns null. 
     */
    private static <T extends JiraDataInterface> T getData(Iterator<T> iter, long id) {
        while(iter.hasNext()) {
            T j = iter.next();
            if(j.getId() == id) {
                return j;
            }
        }

        return null;
    }
}
