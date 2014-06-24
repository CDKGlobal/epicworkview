package ut.com.teamepic.plugin.rest;

import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.sal.api.user.UserManager;
import com.teamepic.plugin.rest.RestProject;
import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import static org.junit.Assert.*;
import com.teamepic.plugin.rest.RestProjectResource;
import com.teamepic.plugin.rest.RestProjectResourceModel;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.Response;

@RunWith(MockitoJUnitRunner.class)
public class RestProjectResourceTest {

	@Mock
	private ProjectService projectService;

	@Mock
	private SearchService searchService;

	@Mock
	private UserManager userManager;

	@Mock
	private com.atlassian.jira.user.util.UserManager jiraUserManager;

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void getProjectsisValid() {
		RestProjectResource resource = new RestProjectResource(projectService, searchService, userManager, jiraUserManager);

        Response response = resource.getProjects();
        final RestProjectResourceModel message = (RestProjectResourceModel) response.getEntity();

		RestProject[] projects = message.getProjects();

        assertEquals("wrong number of projects", 0, projects.length);
    }
}
