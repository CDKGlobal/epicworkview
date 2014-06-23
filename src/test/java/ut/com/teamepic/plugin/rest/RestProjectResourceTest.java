package ut.com.teamepic.plugin.rest;

import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import org.mockito.Mockito;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import com.teamepic.plugin.rest.RestProjectResource;
import com.teamepic.plugin.rest.RestProjectResourceModel;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.GenericEntity;

public class RestProjectResourceTest {

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void messageIsValid() {
        /*RestProjectResource resource = new RestProjectResource();

        Response response = resource.getMessage();
        final RestProjectResourceModel message = (RestProjectResourceModel) response.getEntity();

        assertEquals("wrong message","Hello World",message.getMessage());*/
    }
}
