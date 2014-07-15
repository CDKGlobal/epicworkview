package ut.com.cobalt.jira.plugin.epic.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.MockEventPublisher;
import com.atlassian.jira.avatar.Avatar;
import com.atlassian.jira.avatar.AvatarService;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.user.*;
import com.atlassian.jira.user.util.MockUserManager;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.*;
import com.cobalt.jira.plugin.epic.rest.RestResource;
import com.cobalt.jira.plugin.epic.rest.jaxb.*;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.Before;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;


public class RestResourceTest
{
    private static final String USERNAME = "USERNAME";

    private static final String USER_KEY = "testkey";
    private static final String USER_DISPLAY_NAME = "User, Test";
    private static final String USER_EMAIL = "test@test.com";
    private static final String USER_AVATAR_PATH = "MockAvatarURI";

	private SearchService searchService;
	private UserManager userManager;
	private com.atlassian.jira.user.util.UserManager jiraUserManager;
	private EventPublisher eventPublisher;
    private UserUtil userUtil;
    private ProjectService projectService;
    private AvatarService avatarService;

    private int count = 0;

    private List<IJiraData> projects;

    private MockUser mockUser;

    private class MockJiraData extends JiraData {
        private JiraDataType type;

        public MockJiraData(JiraDataType type) {
            this.type = type;
        }

        public JiraDataType getType() {
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

        public boolean completed() {
            return true;
        }

        public User getAssignee() {
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

        jiraUserManager = spy(new MockUserManager());
        projectService = mock(ProjectService.class);
        avatarService = mock(AvatarService.class);

        URI mockUri = URI.create(USER_AVATAR_PATH);

        when(avatarService.getAvatarUrlNoPermCheck(any(ApplicationUser.class), eq(Avatar.Size.LARGE))).thenReturn(mockUri);

        UserKeyService mockUserKeyService = mock(UserKeyService.class);

        MockComponentWorker worker = new MockComponentWorker();
        worker.addMock(UserKeyService.class, mockUserKeyService);
        worker.addMock(com.atlassian.jira.user.util.UserManager.class, jiraUserManager);
        worker.addMock(AvatarService.class, avatarService);
        worker.init();

        mockUser = new MockUser(USERNAME, USER_DISPLAY_NAME, USER_EMAIL);
        MockApplicationUser mockApplicationUser = new MockApplicationUser(USER_KEY, USERNAME, USER_DISPLAY_NAME, USER_EMAIL);

        when(mockUserKeyService.getKeyForUser(any(User.class))).thenReturn(USER_KEY);
        when(jiraUserManager.getUserByKey(anyString())).thenReturn(mockApplicationUser);

        IJiraData subtask = new MockJiraData(JiraDataType.SUBTASK) {
            public User getAssignee() {
                return mockUser;
            }
        };
        IJiraData story = new MockJiraData(JiraDataType.STORY);
        IJiraData epic = new MockJiraData(JiraDataType.EPIC);
        IJiraData project = new MockJiraData(JiraDataType.PROJECT);
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

        assertEquals(1, count);//make sure that afterPropertiesSet called one function of the eventPublisher
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
