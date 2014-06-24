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
}
