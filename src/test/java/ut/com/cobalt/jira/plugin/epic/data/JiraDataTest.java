package ut.com.cobalt.jira.plugin.epic.data;

import java.util.Iterator;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.atlassian.jira.action.issue.customfields.MockCustomFieldType;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.MockCustomField;
import com.atlassian.jira.issue.managers.MockCustomFieldManager;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.project.Project;
import com.cobalt.jira.plugin.epic.data.EpicData;
import com.cobalt.jira.plugin.epic.data.JiraData;
import com.cobalt.jira.plugin.epic.data.JiraDataInterface;
import com.cobalt.jira.plugin.epic.data.ProjectData;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;


public class JiraDataTest {
	
	private static final String PROJECT_NAME = "Test Project";
	private static final String PROJECT_KEY = "TP-1";
	private static final long PROJECT_ID = 10001;
	private static final String PROJECT_DESCRIPTION = "Test Project description";
	private static final long EPIC_TIME = 1;
	
	private Project project;
	private EpicData epic;
	private ProjectData pd;
	private JiraData jd;
	
	@Before
	public void setup() {
		project = mock(Project.class);
		when(project.getName()).thenReturn(PROJECT_NAME);
		when(project.getKey()).thenReturn(PROJECT_KEY);
		when(project.getId()).thenReturn(PROJECT_ID);
		when(project.getDescription()).thenReturn(PROJECT_DESCRIPTION);
		
		epic = mock(EpicData.class);
		when(epic.getTimestamp()).thenReturn(EPIC_TIME);
		
		pd = new ProjectData(project);
		
		jd = new JiraData(pd);
	}
	
	@Test
	public void testConstructorNotNull() {
		assertNotNull("constructor creates null object", jd);
	}
	
	@Test
	public void testName() {
		assertEquals("returns incorrect name", PROJECT_NAME, jd.getName());
	}
	
	@Test
	public void testKey() {
		assertEquals("returns incorrect key", PROJECT_KEY, jd.getKey());
	}
	
	@Test
	public void testId() {
		assertEquals("returns incorrect id", PROJECT_ID, jd.getId());
	}
	
	@Test
	public void testDescription() {
		assertEquals("returns incorrect description", PROJECT_DESCRIPTION, jd.getDescription());
	}
	
	@Test
	public void testData() {
		assertEquals("returns incorrect data", pd, jd.getData());
	}
	
	@Test
	public void testIteratorOnEmptyList() {
		Iterator<JiraDataInterface> iter = jd.getIterator();
		assertFalse("Iterator is not empty", iter.hasNext());
	}
	
	@Test
	public void addOneElementToList() {
		jd.addToList(epic);
		Iterator<JiraDataInterface> iter = jd.getIterator();
		assertTrue("Iterator is empty", iter.hasNext());
		iter.next();
		assertFalse("Iterator has more than one element", iter.hasNext());
	}
	
	@Test
	public void addTwoElementsToList() {
		addMultipleElementsToList(2);
	}
	
	@Test
	public void addManyElementsToList() {
		addMultipleElementsToList(100);
	}
	
	private void addMultipleElementsToList(int n) {
		for (int i = 0; i < n; i++) {
			jd.addToList(mock(EpicData.class));
		}
		Iterator<JiraDataInterface> iter = jd.getIterator();
		assertTrue("Iterator is empty", iter.hasNext());
		for (int i = 0; i < n; i++) {
			iter.next();
		}
		assertFalse("Iterator has too many elements", iter.hasNext());
	}
	
	@Test
	public void testTimeStampWithEmptyList() {
		assertEquals("Timestamp is not -1", -1, jd.getTimestamp());
	}
	
	@Test
	public void testTimeStampWithOneElement() {
		jd.addToList(epic);
		assertEquals("Timestamp is not element's timestamp", EPIC_TIME, jd.getTimestamp());
	}
	
	@Test
	public void testTimeStampWithLessRecentElement() {
		EpicData oldEpic = mock(EpicData.class);
		when(oldEpic.getTimestamp()).thenReturn((long) -2);
		jd.addToList(oldEpic);
		assertEquals("Timestamp is not most recent element", (long) -1, jd.getTimestamp());
	}
	
	@Test
	public void testToStringNotNull() {
		String toString = jd.toString();
		assertNotNull("ToString is null", toString);
	}
}
