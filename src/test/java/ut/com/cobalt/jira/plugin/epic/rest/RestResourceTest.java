package ut.com.cobalt.jira.plugin.epic.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.avatar.Avatar;
import com.atlassian.jira.avatar.AvatarService;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.user.*;
import com.atlassian.jira.user.util.MockUserManager;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.cobalt.jira.plugin.epic.data.*;
import com.cobalt.jira.plugin.epic.rest.RestResource;
import com.cobalt.jira.plugin.epic.rest.jaxb.*;
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

	private UserManager userManager;
	private com.atlassian.jira.user.util.UserManager jiraUserManager;
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
		userManager = mock(UserManager.class);

        jiraUserManager = spy(new MockUserManager());
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
        DataManager dataManager = mock(DataManager.class);
        when(dataManager.getProjects(null, 7l)).thenReturn(new ArrayList<IJiraData>());

        RestResource restResource = new RestResource(userManager, jiraUserManager, dataManager);


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

        List<? extends JaxbIssue> epics = jaxbProjects.get(0).getChildren();
        assertEquals(1, epics.size());
        List<? extends JaxbIssue> stories = epics.get(0).getChildren();
        assertEquals(1, stories.size());
        List<? extends JaxbIssue> subtasks = stories.get(0).getChildren();
        assertEquals(1, subtasks.size());
    }
}
