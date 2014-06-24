package com.teamepic.plugin.rest;

import com.atlassian.jira.issue.Issue;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Contains information about a single epic in jira
 */
@XmlRootElement(name = "epic")
public class RestEpic
{
	@XmlElement(name = "summary")
	private String summary;

	@XmlElement(name = "key")
	private String key;

	@XmlElement(name = "id")
	private long id;

	/**
	 * required for JAXB
	 */
	public RestEpic() {
	}

	/**
	 * Constructs an epic that the REST Api can send to the client
	 * @param issue - the issue to store
	 */
	public RestEpic(Issue issue) {
		//store information that we want about the issue
		summary = issue.getSummary();
		key = issue.getKey();
		id = issue.getId();
	}
}
