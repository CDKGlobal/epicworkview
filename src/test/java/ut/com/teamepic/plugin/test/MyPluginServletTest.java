package ut.com.teamepic.plugin.test;

import com.atlassian.sal.api.auth.LoginUriProvider;
import com.atlassian.sal.api.user.UserKey;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.templaterenderer.RenderingException;
import com.atlassian.templaterenderer.TemplateRenderer;
import com.teamepic.plugin.MyPluginServlet;
import org.junit.Before;
import org.junit.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class MyPluginServletTest {

    private static final String USERNAME = "test";
    private static final String URI_PATH = "test/";
    private static URI REFERENCE_URI;

    static {
        try {
            REFERENCE_URI = new URI(URI_PATH);
        }
        catch(URISyntaxException e) {
            e.printStackTrace();
        }
    }

    private UserManager userManager;
    private LoginUriProvider loginUriProvider;
    private TemplateRenderer templateRenderer;
    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;
    private PrintWriter printWriter;

    private URI uri;

    private String templateName;
    private Writer writer;

    @Before
    public void setup() {
        uri = null;
        templateName = null;
        writer = null;

        printWriter = mock(PrintWriter.class);
        httpServletRequest = mock(HttpServletRequest.class);
        userManager = mock(UserManager.class);
        httpServletResponse = mock(HttpServletResponse.class);
        try {
            when(httpServletResponse.getWriter()).thenReturn(printWriter);
        }
        catch(IOException e) {
            fail();
        }

        loginUriProvider = new LoginUriProvider() {
            @Override
            public URI getLoginUri(URI u) {
                uri = u;
                return u;
            }
        };

        templateRenderer = new TemplateRenderer() {
            @Override
            public void render(String s, Writer w) throws RenderingException, IOException {
                templateName = s;
                writer = w;
            }

            @Override
            public void render(String s, Map<String, Object> stringObjectMap, Writer writer) throws RenderingException, IOException {
                return;
            }

            @Override
            public String renderFragment(String s, Map<String, Object> stringObjectMap) throws RenderingException {
                return null;
            }

            @Override
            public boolean resolve(String s) { return false; }
        };
    }

    @Test
    public void nullUserKey() {
        when(httpServletRequest.getRequestURL()).thenReturn(new StringBuffer(URI_PATH));

        MyPluginServlet servlet = new MyPluginServlet(userManager, loginUriProvider, templateRenderer);

        try {
            servlet.doGet(httpServletRequest, httpServletResponse);
        }
        catch(Exception e) {
            e.printStackTrace();
            fail("MyPluginServlet doGet() method threw an exception");
        }

        assertEquals(REFERENCE_URI, uri);
        assertNull(templateName);
        assertNull(writer);
    }

    @Test
    public void adminUserKey() {
        UserKey userKey = new UserKey(USERNAME);
        when(userManager.getRemoteUserKey(httpServletRequest)).thenReturn(userKey);
        when(userManager.isSystemAdmin(userKey)).thenReturn(true);

        MyPluginServlet servlet = new MyPluginServlet(userManager, loginUriProvider, templateRenderer);

        try {
            servlet.doGet(httpServletRequest, httpServletResponse);
        }
        catch(Exception e) {
            fail("MyPluginServlet doGet() method threw an exception");
        }

        assertNull(uri);
        assertEquals("epic.vm", templateName);
        assertEquals(printWriter, writer);
    }
}
