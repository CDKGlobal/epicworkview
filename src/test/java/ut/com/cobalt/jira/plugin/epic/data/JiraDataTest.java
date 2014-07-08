package ut.com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.action.issue.customfields.MockCustomFieldType;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.MockCustomField;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.mock.issue.MockIssue;
import com.atlassian.jira.project.MockProject;
import com.cobalt.jira.plugin.epic.data.*;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.Timestamp;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
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

    private MockIssue issue;
    private MockProject project;
    private CustomFieldManager mockCustomFieldManager;

    @Before
    public void setup() {
        project = spy(new MockProject());
        project.setName(PROJECT_NAME);
        project.setKey(PROJECT_KEY);
        project.setId(PROJECT_ID);
        project.setDescription(PROJECT_DESCRIPTION);

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

        MockComponentWorker worker = new MockComponentWorker();
        mockCustomFieldManager = mock(CustomFieldManager.class);
        worker.addMock(CustomFieldManager.class, mockCustomFieldManager);
        worker.init();
    }

    @Test
    public void jiraDataIsValid() {
        JiraData jiraData = new JiraData() {
            public DataType getType() {
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

            public IJiraData getProject() {
                return null;
            }

            public IJiraData getEpic() {
                return null;
            }

            public IJiraData getStory() {
                return null;
            }
        };

        assertEquals(-1, jiraData.getTimestamp());
        jiraData.setTimestamp(-2);
        assertEquals(-1, jiraData.getTimestamp());
        jiraData.setTimestamp(1000);
        assertEquals(1000, jiraData.getTimestamp());
    }

    @Test
    public void issueDataIsValid() {
        IssueData issueData = new IssueData(issue);

        assertEquals(IJiraData.DataType.SUBTASK, issueData.getType());
        assertEquals(ISSUE_NAME, issueData.getName());
        assertEquals(ISSUE_KEY, issueData.getKey());
        assertEquals(ISSUE_ID, issueData.getId());
        assertEquals(ISSUE_DESCRIPTION, issueData.getDescription());
        assertEquals(ISSUE_TIMESTAMP.getTime(), issueData.getTimestamp());
        assertTrue(issueData.getProject() instanceof ProjectData);

        //test with no epic link
        assertTrue(issueData.getEpic() instanceof NullEpicData);

        //add the Epic Link custom field
        MockCustomField mockCustomField = new MockCustomField("Epic Link", "Epic Link", new MockCustomFieldType());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Link");
        doReturn(ISSUE_EPIC).when(issue).getCustomFieldValue(mockCustomField);

        assertTrue(issueData.getEpic() instanceof EpicData);
        assertTrue(issueData.getStory() instanceof StoryData);
    }

    @Test
    public void storyDataIsValid() {
        StoryData storyData = new StoryData(issue);

        assertEquals(IJiraData.DataType.STORY, storyData.getType());

        //test with no epic link
        assertTrue(storyData.getEpic() instanceof NullEpicData);

        //add the Epic Link custom field
        MockCustomField mockCustomField = new MockCustomField("Epic Link", "Epic Link", new MockCustomFieldType());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Link");
        doReturn(ISSUE_EPIC).when(issue).getCustomFieldValue(mockCustomField);

        //test with the epic link
        assertTrue(storyData.getEpic() instanceof EpicData);
    }

    @Test
    public void epicDataIsValid() {
        EpicData epicData = new EpicData(issue);

        assertEquals(IJiraData.DataType.EPIC, epicData.getType());

        //test with no Epic Name custom field
        assertEquals("No Name Epic", epicData.getName());

        //add the Epic Name custom field
        MockCustomField mockCustomField = new MockCustomField("Epic Name", "Epic Name", new MockCustomFieldType());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Name");
        doReturn(ISSUE_NAME).when(issue).getCustomFieldValue(mockCustomField);

        //test with Epic Name custom field
        assertEquals(ISSUE_NAME, epicData.getName());
        assertEquals(ISSUE_NAME, epicData.getDescription());
    }

    @Test
    public void nullEpicDataIsValid() {
        NullEpicData nullEpicData = new NullEpicData(ISSUE_NAME, ISSUE_DESCRIPTION);

        assertEquals(IJiraData.DataType.EPIC, nullEpicData.getType());
        assertEquals(ISSUE_NAME, nullEpicData.getName());
        assertEquals(ISSUE_DESCRIPTION, nullEpicData.getDescription());
        assertEquals(-1, nullEpicData.getId());
        assertEquals("NOKEY", nullEpicData.getKey());
        assertNull(nullEpicData.getProject());
        assertEquals(nullEpicData.getEpic(), nullEpicData);
        assertNull(nullEpicData.getStory());
    }

    @Test
    public void projectDataIsValid() {
        ProjectData projectData = new ProjectData(project);

        assertEquals(IJiraData.DataType.PROJECT, projectData.getType());
        assertEquals(PROJECT_NAME, projectData.getName());
        assertEquals(PROJECT_KEY, projectData.getKey());
        assertEquals(PROJECT_ID, projectData.getId());
        assertEquals(PROJECT_DESCRIPTION, projectData.getDescription());
        assertEquals(projectData, projectData.getProject());
        assertNull(projectData.getEpic());
        assertNull(projectData.getStory());
    }
}
