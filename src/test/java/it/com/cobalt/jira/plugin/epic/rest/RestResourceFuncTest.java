package it.com.cobalt.jira.plugin.epic.rest;

import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import com.cobalt.jira.plugin.epic.rest.RestProjectResourceModel;
import org.apache.wink.client.Resource;
import org.apache.wink.client.RestClient;

public class RestResourceFuncTest
{

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void messageIsValid() {

        String baseUrl = System.getProperty("baseurl");
        String resourceUrl = baseUrl + "/rest/epic/1/projects";

        RestClient client = new RestClient();
        Resource resource = client.resource(resourceUrl);

        RestProjectResourceModel message = resource.get(RestProjectResourceModel.class);

        //assertEquals("wrong message","Hello World",message.getProjects());
    }
}
