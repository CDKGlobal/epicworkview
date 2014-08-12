package com.cobalt.jira.plugin.epic.rest.jaxb;

/**
 * Contains information about a single project in jira
 */
public class JaxbProject extends JaxbIssue {
    String group;
    String icon;

	/**
	 * required for JAXB
	 */
	public JaxbProject() {
	}

    public String getGroup() {
        return group;
    }

    public String getIcon() {
        return icon;
    }
}
