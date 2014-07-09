package ut.com.cobalt.jira.plugin.epic.data.util;

import com.cobalt.jira.plugin.epic.data.util.StatusUtil;
import org.junit.Test;

import static org.junit.Assert.*;

public class StatusUtilTest {
    @Test
    public void leftInitialStateIsValid() {
        assertFalse(StatusUtil.leftInitialState(null));
        assertFalse(StatusUtil.leftInitialState(""));
        assertFalse(StatusUtil.leftInitialState("Closed"));
        assertTrue(StatusUtil.leftInitialState("To Do"));
    }

    @Test
    public void enteredEndStateIsValid() {
        assertFalse(StatusUtil.enteredEndState(null));
        assertFalse(StatusUtil.enteredEndState(""));
        assertFalse(StatusUtil.enteredEndState("To Do"));
        assertTrue(StatusUtil.enteredEndState("Closed"));
    }
}
