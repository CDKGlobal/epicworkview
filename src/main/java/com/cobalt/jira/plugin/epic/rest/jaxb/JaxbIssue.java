package com.cobalt.jira.plugin.epic.rest.jaxb;

import org.codehaus.jackson.annotate.JsonAutoDetect;

import java.util.List;


/**
 * Contains information about a single issue in jira
 */
@JsonAutoDetect(getterVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY, fieldVisibility = JsonAutoDetect.Visibility.NONE)
public abstract class JaxbIssue {
    String name;
	String description;
	String key;
	long id;
    long timestamp;
    JaxbUser contributor;
    List<? extends JaxbIssue> children = null;

	/**
	 * required for JAXB
	 */
	public JaxbIssue() {
	}

    public String getName() {
        return name;
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

    public long getTimestamp() {
        return timestamp;
    }

    public JaxbUser getContributor() {
        return contributor;
    }

    public List<? extends JaxbIssue> getChildren() {
        return children;
    }
}
