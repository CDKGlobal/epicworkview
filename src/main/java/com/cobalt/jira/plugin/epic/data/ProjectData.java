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

    @Override
    public DataType getType() {
        return DataType.PROJECT;
    }

    /**
     * Returns the name of the project
     * 
     * @return the name of the project
     */
    public String getName() {
        return project.getName();
    }

    /**
     * Returns the key of the project
     * 
     * @return the key of the project
     */
    public String getKey() {
        return project.getKey();
    }

    /**
     * Returns the id of the project
     * 
     * @return the id of the project
     */
    public long getId() {
        return project.getId();
    }

    /**
     * Returns the description of the project
     * 
     * @return the description of the project
     */
    public String getDescription() {
        return project.getDescription();
    }

    public boolean completed() {
        return false;
    }

    public User getAssignee() {
        return null;
    }

    public IJiraData getProject() {
        return this;
    }

    public IJiraData getEpic() {
        return null;
    }

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
