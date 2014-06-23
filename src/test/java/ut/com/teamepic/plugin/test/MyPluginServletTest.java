package ut.com.teamepic.plugin.test;

import static org.junit.Assert.*;

import javax.servlet.http.HttpServlet;

import org.junit.Before;
import org.junit.Test;

import com.teamepic.plugin.MyPluginServlet;

public class MyPluginServletTest {
	
	HttpServlet servlet;
	
	@Before
	public void setup() {
		servlet = new MyPluginServlet(null, null, null);
	}
	
	@Test
	public void testConstructorNotNull() {
		assertNotNull("Servlet is null", servlet);
	}
}
