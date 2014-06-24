package it.com.teamepic.plugin.test;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import com.atlassian.jira.functest.framework.FuncTestCase;
import com.atlassian.jira.functest.framework.locator.WebPageLocator;

public class ProjectTableTest extends FuncTestCase {
	
	public static final String PLUGIN_LINK_ID = "epic-plugin-link";
	public static final String TABLE_ID = "projects";
	
	@Test
	public void testTablePresent() {
		navigation.login(ADMIN_USERNAME, ADMIN_PASSWORD);
		tester.clickLink(PLUGIN_LINK_ID);
		tester.assertTablePresent(TABLE_ID);
	}
	
	/*
	 * error executing administration.project().addProject
	 * 
	@Test
	public void testNewProjectAppearsInTable() {
		navigation.login(ADMIN_USERNAME, ADMIN_PASSWORD);
		long projectId = administration.project().addProject("TestProject", "TEST", ADMIN_USERNAME);
		tester.clickLink(PLUGIN_LINK_ID);
		tester.assertTextInTable(TABLE_ID, "TestProject");
		administration.project().deleteProject(projectId);
		tester.assertTextNotInTable(TABLE_ID, "TestProject");
	}
	*/
}
