package com.teamepic.plugin.rest;

import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.issue.search.SearchResults;
import com.atlassian.jira.jql.builder.JqlQueryBuilder;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.user.util.UserManager;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.query.Query;
import com.atlassian.query.order.SortOrder;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


@XmlRootElement(name = "project")
public class RestProject
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
	private RestEpic[] epics;

	public RestProject() {
	}

	public RestProject(Project p, SearchService searchService, User user) {
		name = p.getName();
		key = p.getKey();
		id = p.getId();
		description = p.getDescription();

		try
		{
			Query q = JqlQueryBuilder.newBuilder().where().project(name).and().issueType("Epic").endWhere().orderBy().updatedDate(SortOrder.DESC).endOrderBy().buildQuery();
			List<Issue> results = searchService.search(user, q, PagerFilter.getUnlimitedFilter()).getIssues();
			epics = new RestEpic[results.size()];

			int i = 0;
			for(Issue is : results)
			{
				epics[i] = new RestEpic(is);
				i++;
			}
		}
		catch(SearchException e)
		{
			e.printStackTrace();
		}
	}
}
