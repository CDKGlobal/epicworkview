package com.cobalt.jira.plugin.epic.rest.jaxb;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.avatar.Avatar;
import com.atlassian.jira.avatar.AvatarService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.user.ApplicationUser;
import com.cobalt.jira.plugin.epic.data.*;

import java.util.List;


public class JaxbFactory {
    private JaxbFactory() {
    }

    public static JaxbProject newJaxbProject(IJiraData p, List<JaxbEpic> epics) {
        return newJaxbProject(p.getName(), p.getKey(), p.getId(), p.getDescription(), p.getDisplayTimestamp(), newJaxbUser(p.getAssignee()), epics);
    }

    public static JaxbProject newJaxbProject(String name, String key, long id, String description, long timestamp, JaxbUser assignee, List<JaxbEpic> epics) {
        JaxbProject jaxbProject = new JaxbProject();
        setData(jaxbProject, name, key, id, description, timestamp, assignee);
        jaxbProject.epics = epics;
        return jaxbProject;
    }

    public static JaxbEpic newJaxbEpic(IJiraData e, List<JaxbStory> stories) {
        return newJaxbEpic(e.getName(), e.getKey(), e.getId(), e.getDescription(), e.getDisplayTimestamp(), newJaxbUser(e.getAssignee()), stories);
    }

    public static JaxbEpic newJaxbEpic(String name, String key, long id, String description, long timestamp, JaxbUser assignee, List<JaxbStory> stories) {
        JaxbEpic jaxbEpic = new JaxbEpic();
        setData(jaxbEpic, name, key, id, description, timestamp, assignee);
        jaxbEpic.stories = stories;
        return jaxbEpic;
    }

    public static JaxbStory newJaxbStory(IJiraData s, List<JaxbIssue> subtasks) {
        return newJaxbStory(s.getName(), s.getKey(), s.getId(), s.getDescription(), s.getDisplayTimestamp(), newJaxbUser(s.getAssignee()), s.completed(), subtasks);
    }

    public static JaxbStory newJaxbStory(String name, String key, long id, String description, long timestamp, JaxbUser assignee, boolean completed, List<JaxbIssue> subtasks) {
        JaxbStory jaxbStory = new JaxbStory();
        setData(jaxbStory, name, key, id, description, timestamp, assignee);
        jaxbStory.completed = completed;
        jaxbStory.subtasks = subtasks;
        return jaxbStory;
    }

    public static JaxbIssue newJaxbIssue(IJiraData i) {
        return newJaxbIssue(i.getName(), i.getKey(), i.getId(), i.getDescription(), i.getDisplayTimestamp(), newJaxbUser(i.getAssignee()));
    }

    public static JaxbIssue newJaxbIssue(String name, String key, long id, String description, long timestamp, JaxbUser assignee) {
        JaxbIssue jaxbIssue = new JaxbIssue();
        setData(jaxbIssue, name, key, id, description, timestamp, assignee);
        return jaxbIssue;
    }

    private static void setData(JaxbIssue issue, String name, String key, long id, String description, long timestamp, JaxbUser assignee) {
        issue.name = name;
        issue.key = key;
        issue.id = id;
        issue.description = description;
        issue.timestamp = timestamp;
        issue.contributor = assignee;
    }

    public static JaxbUser newJaxbUser(User assignee) {
        if(assignee == null){
            return null;
        }

        AvatarService avatarService = ComponentAccessor.getAvatarService();

        String key = ComponentAccessor.getUserKeyService().getKeyForUser(assignee);
        ApplicationUser appUser = ComponentAccessor.getUserManager().getUserByKey(key);
        String url = avatarService.getAvatarUrlNoPermCheck(appUser, Avatar.Size.LARGE).toString();

        return newJaxbUser(appUser.getKey(), appUser.getDisplayName(), url);
    }

    public static JaxbUser newJaxbUser(String id, String name, String avatar) {
        JaxbUser jaxbUser = new JaxbUser();
        jaxbUser.id = id;
        jaxbUser.name = name;
        jaxbUser.avatar = avatar;
        return jaxbUser;
    }
}
