package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


/**
 * Contains information about a single epic in jira
 */
@XmlRootElement(name = "epic")
public class JaxbEpic extends JaxbIssue
{
    @XmlElement(name = "stories")
    List<JaxbStory> stories;

	/**
	 * Required for Jaxb
	 */
	public JaxbEpic() {
	}

    public List<JaxbStory> getStories() {
        return stories;
    }
}
