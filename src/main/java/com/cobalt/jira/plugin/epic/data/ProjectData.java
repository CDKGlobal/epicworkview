package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.project.Project;

import java.util.Iterator;
import java.util.LinkedHashSet;

/**
 * A ProjectData represents and manages a Jira Project
 */
public class ProjectData  implements JiraDataInterface {
    private Project project;

    /**
     * Creates a new ProjectData
     * 
     * @param project the project to be created from
     */
    public ProjectData(Project project) {
        this.project = project;
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

    /**
     * Returns the last updated time of the project
     * This is -1 because projects do not have timestamps
     * 
     * @return the timestamp of the project
     */
    public long getTimestamp() {
        return -1;
    }
}
