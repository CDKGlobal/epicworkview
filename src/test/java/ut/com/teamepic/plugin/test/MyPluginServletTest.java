package ut.com.teamepic.plugin.test;

import static org.junit.Assert.*;

import org.junit.Test;

import com.teamepic.plugin.MyPluginServlet;

public class MyPluginServletTest {
	
	@Test
	public void testConstructorNotNull() {
		MyPluginServlet servlet = new MyPluginServlet(null, null, null);
		assertNotNull("Servlet is null", servlet);
	}

}
