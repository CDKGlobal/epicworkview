package ut.com.cobalt.jira.plugin.epic.data;

import com.cobalt.jira.plugin.epic.data.IJiraData;
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
        private DataType type;
        private long id;
        private IJiraData project, epic, story;
        private long timestamp;

        public MockIJiraData(DataType type, long id) {
            this.type = type;
            this.id = id;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }

        public DataType getType() {
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

        public long getTimestamp() {
            return timestamp;
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
        mockIJiraData = new MockIJiraData(IJiraData.DataType.SUBTASK, JIRA_DATA_ID);
        mockIJiraData.setProject(new MockIJiraData(IJiraData.DataType.PROJECT, JIRA_DATA_ID-1));
        mockIJiraData.setEpic(new MockIJiraData(IJiraData.DataType.EPIC, JIRA_DATA_ID - 2));
        mockIJiraData.setStory(new MockIJiraData(IJiraData.DataType.STORY, JIRA_DATA_ID - 3));
    }

    @Test
    public void nodeIsValid() {
        Node node = new Node();

        assertNull(node.getData());
        assertEquals(0, node.getChildren().size());

        node.setData(mockIJiraData);
        node.addChild(node);

        assertEquals(mockIJiraData, node.getData());
        assertEquals(1, node.getChildren().size());

        assertEquals(-1, node.indexOf(-1));
        assertEquals(0, node.indexOf(JIRA_DATA_ID));
    }

    @Test
    public void naryTreeIsValid() {
        NaryTree naryTree = new NaryTree();

        naryTree.insert(mockIJiraData);

        List<IJiraData> data = naryTree.getPreOrder();

        assertEquals(IJiraData.DataType.PROJECT, data.get(0).getType());
        assertEquals(0l, data.get(0).getTimestamp());
        data.remove(0);
        assertEquals(IJiraData.DataType.EPIC, data.get(0).getType());
        assertEquals(0l, data.get(0).getTimestamp());
        data.remove(0);
        assertEquals(IJiraData.DataType.STORY, data.get(0).getType());
        assertEquals(0l, data.get(0).getTimestamp());
        data.remove(0);
        assertEquals(IJiraData.DataType.SUBTASK, data.get(0).getType());
        assertEquals(0l, data.get(0).getTimestamp());

        mockIJiraData.setTimestamp(10l);
        naryTree.insert(mockIJiraData);
        data = naryTree.getPreOrder();

        assertEquals(IJiraData.DataType.PROJECT, data.get(0).getType());
        assertEquals(10l, data.get(0).getTimestamp());
        data.remove(0);
        assertEquals(IJiraData.DataType.EPIC, data.get(0).getType());
        assertEquals(10l, data.get(0).getTimestamp());
        data.remove(0);
        assertEquals(IJiraData.DataType.STORY, data.get(0).getType());
        assertEquals(10l, data.get(0).getTimestamp());
        data.remove(0);
        assertEquals(IJiraData.DataType.SUBTASK, data.get(0).getType());
        assertEquals(10l, data.get(0).getTimestamp());
    }
}
