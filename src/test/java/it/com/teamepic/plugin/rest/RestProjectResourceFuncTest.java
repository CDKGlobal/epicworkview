package it.com.teamepic.plugin.rest;

import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import org.mockito.Mockito;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import com.teamepic.plugin.rest.RestProjectResource;
import com.teamepic.plugin.rest.RestProjectResourceModel;
import org.apache.wink.client.Resource;
import org.apache.wink.client.RestClient;

public class RestProjectResourceFuncTest {

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void messageIsValid() {

        String baseUrl = System.getProperty("baseurl");
        String resourceUrl = baseUrl + "/rest/project/1/message";

        RestClient client = new RestClient();
        Resource resource = client.resource(resourceUrl);

        RestProjectResourceModel message = resource.get(RestProjectResourceModel.class);

        //assertEquals("wrong message","Hello World",message.getProjects());
    }
}
