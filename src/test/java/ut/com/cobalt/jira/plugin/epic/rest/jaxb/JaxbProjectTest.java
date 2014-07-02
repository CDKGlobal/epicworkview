package ut.com.cobalt.jira.plugin.epic.rest.jaxb;

import com.atlassian.crowd.model.user.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.issue.search.SearchResults;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;
import com.cobalt.jira.plugin.epic.data.ProjectData;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbEpic;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbFactory;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbProject;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.LinkedList;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;


public class JaxbProjectTest
{
	private static final String PROJECT_NAME = "TestProject";
	private static final String PROJECT_KEY = "TP";
	private static final long PROJECT_ID = 100000l;
	private static final String PROJECT_DESCRIPTION = "This is a test project";

	private Project project;
	private SearchService searchService;
	private User user;

	@Before
	public void setup() {
		MockComponentWorker worker = new MockComponentWorker();
		worker.init();
		ComponentAccessor.initialiseWorker(worker);

		project = mock(Project.class);
		when(project.getName()).thenReturn(PROJECT_NAME);
		when(project.getKey()).thenReturn(PROJECT_KEY);
		when(project.getId()).thenReturn(PROJECT_ID);
		when(project.getDescription()).thenReturn(PROJECT_DESCRIPTION);

		SearchResults searchResults = mock(SearchResults.class);
		when(searchResults.getIssues()).thenReturn(new ArrayList<Issue>());

		user = mock(User.class);

		searchService = mock(SearchService.class);
		try
		{
			when(searchService.search(eq(user), any(Query.class), any(PagerFilter.class))).thenReturn(searchResults);
		}
		catch(SearchException e)
		{
			fail();
		}
	}

	@Test
	public void jaxbProjectIsValid() {
		JaxbProject jaxbProject = JaxbFactory.newJaxbProject(new ProjectData(project), new LinkedList<JaxbEpic>());

		assertEquals(PROJECT_NAME, jaxbProject.getName());
		assertEquals(PROJECT_KEY, jaxbProject.getKey());
		assertEquals(PROJECT_ID, jaxbProject.getId());
		assertEquals(PROJECT_DESCRIPTION, jaxbProject.getDescription());
		assertEquals(0, jaxbProject.getEpics().size());
	}
}
