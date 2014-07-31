package com.cobalt.jira.plugin.epic.details;

import com.atlassian.sal.api.auth.LoginUriProvider;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.templaterenderer.TemplateRenderer;
import com.cobalt.jira.plugin.epic.EpicServlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class EpicDetails extends EpicServlet {
    public EpicDetails(UserManager userManager,
                        LoginUriProvider loginUriProvider,
                        TemplateRenderer templateRenderer) {
        super(userManager, loginUriProvider, templateRenderer);
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp, "epicDetails.vm");
    }
}
