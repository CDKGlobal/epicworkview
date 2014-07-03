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


public class DataManager {
    private static final String QUERY = "(status CHANGED FROM (Open, 'To Do') AFTER %s OR status CHANGED TO (Closed, Resolved, Done) AFTER %s) AND issuetype not in (%s) ORDER BY updated DESC";
    private static final String DEFAULT_QUERY = String.format(QUERY, "-1w", "-1w", "Epic");

    private SearchService searchService;

    public DataManager(SearchService searchService) {
        this.searchService = searchService;
    }

    public List<JiraData> getProjects(User user) {
        //list of projects with references to epics
        List<JiraData> projects = new ArrayList<JiraData>();

        try {
            //get all issues that changed status (stories and subtasks)
            Query q = searchService.parseQuery(user, DEFAULT_QUERY).getQuery();
            List<Issue> issues = searchService.search(user, q, PagerFilter.getUnlimitedFilter()).getIssues();

            //get list of stories with subtasks
            List<JiraData> stories = new ArrayList<JiraData>();

            for(Issue i : issues) {
                if(i.isSubTask()) {
                    //get parent story and get the story data
                    Issue story = i.getParentObject();
                    JiraData issueData = (JiraData)getData(stories.iterator(), story.getId());

                    //if the story data doesn't exist create the storydata
                    if(issueData == null) {
                        issueData = new JiraData(new StoryData(story));
                        stories.add(issueData);
                    }
                    //add the sub task to the story
                    issueData.addToList(new IssueData(i));
                }
                else {
                    //if the story has subtasks and hasn't been stored add it to the list
                    JiraData issueData = (JiraData)getData(stories.iterator(), i.getId());

                    if(issueData == null) {
                        issueData = new JiraData(new StoryData(i));
                        stories.add(issueData);
                    }
                }
            }

            //from the stories create the projects and epics
            for(JiraData storyData : stories) {
                //get the epic and project
                Project p = ((StoryData)storyData.getData()).getProject();
                Issue epic = ((StoryData)storyData.getData()).getEpic();

                JiraData projectData = (JiraData)getData(projects.iterator(), p.getId());

                //create the project data if doesn't exist
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

                //create a new epicdata if it doens't
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
