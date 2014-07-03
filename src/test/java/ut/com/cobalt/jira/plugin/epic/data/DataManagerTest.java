package ut.com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.action.issue.customfields.MockCustomFieldType;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.MockCustomField;
import com.atlassian.jira.issue.managers.MockCustomFieldManager;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.issue.search.SearchResults;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.mock.issue.MockIssue;
import com.atlassian.jira.project.MockProject;
import com.atlassian.jira.util.MessageSet;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.query.Query;
import com.cobalt.jira.plugin.epic.data.DataManager;
import com.cobalt.jira.plugin.epic.data.JiraData;
import com.cobalt.jira.plugin.epic.data.JiraDataInterface;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;


public class DataManagerTest {
    private User mockUser;
    private SearchService searchService;

    @Before
    public void setup() throws SearchException {
        searchService = mock(SearchService.class);

        MockCustomField mockCustomField = new MockCustomField("Epic Link", "Epic Link", new MockCustomFieldType("Epic Link", "Epic Link"));

        MockCustomFieldManager mockCustomFieldManager = spy(new MockCustomFieldManager());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Link");

        MockComponentWorker worker = new MockComponentWorker();
        worker.addMock(CustomFieldManager.class, mockCustomFieldManager);
        worker.init();

        mockUser = mock(User.class);

        Query nullQuery = mock(Query.class);
        Query mockQuery = mock(Query.class);

        SearchService.ParseResult nullParseResult = new SearchService.ParseResult(nullQuery, mock(MessageSet.class));
        SearchService.ParseResult mockParseResult = new SearchService.ParseResult(mockQuery, mock(MessageSet.class));

        SearchResults nullSearchResults = mock(SearchResults.class);
        SearchResults mockSearchResults = mock(SearchResults.class);

        when(searchService.parseQuery(isNull(User.class), anyString())).thenReturn(nullParseResult);
        when(searchService.parseQuery(eq(mockUser), anyString())).thenReturn(mockParseResult);

        when(searchService.search(isNull(User.class), eq(nullQuery), any(PagerFilter.class))).thenReturn(nullSearchResults);
        when(searchService.search(eq(mockUser), eq(mockQuery), any(PagerFilter.class))).thenReturn(mockSearchResults);

        when(nullSearchResults.getIssues()).thenReturn(new ArrayList<Issue>());

        MockIssue mockSubTask = spy(new MockIssue(1l, System.currentTimeMillis()));
        MockIssue mockStory1 = new MockIssue(2l, System.currentTimeMillis());
        MockIssue mockStory2 = spy(new MockIssue(3l, System.currentTimeMillis()));
        MockIssue mockEpic = new MockIssue(4l, System.currentTimeMillis());
        MockProject mockProject = new MockProject(5l);

        mockSubTask.setProjectObject(mockProject);
        doReturn(true).when(mockSubTask).isSubTask();
        doReturn(mockStory1).when(mockSubTask).getParentObject();

        mockStory1.setProjectObject(mockProject);

        mockStory2.setProjectObject(mockProject);
        doReturn(mockEpic).when(mockStory2).getCustomFieldValue(mockCustomField);

        mockEpic.setProjectObject(mockProject);

        List<Issue> issues = new ArrayList<Issue>();
        issues.add(mockSubTask);
        issues.add(mockStory2);

        when(mockSearchResults.getIssues()).thenReturn(issues);
    }

    @Test
    public void dataManagerIsValidWithNullUser() {
        DataManager dataManager = new DataManager(searchService);

        List<JiraData> projects = dataManager.getProjects(null);

        assertEquals(0, projects.size());
    }

    @Test
    public void dataManagerIsValidWithUser() {
        DataManager dataManager = new DataManager(searchService);

        List<JiraData> projects = dataManager.getProjects(mockUser);

        assertEquals(1, projects.size());//number of projects

        Iterator<JiraDataInterface> iter = projects.get(0).getIterator();
        int count = 0;
        while(iter.hasNext()) {
            count++;
            iter.next();
        }

        assertEquals(2, count);//number of epics one mockEpic and the Other stories Epic
    }
}
