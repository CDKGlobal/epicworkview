package ut.com.cobalt.jira.plugin.epic.rest;

import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.MockEventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.user.MockApplicationUser;
import com.atlassian.jira.user.util.MockUserManager;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.*;
import com.cobalt.jira.plugin.epic.rest.RestResource;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbEpic;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbIssue;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbProject;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbStory;
import org.junit.Ignore;
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
    private UserUtil userUtil;
    private ProjectService projectService;

    private int count = 0;

    private List<IJiraData> projects;

    private class MockJiraData extends JiraData {
        private DataType type;

        public MockJiraData(DataType type) {
            this.type = type;
        }

        public DataType getType() {
            return type;
        }

        public String getName() {
            return null;
        }

        public String getDescription() {
            return null;
        }

        public long getId() {
            return 0;
        }

        public String getKey() {
            return null;
        }

        public IJiraData getProject() {
            return null;
        }

        public IJiraData getEpic() {
            return null;
        }

        public IJiraData getStory() {
            return null;
        }
    }


    @Before
    public void setup() {
		searchService = mock(SearchService.class);
		userManager = mock(UserManager.class);
        userUtil = mock(UserUtil.class);

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
        projectService = mock(ProjectService.class);

        IJiraData subtask = new MockJiraData(IJiraData.DataType.SUBTASK);
        IJiraData story = new MockJiraData(IJiraData.DataType.STORY);
        IJiraData epic = new MockJiraData(IJiraData.DataType.EPIC);
        IJiraData project = new MockJiraData(IJiraData.DataType.PROJECT);
        projects = new ArrayList<IJiraData>();
        projects.add(project);
        projects.add(epic);
        projects.add(story);
        projects.add(subtask);
    }

    @Test
    public void getProjectsisValid() {
        RestResource restResource = new RestResource(searchService, userManager, jiraUserManager, eventPublisher, userUtil, projectService);

        DataManager dataManager = mock(DataManager.class);
        when(dataManager.getProjects(null, 7)).thenReturn(new ArrayList<IJiraData>());
        restResource.setDataManager(dataManager);

        try {
            restResource.afterPropertiesSet();
        }
        catch(Exception e) {
            fail("RestResource threw an exception when afterPropertiesSet() was called");
        }

        assertEquals(2, count);//make sure that afterPropertiesSet called two functions of the eventPublisher
        count = 0; //reset count

        List<JaxbProject> jaxbProjects = restResource.getProjects(7);
        assertEquals(0, jaxbProjects.size());

        UserProfile userProfile = mock(UserProfile.class);
        when(userProfile.getUsername()).thenReturn(USERNAME);
        when(userManager.getRemoteUser()).thenReturn(userProfile);

        jaxbProjects = restResource.getProjects(7);
        assertEquals(0, jaxbProjects.size());

        MockApplicationUser mockApplicationUser = spy(new MockApplicationUser(USERNAME));
        ((MockUserManager)jiraUserManager).addUser(mockApplicationUser);
        when(dataManager.getProjects(mockApplicationUser.getDirectoryUser(), 7)).thenReturn(projects);

        jaxbProjects = restResource.getProjects(7);
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
