package ut.com.cobalt.jira.plugin.epic.rest.jaxb;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;
import com.atlassian.jira.issue.issuetype.IssueType;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbEpic;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbFactory;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbIssue;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;


public class JaxbIssuesTest
{
	private static final String ISSUE_DESCRIPTION = "Test issue description";
	private static final String ISSUE_KEY = "TP-1";
	private static final long ISSUE_ID = 100000l;
	private static final String ISSUE_NAME = "Test Epic";

	private Issue issue;

	@Before
	public void setup() {
		CustomField customField = mock(CustomField.class);

		CustomFieldManager customFieldManager = mock(CustomFieldManager.class);
		when(customFieldManager.getCustomFieldObjectByName(anyString())).thenReturn(customField);

		MockComponentWorker worker = new MockComponentWorker();
		worker.addMock(CustomFieldManager.class, customFieldManager);
		worker.init();

		IssueType issueType = mock(IssueType.class);
		when(issueType.getName()).thenReturn("Epic");

		issue = mock(Issue.class);
		when(issue.getSummary()).thenReturn(ISSUE_DESCRIPTION);
		when(issue.getKey()).thenReturn(ISSUE_KEY);
		when(issue.getId()).thenReturn(ISSUE_ID);
		when(issue.getCustomFieldValue(customField)).thenReturn(ISSUE_NAME);
		when(issue.getIssueTypeObject()).thenReturn(issueType);
	}

    @Ignore
	@Test
	public void jaxbIssueIsValid() {
		/*JaxbIssue jaxbIssue = newJaxbIssue(issue);

		assertEquals(ISSUE_DESCRIPTION, jaxbIssue.getDescription());
		assertEquals(ISSUE_KEY, jaxbIssue.getKey());
		assertEquals(ISSUE_ID, jaxbIssue.getId());*/
	}

    @Ignore
	@Test
	public void jaxbEpicIsValid() {
		/*JaxbEpic jaxbEpic = JaxbFactory.newJaxbEpic();

		assertEquals(ISSUE_DESCRIPTION, jaxbEpic.getDescription());
		assertEquals(ISSUE_KEY, jaxbEpic.getKey());
		assertEquals(ISSUE_ID, jaxbEpic.getId());

		assertEquals(ISSUE_NAME, jaxbEpic.getName());*/
	}
}
