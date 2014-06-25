package com.teamepic.plugin.rest.jaxb;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Contains information about a single epic in jira
 */
@XmlRootElement(name = "epic")
public class JaxbEpic extends JaxbIssue
{
	//custom field used to get the Epic Name out of jira
	private static final CustomField field = ComponentAccessor.getCustomFieldManager().getCustomFieldObjectByName("Epic Name");

	@XmlElement(name = "name")
	private String name;

	/**
	 * Required for Jaxb
	 */
	public JaxbEpic() {
	}

	public JaxbEpic(Issue issue) {
		super(issue);
		//this object should only be created if the issue type is Epic
		assert(issue.getIssueTypeObject().getName().equals("Epic"));
		name = (String)issue.getCustomFieldValue(field);
	}

	public String getName()
	{
		return name;
	}
}
