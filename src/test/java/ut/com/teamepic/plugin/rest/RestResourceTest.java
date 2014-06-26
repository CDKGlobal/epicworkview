package ut.com.teamepic.plugin.rest;

import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.sal.api.user.UserProfile;
import com.teamepic.plugin.rest.RestResource;
import org.junit.Test;
import org.junit.Before;
import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

import com.teamepic.plugin.rest.RestProjectResourceModel;

public class RestResourceTest
{
	private ProjectService projectService;
	private SearchService searchService;
	private UserManager userManager;
	private com.atlassian.jira.user.util.UserManager jiraUserManager;
	private EventPublisher eventPublisher;

    @Before
    public void setup() {
		projectService = mock(ProjectService.class);
		searchService = mock(SearchService.class);
		userManager = mock(UserManager.class);
		jiraUserManager = mock(com.atlassian.jira.user.util.UserManager.class);
		eventPublisher = mock(EventPublisher.class);

		UserProfile userProfile = mock(UserProfile.class);

		when(userManager.getRemoteUser()).thenReturn(userProfile);
        ApplicationUser user = mock(ApplicationUser.class);
		when(jiraUserManager.getUserByName(anyString())).thenReturn(user);
    }

    @Test
    public void getProjectsisValid() {
		RestResource resource = new RestResource(projectService, searchService, userManager, jiraUserManager, eventPublisher);

		try {
			resource.afterPropertiesSet();
		}
		catch(Exception e) {
			fail("RestResource threw an exception when afterPropertiesSet() was called");
		}

		RestProjectResourceModel restProjectResourceModel = (RestProjectResourceModel)resource.getProjects().getEntity();

		assertNotNull(restProjectResourceModel);

		try {
			resource.destroy();
		}
		catch(Exception e) {
			fail("RestResource threw an exception when destroy() was called");
		}
    }
}
