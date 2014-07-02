package ut.com.cobalt.jira.plugin.epic.rest;

import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.MockEventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.user.MockApplicationUser;
import com.atlassian.jira.user.util.MockUserManager;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.DataManager;
import com.cobalt.jira.plugin.epic.data.JiraData;
import com.cobalt.jira.plugin.epic.data.JiraDataInterface;
import com.cobalt.jira.plugin.epic.rest.RestResource;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbEpic;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbIssue;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbProject;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbStory;
import org.junit.Test;
import org.junit.Before;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;


public class RestResourceTest
{
    private static final String USERNAME = "USERNAME";

	private SearchService searchService;
	private UserManager userManager;
	private com.atlassian.jira.user.util.UserManager jiraUserManager;
	private EventPublisher eventPublisher;

    private int count = 0;
    private List<JiraData> projects;

    private class MockJiraDataInterface implements JiraDataInterface {
        private long id;

        public MockJiraDataInterface(long id) {
            this.id = id;
        }

        @Override
        public String getName() {
            return "Mock " + id;
        }

        @Override
        public String getDescription() {
            return getName();
        }

        @Override
        public long getId() {
            return id;
        }

        @Override
        public String getKey() {
            return getName();
        }

        @Override
        public long getTimestamp() {
            return id;
        }
    }

    @Before
    public void setup() {
		searchService = mock(SearchService.class);
		userManager = mock(UserManager.class);

        eventPublisher = new MockEventPublisher() {
            public void register(Object o) {
                super.register(o);
                count++;
            }

            public void unregister(Object o) {
                super.unregister(o);
                count++;
            }
        };

        jiraUserManager = new MockUserManager();

        JiraDataInterface subtask = new MockJiraDataInterface(4l);
        JiraData story = new JiraData(new MockJiraDataInterface(3l));
        JiraData epic = new JiraData(new MockJiraDataInterface(2l));
        JiraData project = new JiraData(new MockJiraDataInterface(1l));
        story.addToList(subtask);
        epic.addToList(story);
        project.addToList(epic);
        projects = new ArrayList<JiraData>();
        projects.add(project);
    }

    @Test
    public void getProjectsisValid() {
        RestResource restResource = new RestResource(searchService, userManager, jiraUserManager, eventPublisher);

        try {
            restResource.afterPropertiesSet();
        }
        catch(Exception e) {
            fail("RestResource threw an exception when afterPropertiesSet() was called");
        }

        assertEquals(2, count);//make sure that afterPropertiesSet called two functions of the eventPublisher
        count = 0; //reset count

        DataManager dataManager = mock(DataManager.class);
        when(dataManager.getProjects(null)).thenReturn(new ArrayList<JiraData>());
        restResource.setDataManager(dataManager);

        List<JaxbProject> jaxbProjects = restResource.getProjects();
        assertEquals(0, jaxbProjects.size());

        UserProfile userProfile = mock(UserProfile.class);
        when(userProfile.getUsername()).thenReturn(USERNAME);
        when(userManager.getRemoteUser()).thenReturn(userProfile);

        jaxbProjects = restResource.getProjects();
        assertEquals(0, jaxbProjects.size());

        MockApplicationUser mockApplicationUser = spy(new MockApplicationUser(USERNAME));
        ((MockUserManager)jiraUserManager).addUser(mockApplicationUser);
        when(dataManager.getProjects(mockApplicationUser.getDirectoryUser())).thenReturn(projects);

        jaxbProjects = restResource.getProjects();
        assertEquals(1, jaxbProjects.size());
        List<JaxbEpic> epics = jaxbProjects.get(0).getEpics();
        assertEquals(1, epics.size());
        List<JaxbStory> stories = epics.get(0).getStories();
        assertEquals(1, stories.size());
        List<JaxbIssue> subtasks = stories.get(0).getSubtasks();
        assertEquals(1, subtasks.size());

        restResource.saveFilter("");
        restResource.issueEventListener(null);
        restResource.getFilters();

        try {
            restResource.destroy();
        }
        catch(Exception e) {
            fail("RestResource threw an exception when destroy() was called");
        }

        assertEquals(1, count);//make sure that destroy called one function of the eventPublisher
    }
}
