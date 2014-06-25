package ut.com.teamepic.plugin.rest;

import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.sal.api.user.UserManager;
import com.teamepic.plugin.rest.jaxb.JaxbProject;
import com.teamepic.plugin.rest.RestResource;
import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import static org.junit.Assert.*;

import com.teamepic.plugin.rest.RestProjectResourceModel;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.Response;

@RunWith(MockitoJUnitRunner.class)
public class RestResourceTest
{

	@Mock
	private ProjectService projectService;

	@Mock
	private SearchService searchService;

	@Mock
	private UserManager userManager;

	@Mock
	private com.atlassian.jira.user.util.UserManager jiraUserManager;

	@Mock
	private EventPublisher eventPublisher;

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void getProjectsisValid() {
		RestResource resource = new RestResource(projectService, searchService, userManager, jiraUserManager, eventPublisher);

		boolean noException = true;
		try
		{
			resource.afterPropertiesSet();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			noException = false;
		}

		assertTrue("afterPropertiesSet threw an exception!", noException);

        Response response = resource.getProjects();
        final RestProjectResourceModel message = (RestProjectResourceModel) response.getEntity();

		JaxbProject[] jaxbProjects = message.getJaxbProjects();

        assertEquals("wrong number of projects", 0, jaxbProjects.length);

		noException = true;
		try
		{
			resource.destroy();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			noException = false;
		}

		assertTrue("destory threw an exception!", noException);
    }
}
