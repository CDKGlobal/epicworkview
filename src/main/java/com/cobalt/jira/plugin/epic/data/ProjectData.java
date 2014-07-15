package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.project.Project;


/**
 * A ProjectData represents and manages a Jira Project
 */
public class ProjectData extends JiraData {
    private Project project;

    /**
     * Creates a new ProjectData
     * 
     * @param project the project to be created from
     */
    public ProjectData(Project project) {
        this.project = project;
    }

    public ProjectData(Project project, long updatedTime) {
        this(project);
        setUpdatedTimestamp(updatedTime);
    }

    public JiraDataType getType() {
        return JiraDataType.PROJECT;
    }

    public String getName() {
        return project.getName();
    }

    public String getKey() {
        return project.getKey();
    }

    public long getId() {
        return project.getId();
    }

    public String getDescription() {
        return project.getDescription();
    }

    /**
     * Projects are never completed
     * @return false
     */
    public boolean completed() {
        return false;
    }

    /**
     * Projects don't have a single assignee
     * This could be repurposed for the project lead if we ever want the information
     * @return null
     */
    public User getAssignee() {
        return null;
    }

    public IJiraData getProject() {
        return this;
    }

    /**
     * Projects don't have an epic
     * @return null
     */
    public IJiraData getEpic() {
        return null;
    }

    /**
     * Projects don't have an story
     * @return null
     */
    public IJiraData getStory() {
        return null;
    }

    public void update(IJiraData updatedIssue) {
        super.update(updatedIssue);

        if(updatedIssue instanceof ProjectData) {
            project = ((ProjectData)updatedIssue).project;
        }
    }
}
