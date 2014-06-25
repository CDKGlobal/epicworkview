package com.teamepic.plugin.rest.jaxb;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.jql.builder.JqlQueryBuilder;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;
import com.atlassian.query.order.SortOrder;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


/**
 * Contains information about a single project in jira
 */
@XmlRootElement(name = "project")
public class JaxbProject
{
	@XmlElement(name = "name")
	private String name;

	@XmlElement(name = "key")
	private String key;

	@XmlElement(name = "id")
	private long id;

	@XmlElement(name = "description")
	private String description;

	@XmlElement(name = "epics")
	private JaxbEpic[] epics;

	/**
	 * required for JAXB
	 */
	public JaxbProject() {
	}

	/**
	 * Constructs a project that the REST Api can send to the client
	 * @param p - the project to store
	 * @param searchService - service to search for issues for this project
	 * @param user - the current user to use for searching
	 */
	public JaxbProject(com.atlassian.jira.project.Project p, SearchService searchService, User user) {
		//store information that we want about the project
		name = p.getName();
		key = p.getKey();
		id = p.getId();
		description = p.getDescription();

		try
		{
			//get all issue of type epic for this project
			//jql query: project = name AND issueType = Epic ORDER BY updated DESC
			Query q = JqlQueryBuilder.newBuilder().where().project(name).and().issueType("Epic").endWhere().orderBy().updatedDate(SortOrder.DESC).endOrderBy().buildQuery();
			List<com.atlassian.jira.issue.Issue> results = searchService.search(user, q, PagerFilter.getUnlimitedFilter()).getIssues();

			//store the epic results
			epics = new JaxbEpic[results.size()];

			int i = 0;
			for(com.atlassian.jira.issue.Issue is : results)
			{
				epics[i] = new JaxbEpic(is);
				i++;
			}
		}
		catch(SearchException e)
		{
			e.printStackTrace();
		}
	}
}
