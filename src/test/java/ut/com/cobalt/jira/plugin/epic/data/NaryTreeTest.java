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
}
