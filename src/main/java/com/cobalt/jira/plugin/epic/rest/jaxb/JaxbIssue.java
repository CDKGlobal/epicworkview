package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


/**
 * Contains information about a single issue in jira
 */
@XmlRootElement(name = "issue")
public class JaxbIssue
{
    @XmlElement(name = "name")
    String name;

	@XmlElement(name = "description")
	String description;

	@XmlElement(name = "key")
	String key;

	@XmlElement(name = "id")
	long id;

    @XmlElement(name = "timestamp")
    long timestamp;

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
}
