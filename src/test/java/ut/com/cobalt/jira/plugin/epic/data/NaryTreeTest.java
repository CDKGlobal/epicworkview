package ut.com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import com.cobalt.jira.plugin.epic.data.IJiraData;
import com.cobalt.jira.plugin.epic.data.JiraDataType;
import com.cobalt.jira.plugin.epic.data.NaryTree;
import com.cobalt.jira.plugin.epic.data.Node;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;


public class NaryTreeTest {
    private static final long JIRA_DATA_ID = 10l;

    private MockIJiraData mockIJiraData;

    private class MockIJiraData implements IJiraData {
        private JiraDataType type;
        private long id;
        private IJiraData project, epic, story;
        private long timestamp;

        public MockIJiraData(JiraDataType type, long id) {
            this.type = type;
            this.id = id;
        }

        public void remove() {
        	this.timestamp = -1l;
        }

        public void setUpdatedTimestamp(long timestamp) {

        }

        public long getUpdatedTimestamp() {
            return 0;
        }

        public void setDisplayTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }

        public JiraDataType getType() {
            return type;
        }

        public String getName() {
            return null;
        }

        public String getDescription() {
            return null;
        }

        public long getId() {
            return id;
        }

        public String getKey() {
            return null;
        }

        public long getDisplayTimestamp() {
            return timestamp;
        }

        public boolean completed() {
            return false;
        }

        public void update(IJiraData update) {
        }

        public User getAssignee() {
            return null;
        }

        public IJiraData getProject() {
            return project;
        }

        public IJiraData getEpic() {
            return epic;
        }

        public IJiraData getStory() {
            return story;
        }

        public void setProject(IJiraData project) {
            this.project = project;
        }

        public void setEpic(IJiraData epic) {
            this.epic = epic;
        }

