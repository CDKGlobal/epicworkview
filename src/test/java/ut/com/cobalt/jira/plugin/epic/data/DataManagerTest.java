package ut.com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.action.issue.customfields.MockCustomFieldType;
import com.atlassian.jira.bc.ServiceOutcome;
import com.atlassian.jira.bc.ServiceOutcomeImpl;
import com.atlassian.jira.bc.project.ProjectService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.changehistory.ChangeHistory;
import com.atlassian.jira.issue.changehistory.ChangeHistoryManager;
import com.atlassian.jira.issue.fields.MockCustomField;
import com.atlassian.jira.issue.history.ChangeItemBean;
import com.atlassian.jira.issue.managers.MockCustomFieldManager;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.issue.search.SearchResults;
import com.atlassian.jira.mock.component.MockComponentWorker;
import com.atlassian.jira.mock.issue.MockIssue;
import com.atlassian.jira.project.MockProject;
import com.atlassian.jira.project.Project;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.jira.util.ErrorCollection;
import com.atlassian.jira.util.MessageSet;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.bc.issue.search.SearchService;
import com.atlassian.query.Query;
import com.cobalt.jira.plugin.epic.data.DataManager;
import com.cobalt.jira.plugin.epic.data.IJiraData;
import com.cobalt.jira.plugin.epic.data.JiraDataType;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;


public class DataManagerTest {
    private User mockUser;
    private SearchService searchService;
    private UserUtil userUtil;
    private ProjectService projectService;

    private class MockServiceOutcome<T> implements ServiceOutcome<T> {
        private T value;

        public MockServiceOutcome(T value) {
            this.value = value;
        }

        public T getReturnedValue() {
            return value;
        }

        public boolean isValid() {
            return false;
        }

        public ErrorCollection getErrorCollection() {
            return null;
        }
    }

    @Before
    public void setup() throws SearchException {
        searchService = mock(SearchService.class);
        userUtil = mock(UserUtil.class);

        MockCustomField mockCustomField = new MockCustomField("Epic Link", "Epic Link", new MockCustomFieldType("Epic Link", "Epic Link"));

        MockCustomFieldManager mockCustomFieldManager = spy(new MockCustomFieldManager());
        doReturn(mockCustomField).when(mockCustomFieldManager).getCustomFieldObjectByName("Epic Link");

        ChangeHistoryManager changeHistoryManager = mock(ChangeHistoryManager.class);

        List<ChangeHistory> changeHistories = new ArrayList<ChangeHistory>();
        ChangeHistory changeHistory = mock(ChangeHistory.class);
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        when(changeHistory.getTimePerformed()).thenReturn(timestamp);

        List<ChangeItemBean> cibs = new ArrayList<ChangeItemBean>();
        ChangeItemBean cib = new ChangeItemBean();
        cib.setField("status");
        cib.setFrom("Open");
        cib.setFromString("Open");
        cib.setTo("In Progress");
        cib.setToString("In Progress");
        cib.setFieldType(ChangeItemBean.STATIC_FIELD);
        cib.setCreated(timestamp);
        cibs.add(cib);

        cib = new ChangeItemBean();
        cib.setField("resolution");
        cib.setFrom("null");
        cib.setFromString("null");
        cib.setTo("Fixed");
        cib.setToString("Fixed");
        cib.setFieldType(ChangeItemBean.STATIC_FIELD);
        cib.setCreated(timestamp);

        cib = new ChangeItemBean();
        cib.setField("status");
        cib.setFrom("In Progress");
        cib.setFromString("In Progress");
        cib.setTo("Done");
        cib.setToString("Done");
        cib.setFieldType(ChangeItemBean.STATIC_FIELD);
        cib.setCreated(timestamp);

        when(changeHistory.getChangeItemBeans()).thenReturn(cibs);

        changeHistories.add(changeHistory);

        when(changeHistoryManager.getChangeHistories(any(Issue.class))).thenReturn(changeHistories);


        MockComponentWorker worker = new MockComponentWorker();
        worker.addMock(CustomFieldManager.class, mockCustomFieldManager);
        worker.addMock(ChangeHistoryManager.class, changeHistoryManager);
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
        MockIssue mockStory2 = spy(new MockIssue(3l, 100l));
        MockIssue mockEpic = new MockIssue(4l, 80l);
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

        Collection<User> admins = new ArrayList<User>();
        admins.add(mockUser);
        when(userUtil.getJiraSystemAdministrators()).thenReturn(admins);

        projectService = mock(ProjectService.class);
        ServiceOutcome<List<Project>> outcome = new MockServiceOutcome<List<Project>>(new ArrayList<Project>());
        User nullUser = null;
        when(projectService.getAllProjects(nullUser)).thenReturn(outcome);
        List<Project> viewableProjects = new ArrayList<Project>();
        viewableProjects.add(mockProject);
        ServiceOutcome<List<Project>> outcomeUser = new MockServiceOutcome<List<Project>>(viewableProjects);
        when(projectService.getAllProjects(mockUser)).thenReturn(outcomeUser);
    }

    @Test
    public void dataManagerIsValidWithNoInit() {
        DataManager dataManager = new DataManager(projectService);

        List<IJiraData> projects = dataManager.getProjects(mockUser);
        assertEquals(0, projects.size());
    }

    @Test
    public void dataManagerIsValidWithDestory() {
        DataManager dataManager = new DataManager(projectService);
        dataManager.init(searchService, userUtil);

        List<IJiraData> projects = dataManager.getProjects(mockUser);
        assertEquals(4, projects.size());

        dataManager.destroy();

        projects = dataManager.getProjects(mockUser);
        assertEquals(0, projects.size());
    }

    @Test
    public void dataManagerIsValidWithNullUser() {
        DataManager dataManager = new DataManager(projectService);
        dataManager.init(searchService, userUtil);

        List<IJiraData> projects = dataManager.getProjects(null);

        assertEquals(0, projects.size());
    }

    @Test
    public void dataManagerIsValidWithUser() {
        DataManager dataManager = new DataManager(projectService);
        dataManager.init(searchService, userUtil);

        List<IJiraData> projects = dataManager.getProjects(mockUser);

        assertEquals(4, projects.size());//number of elements in the tree

        assertEquals(JiraDataType.PROJECT, projects.get(0).getType());
        projects.remove(0);
        assertEquals(JiraDataType.EPIC, projects.get(0).getType());
        projects.remove(0);
        assertEquals(JiraDataType.STORY, projects.get(0).getType());
        projects.remove(0);
        assertEquals(JiraDataType.SUBTASK, projects.get(0).getType());
    }
}
