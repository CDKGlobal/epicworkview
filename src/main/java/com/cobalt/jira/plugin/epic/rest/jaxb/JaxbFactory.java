package com.cobalt.jira.plugin.epic.rest.jaxb;

import com.atlassian.crowd.embedded.api.User;
import com.cobalt.jira.plugin.epic.data.*;

import java.util.List;


public class JaxbFactory {
    private JaxbFactory() {
    }

    public static JaxbProject newJaxbProject(IJiraData p, List<JaxbEpic> epics, int completedStories, List<JaxbUser> contributers) {
        return newJaxbProject(p.getName(), p.getKey(), p.getId(), p.getDescription(), p.getTimestamp(), epics, completedStories, contributers);
    }

    public static JaxbProject newJaxbProject(String name, String key, long id, String description, long timestamp, List<JaxbEpic> epics, int completedStories, List<JaxbUser> contributers) {
        JaxbProject jaxbProject = new JaxbProject();
        setData(jaxbProject, name, key, id, description, timestamp);
        jaxbProject.epics = epics;
        jaxbProject.completedStories = completedStories;
        jaxbProject.contributers = contributers;
        return jaxbProject;
    }

    public static JaxbEpic newJaxbEpic(IJiraData e, List<JaxbStory> stories) {
        return newJaxbEpic(e.getName(), e.getKey(), e.getId(), e.getDescription(), e.getTimestamp(), stories);
    }

    public static JaxbEpic newJaxbEpic(String name, String key, long id, String description, long timestamp, List<JaxbStory> stories) {
        JaxbEpic jaxbEpic = new JaxbEpic();
        setData(jaxbEpic, name, key, id, description, timestamp);
        jaxbEpic.stories = stories;
        return jaxbEpic;
    }

    public static JaxbStory newJaxbStory(IJiraData s, List<JaxbIssue> subtasks) {
        return newJaxbStory(s.getName(), s.getKey(), s.getId(), s.getDescription(), s.getTimestamp(), subtasks);
    }

    public static JaxbStory newJaxbStory(String name, String key, long id, String description, long timestamp, List<JaxbIssue> subtasks) {
        JaxbStory jaxbStory = new JaxbStory();
        setData(jaxbStory, name, key, id, description, timestamp);
        jaxbStory.subtasks = subtasks;
        return jaxbStory;
    }

    public static JaxbIssue newJaxbIssue(IJiraData i) {
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

    public static JaxbUser newJaxbUser(String name, String avatar) {
        return newJaxbUser(name, avatar);
    }
}