        public void setStory(IJiraData story) {
            this.story = story;
        }
    }

    @Before
    public void setup() {
        mockIJiraData = new MockIJiraData(JiraDataType.SUBTASK, JIRA_DATA_ID);
        mockIJiraData.setProject(new MockIJiraData(JiraDataType.PROJECT, JIRA_DATA_ID - 1));
        mockIJiraData.setEpic(new MockIJiraData(JiraDataType.EPIC, JIRA_DATA_ID - 2));
        mockIJiraData.setStory(new MockIJiraData(JiraDataType.STORY, JIRA_DATA_ID - 3));
    }

    @Test
    public void nodeIsValid() {
        Node node = new Node();

        assertNull(node.getData());
        assertNull(node.getChildren());

        node.setData(mockIJiraData);
        node.addChild(node);

        assertEquals(mockIJiraData, node.getData());
        assertEquals(1, node.getChildren().size());

        assertNull(node.getChild(-1));
        assertNotNull(node.getChild(JIRA_DATA_ID));
    }

    @Test
    public void naryTreeIsValid() {
        NaryTree naryTree = new NaryTree();

        naryTree.insert(new MockIJiraData(null, 0));
        assertEquals(0, naryTree.getPreOrder().size());

        naryTree.insert(mockIJiraData);

        List<IJiraData> data = naryTree.getPreOrder();

        assertEquals(JiraDataType.PROJECT, data.get(0).getType());
        assertEquals(0l, data.get(0).getDisplayTimestamp());
        data.remove(0);
        assertEquals(JiraDataType.EPIC, data.get(0).getType());
        assertEquals(0l, data.get(0).getDisplayTimestamp());
        data.remove(0);
        assertEquals(JiraDataType.STORY, data.get(0).getType());
        assertEquals(0l, data.get(0).getDisplayTimestamp());
        data.remove(0);
        assertEquals(JiraDataType.SUBTASK, data.get(0).getType());
        assertEquals(0l, data.get(0).getDisplayTimestamp());

        mockIJiraData.setDisplayTimestamp(10l);
        naryTree.insert(mockIJiraData);
        data = naryTree.getPreOrder();

        assertEquals(JiraDataType.PROJECT, data.get(0).getType());
        assertEquals(10l, data.get(0).getDisplayTimestamp());
        data.remove(0);
        assertEquals(JiraDataType.EPIC, data.get(0).getType());
        assertEquals(10l, data.get(0).getDisplayTimestamp());
        data.remove(0);
        assertEquals(JiraDataType.STORY, data.get(0).getType());
        assertEquals(10l, data.get(0).getDisplayTimestamp());
        data.remove(0);
        assertEquals(JiraDataType.SUBTASK, data.get(0).getType());
        assertEquals(10l, data.get(0).getDisplayTimestamp());
    }
    
    @Test
    public void testRemoveOneStory() {
    	// Project -> Epic -> [Story, Story]
    	MockIJiraData story1 = new MockIJiraData(JiraDataType.STORY, JIRA_DATA_ID);
    	MockIJiraData story2 = new MockIJiraData(JiraDataType.STORY, JIRA_DATA_ID - 1);
        story1.setProject(new MockIJiraData(JiraDataType.PROJECT, JIRA_DATA_ID - 2));
        story1.setEpic(new MockIJiraData(JiraDataType.EPIC, JIRA_DATA_ID - 3));
        story2.setProject(new MockIJiraData(JiraDataType.PROJECT, JIRA_DATA_ID - 2));
        story2.setEpic(new MockIJiraData(JiraDataType.EPIC, JIRA_DATA_ID - 3));
        
        NaryTree naryTree = new NaryTree();
        naryTree.insert(story1);
        naryTree.insert(story2);
        
        story1.setDisplayTimestamp(10l);
        story1.getEpic().setDisplayTimestamp(10l);
        story1.getProject().setDisplayTimestamp(10l);
        assertEquals("story has incorrect timestamp", 10l, story1.getDisplayTimestamp());
        assertEquals("epic has incorrect timestamp", 10l, story1.getEpic().getDisplayTimestamp());
        
        naryTree.remove(story1);
        
        assertEquals("story's timestamp has not been set to -1", -1l, story1.getDisplayTimestamp());
        assertEquals("epic deleted while still has a story", 10l, story1.getEpic().getDisplayTimestamp());
        assertEquals("project deleted while still has an epic", 10l, story1.getProject().getDisplayTimestamp());    
    }
    
    @Test
    public void testRemoveLastStoryFromEpic() {
    	// Project -> Epic -> Story
    	MockIJiraData story = new MockIJiraData(JiraDataType.STORY, JIRA_DATA_ID);
    	MockIJiraData epic = new MockIJiraData(JiraDataType.PROJECT, JIRA_DATA_ID - 2);
    	MockIJiraData project = new MockIJiraData(JiraDataType.EPIC, JIRA_DATA_ID - 3);
        story.setProject(project);
        story.setEpic(epic);
        
        NaryTree naryTree = new NaryTree();
        naryTree.insert(story);
        
        story.setDisplayTimestamp(10l);
        epic.setDisplayTimestamp(10l);
        project.setDisplayTimestamp(10l);
        
        naryTree.remove(story);
        
        assertEquals("story's timestamp not set to -1", -1l, story.getDisplayTimestamp());
        assertEquals("epic's timestamp not set to -1", -1l, epic.getDisplayTimestamp());
        assertEquals("project's timestamp not set to -1", -1l, project.getDisplayTimestamp());
    }
    
    @Test
    public void testRemoveLastTwoSubtasksFromStory() {
    	// Project -> Epic -> Story -> [Subtask, Subtask]
    	MockIJiraData subtask1 = new MockIJiraData(JiraDataType.SUBTASK, JIRA_DATA_ID);
    	MockIJiraData subtask2 = new MockIJiraData(JiraDataType.SUBTASK, JIRA_DATA_ID - 2);
    	MockIJiraData story = new MockIJiraData(JiraDataType.STORY, JIRA_DATA_ID - 3);
    	MockIJiraData epic = new MockIJiraData(JiraDataType.EPIC, JIRA_DATA_ID - 4);
    	MockIJiraData project = new MockIJiraData(JiraDataType.PROJECT, JIRA_DATA_ID - 5);
        subtask1.setStory(story);
        subtask2.setStory(story);
        subtask1.setEpic(epic);
        subtask2.setEpic(epic);
        subtask1.setProject(project);
        subtask2.setProject(project);
        
        NaryTree naryTree = new NaryTree();
        naryTree.insert(subtask1);
        naryTree.insert(subtask2);
        
        subtask1.setDisplayTimestamp(10l);
        subtask2.setDisplayTimestamp(10l);
        story.setDisplayTimestamp(10l);
        
        naryTree.remove(subtask1);
        
        assertEquals("story removed while still has child", 10l, story.getDisplayTimestamp());
        
        naryTree.remove(subtask2);
        
        assertEquals("story with no children not removed", -1l, story.getDisplayTimestamp());
    }
}
