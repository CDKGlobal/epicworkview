package it.com.cobalt.jira.plugin.epic.test;

import org.junit.Ignore;
import org.junit.Test;

import com.atlassian.jira.functest.framework.FuncTestCase;
import com.atlassian.jira.functest.framework.locator.TableLocator;

public class ProjectTableIT extends FuncTestCase {
	
	public static final String PLUGIN_LINK_ID = "epic-plugin-link";
	public static final String TABLE_ID = "projects";
	
	@Test
	public void testTablePresent() {
		navigation.login(ADMIN_USERNAME, ADMIN_PASSWORD);
		tester.clickLink(PLUGIN_LINK_ID);
		tester.assertTablePresent(TABLE_ID);
	}
	
	@Ignore
	@Test
	public void testNewProjectAppearsInTable() {
		navigation.login(ADMIN_USERNAME, ADMIN_PASSWORD);
		long projectId = administration.project().addProject("Test Project", "TP", ADMIN_USERNAME);
		tester.clickLink(PLUGIN_LINK_ID);
		tester.assertTablePresent(TABLE_ID);
		text.assertTextPresent(new TableLocator(tester, TABLE_ID), "Test Project");
		administration.project().deleteProject(projectId);
		text.assertTextNotPresent(new TableLocator(tester, TABLE_ID), "Test Project");
	}
}
