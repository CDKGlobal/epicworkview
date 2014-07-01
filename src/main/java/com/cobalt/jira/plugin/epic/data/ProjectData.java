package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.project.Project;

import java.util.Iterator;
import java.util.LinkedHashSet;


public class ProjectData  implements JiraDataInterface{
    private Project project;

    public ProjectData(Project project) {
        this.project = project;
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

    public long getTimestamp() {
        return -1;
    }
}
