package ut.com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.action.issue.customfields.MockCustomFieldType;
import com.atlassian.jira.avatar.Avatar;
import com.atlassian.jira.avatar.AvatarService;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.changehistory.ChangeHistory;
import com.atlassian.jira.issue.changehistory.ChangeHistoryManager;
import com.atlassian.jira.issue.fields.MockCustomField;
import com.atlassian.jira.issue.history.ChangeItemBean;
import com.atlassian.jira.issue.status.MockStatus;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.mock.issue.MockIssue;
import com.atlassian.jira.project.MockProject;
import com.atlassian.jira.project.ProjectCategory;
import com.atlassian.jira.user.MockUser;
import com.cobalt.jira.plugin.epic.data.*;
import org.junit.Before;
import org.junit.Test;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class JiraDataTest {
    private static final String ISSUE_NAME = "TEST ISSUE";
    private static final String ISSUE_KEY = "ISSUEKEY-1";
    private static final long ISSUE_ID = 10000l;
    private static final String ISSUE_DESCRIPTION = "TEST ISSUE DESCRIPTION";
    private static final Timestamp ISSUE_TIMESTAMP = new Timestamp(System.currentTimeMillis());
    private static final MockIssue ISSUE_EPIC = new MockIssue();

    private static final String PROJECT_NAME = "TEST PROJECT";
    private static final String PROJECT_KEY = "PROJECTKEY-1";
    private static final long PROJECT_ID = 10001;
    private static final String PROJECT_DESCRIPTION = "TEST PROJECT DESCRIPTION";

    private static final String USERNAME = "username";

    private MockIssue issue;
    private MockProject project, project2;
    private CustomFieldManager mockCustomFieldManager;

    private class MockJiraData extends JiraData {
        public JiraDataType getType() {
            return null;
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
            return false;
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

    public class MockProjectWithProjectCategory extends MockProject {
        public ProjectCategory getProjectCategoryObject() {
            return null;
        }
    }

    @Before
    public void setup() {
        ChangeHistoryManager changeHistoryManager = mock(ChangeHistoryManager.class);

        List<ChangeHistory> changeHistories = new ArrayList<ChangeHistory>();
        ChangeHistory changeHistory = mock(ChangeHistory.class);
        when(changeHistory.getTimePerformed()).thenReturn(ISSUE_TIMESTAMP);

        List<ChangeItemBean> cibs = new ArrayList<ChangeItemBean>();
        ChangeItemBean cib = new ChangeItemBean();
        cib.setField("status");
        cib.setFrom("Open");
        cib.setFromString("Open");
        cib.setTo("In Progress");
        cib.setToString("In Progress");
        cib.setFieldType(ChangeItemBean.STATIC_FIELD);
        cib.setCreated(ISSUE_TIMESTAMP);
        cibs.add(cib);

        cib = new ChangeItemBean();
        cib.setField("resolution");
        cib.setFrom("null");
        cib.setFromString("null");
        cib.setTo("Fixed");
        cib.setToString("Fixed");
        cib.setFieldType(ChangeItemBean.STATIC_FIELD);
        cib.setCreated(ISSUE_TIMESTAMP);

        cib = new ChangeItemBean();
        cib.setField("status");
        cib.setFrom("In Progress");
        cib.setFromString("In Progress");
        cib.setTo("Done");
        cib.setToString("Done");
        cib.setFieldType(ChangeItemBean.STATIC_FIELD);
        cib.setCreated(ISSUE_TIMESTAMP);

        when(changeHistory.getChangeItemBeans()).thenReturn(cibs);

        changeHistories.add(changeHistory);

        when(changeHistoryManager.getChangeHistories(any(Issue.class))).thenReturn(changeHistories);

        project = spy(new MockProjectWithProjectCategory());
        project.setName(PROJECT_NAME);
        project.setKey(PROJECT_KEY);
        project.setId(PROJECT_ID);
        project.setDescription(PROJECT_DESCRIPTION);

        project2 = spy(new MockProjectWithProjectCategory());
        project2.setName(PROJECT_NAME + 1);
        project2.setKey(PROJECT_KEY + 1);
        project2.setId(PROJECT_ID + 1);
        project2.setDescription(PROJECT_DESCRIPTION + 1);

        issue = spy(new MockIssue() {
            public Issue getParentObject() {
                return this;
            }
        });
        issue.setSummary(ISSUE_NAME);
        issue.setKey(ISSUE_KEY);
        issue.setId(ISSUE_ID);
        issue.setDescription(ISSUE_DESCRIPTION);
        issue.setUpdated(ISSUE_TIMESTAMP);
        issue.setProjectObject(project);
        doReturn(new MockStatus("6", "Done")).when(issue).getStatusObject();
        issue.setAssignee(new MockUser(USERNAME));

        AvatarService avatarService = mock(AvatarService.class);
        try {
            when(avatarService.getProjectAvatarURL(project, Avatar.Size.LARGE)).thenReturn(new URI("Test"));
        }
        catch(URISyntaxException e) {
            e.printStackTrace();
        }

        MockComponentWorker worker = new MockComponentWorker();
        mockCustomFieldManager = mock(CustomFieldManager.class);
        worker.addMock(CustomFieldManager.class, mockCustomFieldManager);
        worker.addMock(ChangeHistoryManager.class, changeHistoryManager);
        worker.addMock(AvatarService.class, avatarService);
        worker.init();
    }

    @Test
    public void jiraDataIsValid() {
        JiraData jiraData = new MockJiraData();
        assertEquals(0, jiraData.getUpdatedTimestamp());
        jiraData.setUpdatedTimestamp(-2);
        assertEquals(0, jiraData.getUpdatedTimestamp());
        jiraData.setUpdatedTimestamp(1000);
        assertEquals(1000, jiraData.getUpdatedTimestamp());

        assertEquals(0, jiraData.getDisplayTimestamp());
        jiraData.setDisplayTimestamp(-1);
        assertEquals(0, jiraData.getDisplayTimestamp());
        jiraData.setDisplayTimestamp(1000);
        assertEquals(1000, jiraData.getDisplayTimestamp());
        jiraData.remove();
        assertEquals(-1, jiraData.getDisplayTimestamp());

        JiraData jiraData1 = new MockJiraData();
        jiraData1.setUpdatedTimestamp(2000l);
        jiraData.update(jiraData1);
        assertEquals(2000l, jiraData.getUpdatedTimestamp());
    }

    @Test
    public void issueDataIsValid() {
        IssueData issueData = new IssueData(issue);

        assertEquals(JiraDataType.SUBTASK, issueData.getType());
        assertEquals(ISSUE_NAME, issueData.getName());
        assertEquals(ISSUE_KEY, issueData.getKey());
        assertEquals(ISSUE_ID, issueData.getId());
        assertEquals(ISSUE_DESCRIPTION, issueData.getDescription());
        assertEquals(ISSUE_TIMESTAMP.getTime(), issueData.getDisplayTimestamp());
        assertTrue(issueData.completed());
        assertEquals(USERNAME, issueData.getAssignee().getName());
        assertTrue(issueData.getProject() instanceof ProjectData);

        //test with no epic link
        assertTrue(issueData.getEpic() instanceof NullEpicData);

        //add the Epic Link custom field
        MockCustomField mockCustomField = new MockCustomField("Epic Link", "Epic Link", new MockCustomFieldType());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Link");
        doReturn(ISSUE_EPIC).when(issue).getCustomFieldValue(mockCustomField);

        assertTrue(issueData.getEpic() instanceof EpicData);
        assertTrue(issueData.getStory() instanceof StoryData);

        MockIssue issue = spy(new MockIssue() {
            public Issue getParentObject() {
                return this;
            }
        });
        issue.setSummary(ISSUE_NAME + 1);
        issue.setKey(ISSUE_KEY + 1);
        issue.setId(ISSUE_ID + 1);
        issue.setDescription(ISSUE_DESCRIPTION + 1);
        issue.setUpdated(ISSUE_TIMESTAMP);
        issue.setProjectObject(project);
        doReturn(new MockStatus("1", "Open")).when(issue).getStatusObject();
        issue.setAssignee(new MockUser(USERNAME + 1));
        issueData.update(new IssueData(issue));

        assertEquals(ISSUE_NAME + 1, issueData.getName());
        assertEquals(ISSUE_KEY + 1, issueData.getKey());
        assertEquals(ISSUE_ID + 1, issueData.getId());
        assertEquals(ISSUE_DESCRIPTION + 1, issueData.getDescription());
        assertFalse(issueData.completed());
        assertEquals(USERNAME + 1, issueData.getAssignee().getName());
    }

    @Test
    public void storyDataIsValid() {
        StoryData storyData = new StoryData(issue);

        assertEquals(JiraDataType.STORY, storyData.getType());

        //test with no epic link
        assertTrue(storyData.getEpic() instanceof NullEpicData);

        //add the Epic Link custom field
        MockCustomField mockCustomField = new MockCustomField("Epic Link", "Epic Link", new MockCustomFieldType());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Link");
        doReturn(ISSUE_EPIC).when(issue).getCustomFieldValue(mockCustomField);

        //test with the epic link
        assertTrue(storyData.getEpic() instanceof EpicData);
        assertEquals(storyData, storyData.getStory());
    }

    @Test
    public void epicDataIsValid() {
        EpicData epicData = new EpicData(issue);

        assertEquals(JiraDataType.EPIC, epicData.getType());

        //test with no Epic Name custom field
        assertEquals("No Name Epic", epicData.getName());

        //add the Epic Name custom field
        MockCustomField mockCustomField = new MockCustomField("Epic Name", "Epic Name", new MockCustomFieldType());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Name");
        doReturn(ISSUE_NAME).when(issue).getCustomFieldValue(mockCustomField);

        //test with Epic Name custom field
        assertEquals(ISSUE_NAME, epicData.getName());
        assertEquals(ISSUE_NAME, epicData.getDescription());
        assertEquals("#fdf4bb", epicData.getColor());
    }

    @Test
    public void nullEpicDataIsValid() {
        NullEpicData nullEpicData = new NullEpicData(ISSUE_NAME, ISSUE_DESCRIPTION);

        assertEquals(JiraDataType.EPIC, nullEpicData.getType());
        assertEquals(ISSUE_NAME, nullEpicData.getName());
        assertEquals(ISSUE_DESCRIPTION, nullEpicData.getDescription());
        assertEquals(-1, nullEpicData.getId());
        assertEquals("NOKEY", nullEpicData.getKey());
        assertFalse(nullEpicData.completed());
        assertNull(nullEpicData.getAssignee());
        assertNull(nullEpicData.getProject());
        assertEquals(nullEpicData.getEpic(), nullEpicData);
        assertNull(nullEpicData.getStory());
        assertEquals("#fdf4bb", nullEpicData.getColor());

        NullEpicData nullEpicData2 = new NullEpicData(ISSUE_NAME + 1, ISSUE_DESCRIPTION + 1);
        nullEpicData.update(nullEpicData2);

        assertEquals(ISSUE_NAME + 1, nullEpicData.getName());
        assertEquals(ISSUE_DESCRIPTION + 1, nullEpicData.getDescription());
    }

    @Test
    public void projectDataIsValid() {
        ProjectData projectData = new ProjectData(project);

        assertEquals(JiraDataType.PROJECT, projectData.getType());
        assertEquals(PROJECT_NAME, projectData.getName());
        assertEquals(PROJECT_KEY, projectData.getKey());
        assertEquals(PROJECT_ID, projectData.getId());
        assertEquals(PROJECT_DESCRIPTION, projectData.getDescription());
        assertFalse(projectData.completed());
        assertNull(projectData.getAssignee());
        assertEquals(projectData, projectData.getProject());
        assertNull(projectData.getEpic());
        assertNull(projectData.getStory());
        assertEquals("No Category", projectData.getGroup());
        assertEquals("Test", projectData.getProjectIcon());

        ProjectData projectData2 = new ProjectData(project2);
        projectData.update(projectData2);

        assertEquals(projectData2.getName(), projectData.getName());
        assertEquals(projectData2.getKey(), projectData.getKey());
        assertEquals(projectData2.getId(), projectData.getId());
        assertEquals(projectData2.getDescription(), projectData.getDescription());
    }
}
