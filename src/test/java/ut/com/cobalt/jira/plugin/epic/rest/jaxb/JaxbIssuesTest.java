package ut.com.cobalt.jira.plugin.epic.rest.jaxb;

import static org.junit.Assert.*;

import com.cobalt.jira.plugin.epic.rest.jaxb.*;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;


public class JaxbIssuesTest
{
    private static final String ISSUE_NAME = "Test Name";
    private static final String ISSUE_KEY = "TP-1";
    private static final long ISSUE_ID = 100000l;
	private static final String ISSUE_DESCRIPTION = "Test issue description";
    private static final long ISSUE_TIMESTAMP = 1000l;

    private static final String USER_NAME = "test user";
    private static final String USER_AVATAR = "url";

	@Before
	public void setup() {
	}

	@Test
	public void jaxbIssueIsValid() {
		JaxbIssue jaxbIssue = JaxbFactory.newJaxbIssue(ISSUE_NAME, ISSUE_KEY, ISSUE_ID, ISSUE_DESCRIPTION, ISSUE_TIMESTAMP);

        assertEquals(ISSUE_NAME, jaxbIssue.getName());
        assertEquals(ISSUE_KEY, jaxbIssue.getKey());
        assertEquals(ISSUE_ID, jaxbIssue.getId());
        assertEquals(ISSUE_DESCRIPTION, jaxbIssue.getDescription());
        assertEquals(ISSUE_TIMESTAMP, jaxbIssue.getTimestamp());
	}

    @Test
    public void jaxbStoryIsValid() {
        JaxbStory jaxbStory = JaxbFactory.newJaxbStory(ISSUE_NAME, ISSUE_KEY, ISSUE_ID, ISSUE_DESCRIPTION, ISSUE_TIMESTAMP, true, new ArrayList<JaxbIssue>());

        assertTrue(jaxbStory.getCompleted());
        assertEquals(0, jaxbStory.getSubtasks().size());
    }

	@Test
	public void jaxbEpicIsValid() {
		JaxbEpic jaxbEpic = JaxbFactory.newJaxbEpic(ISSUE_NAME, ISSUE_KEY, ISSUE_ID, ISSUE_DESCRIPTION, ISSUE_TIMESTAMP, new ArrayList<JaxbStory>());

        assertEquals(0, jaxbEpic.getStories().size());
	}

    @Test
    public void jaxbProjectIsValid() {
        JaxbProject jaxbProject = JaxbFactory.newJaxbProject(ISSUE_NAME, ISSUE_KEY, ISSUE_ID, ISSUE_DESCRIPTION, ISSUE_TIMESTAMP, new ArrayList<JaxbEpic>(), new ArrayList<JaxbUser>());

        assertEquals(0, jaxbProject.getEpics().size());
        assertEquals(0, jaxbProject.getContributors().size());
    }

    @Test
    public void jaxbUserIsValid() {
        JaxbUser jaxbUser = JaxbFactory.newJaxbUser("KEY", USER_NAME, USER_AVATAR, 1l);

        assertEquals("KEY", jaxbUser.getId());
        assertEquals(USER_NAME, jaxbUser.getName());
        assertEquals(USER_AVATAR, jaxbUser.getAvatar());
        assertEquals(1l, jaxbUser.getTimestamp());

        JaxbUser jaxbUser1 = JaxbFactory.newJaxbUser("KEY", USER_NAME, USER_AVATAR, 1l);
        JaxbUser jaxbUser2 = JaxbFactory.newJaxbUser("KEY1", USER_NAME, USER_AVATAR, 1l);
        Object object = new Object();

        assertTrue(jaxbUser.equals(jaxbUser));
        assertFalse(jaxbUser.equals(object));
        assertTrue(jaxbUser.equals(jaxbUser1));
        assertFalse(jaxbUser.equals(jaxbUser2));
        assertEquals("KEY".hashCode(), jaxbUser.hashCode());
    }
}
