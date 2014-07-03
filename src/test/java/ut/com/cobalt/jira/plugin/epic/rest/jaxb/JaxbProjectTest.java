package ut.com.cobalt.jira.plugin.epic.rest.jaxb;

import com.atlassian.jira.project.Project;
import com.cobalt.jira.plugin.epic.data.ProjectData;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbEpic;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbFactory;
import com.cobalt.jira.plugin.epic.rest.jaxb.JaxbProject;
import org.junit.Before;
import org.junit.Test;

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

	@Before
	public void setup() {
		project = mock(Project.class);
		when(project.getName()).thenReturn(PROJECT_NAME);
		when(project.getKey()).thenReturn(PROJECT_KEY);
		when(project.getId()).thenReturn(PROJECT_ID);
		when(project.getDescription()).thenReturn(PROJECT_DESCRIPTION);
	}

	@Test
	public void jaxbProjectIsValid() {
		JaxbProject jaxbProject = JaxbFactory.newJaxbProject(new ProjectData(project), -1, new LinkedList<JaxbEpic>());

		assertEquals(PROJECT_NAME, jaxbProject.getName());
		assertEquals(PROJECT_KEY, jaxbProject.getKey());
		assertEquals(PROJECT_ID, jaxbProject.getId());
		assertEquals(PROJECT_DESCRIPTION, jaxbProject.getDescription());
        assertEquals(-1, jaxbProject.getTimestamp());
		assertEquals(0, jaxbProject.getEpics().size());
	}
}
