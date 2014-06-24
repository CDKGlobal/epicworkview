package com.teamepic.plugin.rest;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


/**
 * Contains information about a single epic in jira
 */
@XmlRootElement(name = "epic")
public class RestEpic
{
	//custom field used to get the Epic Name out of jira
	private static final CustomField field = ComponentAccessor.getCustomFieldManager().getCustomFieldObjectByName("Epic Name");

	@XmlElement(name = "name")
	private String name;

	@XmlElement(name = "description")
	private String description;

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
		description = issue.getSummary();
		key = issue.getKey();
		id = issue.getId();
		name = (String)issue.getCustomFieldValue(field);
	}
}
