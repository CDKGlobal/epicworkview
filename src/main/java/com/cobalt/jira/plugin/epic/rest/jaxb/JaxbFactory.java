package com.cobalt.jira.plugin.epic.rest.jaxb;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.avatar.Avatar;
import com.atlassian.jira.avatar.AvatarService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.user.ApplicationUser;
import com.cobalt.jira.plugin.epic.data.IEpicData;
import com.cobalt.jira.plugin.epic.data.IJiraData;
import com.cobalt.jira.plugin.epic.data.IProjectData;

import java.util.List;


public class JaxbFactory {
    private JaxbFactory() {
    }

    public static JaxbProject newJaxbProject(IJiraData p, List<? extends JaxbIssue> epics) {
        String category = "No Category";
        String icon = "";
        if(p instanceof IProjectData) {
            category = ((IProjectData)p).getGroup();
            icon = ((IProjectData)p).getProjectIcon();
        }
        long timestamp = p.getDisplayTimestamp();
        return newJaxbProject(p.getName(), p.getKey(), p.getId(), p.getDescription(), timestamp, newJaxbUser(p.getAssignee(), timestamp), category, icon, epics);
    }

    public static JaxbProject newJaxbProject(String name, String key, long id, String description, long timestamp, JaxbUser assignee, String category, String icon, List<? extends JaxbIssue> epics) {
        JaxbProject jaxbProject = new JaxbProject();
        setData(jaxbProject, name, key, id, description, timestamp, assignee);
        jaxbProject.children = epics;
        jaxbProject.group = category;
        jaxbProject.icon = icon;
        return jaxbProject;
    }

    public static JaxbEpic newJaxbEpic(IJiraData e, List<? extends JaxbIssue> stories) {
        String color = "#fdf4bb";
        if(e instanceof IEpicData) {
            color = ((IEpicData)e).getColor();
        }
        long timestamp = e.getDisplayTimestamp();
        return newJaxbEpic(e.getName(), e.getKey(), e.getId(), e.getDescription(), timestamp, newJaxbUser(e.getAssignee(), timestamp), color, stories);
    }

    public static JaxbEpic newJaxbEpic(String name, String key, long id, String description, long timestamp, JaxbUser assignee, String color, List<? extends JaxbIssue> stories) {
        JaxbEpic jaxbEpic = new JaxbEpic();
        setData(jaxbEpic, name, key, id, description, timestamp, assignee);
        jaxbEpic.children = stories;
        jaxbEpic.color = color;
        return jaxbEpic;
    }

    public static JaxbStory newJaxbStory(IJiraData s, List<JaxbUser> contributors) {
        long timestamp = s.getDisplayTimestamp();
        return newJaxbStory(s.getName(), s.getKey(), s.getId(), s.getDescription(), timestamp, newJaxbUser(s.getAssignee(), timestamp), s.completed(), contributors);
    }

    public static JaxbStory newJaxbStory(String name, String key, long id, String description, long timestamp, JaxbUser assignee, boolean completed, List<JaxbUser> contributors) {
        JaxbStory jaxbStory = new JaxbStory();
        setData(jaxbStory, name, key, id, description, timestamp, assignee);
        jaxbStory.completed = completed;
        jaxbStory.contributors = contributors;
        return jaxbStory;
    }

    private static void setData(JaxbIssue issue, String name, String key, long id, String description, long timestamp, JaxbUser assignee) {
        issue.name = name;
        issue.key = key;
        issue.id = id;
        issue.description = description;
        issue.timestamp = timestamp;
        issue.contributor = assignee;
    }

    public static JaxbUser newJaxbUser(User assignee, long timestamp) {
        if(assignee == null){
            return null;
        }

        AvatarService avatarService = ComponentAccessor.getAvatarService();

        String key = ComponentAccessor.getUserKeyService().getKeyForUser(assignee);
        ApplicationUser appUser = ComponentAccessor.getUserManager().getUserByKey(key);
        String url = avatarService.getAvatarUrlNoPermCheck(appUser, Avatar.Size.LARGE).toString();

        return newJaxbUser(appUser.getKey(), appUser.getDisplayName(), url, timestamp);
    }

    public static JaxbUser newJaxbUser(String id, String name, String avatar, long timestamp) {
        JaxbUser jaxbUser = new JaxbUser();
        jaxbUser.id = id;
        jaxbUser.name = name;
        jaxbUser.avatar = avatar;
        jaxbUser.timestamp = timestamp;
        return jaxbUser;
    }
}
