package it.com.teamepic.plugin.test;

import com.atlassian.jira.functest.framework.FuncTestCase;
import com.atlassian.jira.functest.framework.locator.WebPageLocator;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class ClickLinkTest extends FuncTestCase {
	
	@Test
	public void testLoginAndClickLink() {
		navigation.login("admin", "admin");
		tester.assertLinkPresent("epic-plugin-link");
		tester.clickLink("epic-plugin-link");
		text.assertTextNotPresent(new WebPageLocator(tester), "You must log in to access this page.");
	}
	
	@Test
	public void testLogoutAndClickLink() {
		navigation.logout();
		tester.assertLinkPresent("epic-plugin-link");
		tester.clickLink("epic-plugin-link");
		text.assertTextPresent(new WebPageLocator(tester), "You must log in to access this page.");
	}

}
