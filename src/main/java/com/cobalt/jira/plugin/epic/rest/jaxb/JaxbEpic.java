package com.cobalt.jira.plugin.epic.rest.jaxb;

/**
 * Contains information about a single epic in jira
 */
public class JaxbEpic extends JaxbIssue {
    String color;

	/**
	 * Required for Jaxb
	 */
	public JaxbEpic() {
	}

    public String getColor() {
        return color;
    }
}
