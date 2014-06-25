package it.com.teamepic.plugin.test;

import com.atlassian.jira.functest.framework.FuncTestCase;
import com.atlassian.jira.functest.framework.locator.WebPageLocator;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class EnsureLoggedInTest extends FuncTestCase {
	
	public static final String PLUGIN_LINK_ID = "epic-plugin-link";
	
	@Test
	public void testLoginAndClickLink() {
		navigation.login(ADMIN_USERNAME, ADMIN_PASSWORD);
		tester.assertLinkPresent(PLUGIN_LINK_ID);
		tester.clickLink(PLUGIN_LINK_ID);
		text.assertTextNotPresent(new WebPageLocator(tester), "You must log in to access this page.");
	}
	
	@Test
	public void testLogoutAndClickLink() {
		navigation.logout();
		tester.assertLinkPresent(PLUGIN_LINK_ID);
		tester.clickLink(PLUGIN_LINK_ID);
		text.assertTextPresent(new WebPageLocator(tester), "You must log in to access this page.");
	}

}