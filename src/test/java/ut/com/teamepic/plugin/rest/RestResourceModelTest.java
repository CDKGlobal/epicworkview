package ut.com.teamepic.plugin.rest;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

import com.atlassian.crowd.model.user.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.project.Project;
import com.teamepic.plugin.rest.RestProjectResourceModel;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;


public class RestResourceModelTest
{
	private List<Project> projects;
	private SearchService searchService;
	private User user;

	@Before
	public void setup() {
		user = mock(User.class);
		searchService = mock(SearchService.class);
		projects = new ArrayList<Project>();
	}

	@Test
	public void RestResourceModelIsValid() {
		RestProjectResourceModel restProjectResourceModel = new RestProjectResourceModel(projects, searchService, user);

		assertEquals(0, restProjectResourceModel.getJaxbProjects().length);
	}
}
