package com.teamepic.plugin.rest;

import com.atlassian.jira.issue.Issue;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name = "epic")
public class RestEpic
{
	@XmlElement(name = "summary")
	private String summary;

	@XmlElement(name = "key")
	private String key;

	@XmlElement(name = "id")
	private long id;

	@XmlElement(name = "issueType")
	private String issueType;

	public RestEpic() {
	}

	public RestEpic(Issue issue) {
		summary = issue.getSummary();
		key = issue.getKey();
		id = issue.getId();
		issueType = issue.getIssueTypeObject().getName();
	}
}
