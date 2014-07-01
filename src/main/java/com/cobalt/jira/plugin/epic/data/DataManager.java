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
    private static final String QUERY = "(status CHANGED FROM Open AFTER %s OR status CHANGED TO (Closed, Resolved) AFTER %s) AND issuetype not in (%s) ORDER BY updated DESC";
    private static final String DEFAULT_QUERY = String.format(QUERY, "-1w", "-1w", "Epic");

    private SearchService searchService;

    public DataManager(SearchService searchService) {
        this.searchService = searchService;
    }

    public List<JiraData<ProjectData, JiraData<EpicData, JiraData<StoryData, IssueData>>>> getProjects(User user) {
        //list of projects with references to epics
        List<JiraData<ProjectData, JiraData<EpicData, JiraData<StoryData, IssueData>>>> projects = new ArrayList<JiraData<ProjectData, JiraData<EpicData, JiraData<StoryData, IssueData>>>>();

        try {
            //get all issues that changed status (stories and subtasks)
            Query q = searchService.parseQuery(user, DEFAULT_QUERY).getQuery();
            List<Issue> issues = searchService.search(user, q, PagerFilter.getUnlimitedFilter()).getIssues();

            //get list of stories with subtasks
            List<JiraData<StoryData, IssueData>> stories = new ArrayList<JiraData<StoryData, IssueData>>();

            for(Issue i : issues) {
                if(i.isSubTask()) {
                    //get parent story and get the story data
                    Issue story = i.getParentObject();
                    JiraData<StoryData, IssueData> issueData = getData(stories.iterator(), story.getId());

                    //if the story data doesn't exist create the storydata
                    if(issueData == null) {
                        issueData = new JiraData<StoryData, IssueData>(new StoryData(story));
                        stories.add(issueData);
                    }
                    //add the sub task to the story
                    issueData.addToList(new IssueData(i));
                }
                else {
                    //if the story has subtasks and hasn't been stored add it to the list
                    JiraData<StoryData, IssueData> issueData = getData(stories.iterator(), i.getId());

                    if(issueData == null) {
                        issueData = new JiraData<StoryData, IssueData>(new StoryData(i));
                        stories.add(issueData);
                    }
                }
            }

            //from the stories create the projects and epics
            for(JiraData<StoryData, IssueData> jiraData : stories) {
                //get the epic and project
                Project p = jiraData.getData().getProject();
                Issue epic = jiraData.getData().getEpic();

                JiraData<ProjectData, JiraData<EpicData, JiraData<StoryData, IssueData>>> projectData = getData(projects.iterator(), p.getId());

                //create the project data if doesn't exist
                if(projectData == null) {
                    projectData = new JiraData<ProjectData, JiraData<EpicData, JiraData<StoryData, IssueData>>>(new ProjectData(p));
                    projects.add(projectData);
                }


                if(epic != null) {
                    //find the epic data
                    JiraData<EpicData, JiraData<StoryData, IssueData>> epicData = getData(projectData.getIterator(), epic.getId());

                    //create if it doesn't exist and add the story
                    if(epicData == null) {
                        epicData = new JiraData<EpicData, JiraData<StoryData, IssueData>>(new EpicData(epic));
                        epicData.addToList(jiraData);
                        projectData.addToList(epicData);
                    }
                    else {//just add the story if it exists
                        epicData.addToList(jiraData);
                    }
                }
                else {//story has no epic
                    //find if the project already has a null epic
                    JiraData<EpicData, JiraData<StoryData, IssueData>> epicData = getData(projectData.getIterator(), -1);

                    //create if it doesn't exist and add the story
                    if(epicData == null) {
                        epicData = new JiraData<EpicData, JiraData<StoryData, IssueData>>(new NullData("Other Stories", "Other Stories"));
                        epicData.addToList(jiraData);
                        projectData.addToList(epicData);
                    }
                    else {//just add the story if it exists
                        epicData.addToList(jiraData);
                    }
                }
            }
        }
        catch(SearchException e) {
            e.printStackTrace();
        }

        return projects;
    }

    private static <T extends JiraDataInterface, S extends JiraDataInterface> JiraData<T, S> getData(Iterator<JiraData<T, S>> iter, long id) {
        while(iter.hasNext()) {
            JiraData<T, S> j = iter.next();
            if(j.getId() == id) {
                return j;
            }
        }

        return null;
    }
}
