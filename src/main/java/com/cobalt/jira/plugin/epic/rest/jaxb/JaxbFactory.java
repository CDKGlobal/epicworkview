package com.cobalt.jira.plugin.epic.rest.jaxb;

import com.cobalt.jira.plugin.epic.data.EpicData;
import com.cobalt.jira.plugin.epic.data.IssueData;
import com.cobalt.jira.plugin.epic.data.ProjectData;
import com.cobalt.jira.plugin.epic.data.StoryData;

import java.util.List;


public class JaxbFactory {
    public static JaxbProject newJaxbProject(ProjectData p, long timestamp, List<JaxbEpic> epics) {
        return newJaxbProject(p.getName(), p.getKey(), p.getId(), p.getDescription(), timestamp, epics);
    }

    public static JaxbProject newJaxbProject(String name, String key, long id, String description, long timestamp, List<JaxbEpic> epics) {
        JaxbProject jaxbProject = new JaxbProject();
        setData(jaxbProject, name, key, id, description, timestamp);
        jaxbProject.epics = epics;
        return jaxbProject;
    }

    public static JaxbEpic newJaxbEpic(EpicData e, long timestamp, List<JaxbStory> stories) {
        return newJaxbEpic(e.getName(), e.getKey(), e.getId(), e.getDescription(), timestamp, stories);
    }

    public static JaxbEpic newJaxbEpic(String name, String key, long id, String description, long timestamp, List<JaxbStory> stories) {
        JaxbEpic jaxbEpic = new JaxbEpic();
        setData(jaxbEpic, name, key, id, description, timestamp);
        jaxbEpic.stories = stories;
        return jaxbEpic;
    }

    public static JaxbStory newJaxbStory(StoryData s, long timestamp, List<JaxbIssue> subtasks) {
        return newJaxbStory(s.getName(), s.getKey(), s.getId(), s.getDescription(), timestamp, subtasks);
    }

    public static JaxbStory newJaxbStory(String name, String key, long id, String description, long timestamp, List<JaxbIssue> subtasks) {
        JaxbStory jaxbStory = new JaxbStory();
        setData(jaxbStory, name, key, id, description, timestamp);
        jaxbStory.subtasks = subtasks;
        return jaxbStory;
    }

    public static JaxbIssue newJaxbIssue(IssueData i) {
        return newJaxbIssue(i.getName(), i.getKey(), i.getId(), i.getDescription(), i.getTimestamp());
    }

    public static JaxbIssue newJaxbIssue(String name, String key, long id, String description, long timestamp) {
        JaxbIssue jaxbIssue = new JaxbIssue();
        setData(jaxbIssue, name, key, id, description, timestamp);
        return jaxbIssue;
    }

    private static void setData(JaxbIssue issue, String name, String key, long id, String description, long timestamp) {
        issue.name = name;
        issue.key = key;
        issue.id = id;
        issue.description = description;
        issue.timestamp = timestamp;
    }
}
