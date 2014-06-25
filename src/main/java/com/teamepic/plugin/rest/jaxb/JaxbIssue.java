package com.teamepic.plugin.rest.jaxb;

import com.atlassian.jira.issue.Issue;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


/**
 * Contains information about a single issue in jira
 */
@XmlRootElement(name = "issue")
public class JaxbIssue
{
	@XmlElement(name = "description")
	private String description;

	@XmlElement(name = "key")
	private String key;

	@XmlElement(name = "id")
	private long id;

	/**
	 * required for JAXB
	 */
	public JaxbIssue() {
	}

	/**
	 * Constructs an issue that the REST Api can send to the client
	 * @param issue - the issue to store
	 */
	public JaxbIssue(Issue issue) {
		//store information that we want about the issue
		description = issue.getSummary();
		key = issue.getKey();
		id = issue.getId();
	}

	public String getDescription()
	{
		return description;
	}

	public String getKey()
	{
		return key;
	}

	public long getId()
	{
		return id;
	}
}
