package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;

import java.util.Iterator;
import java.util.LinkedHashSet;


public class EpicData extends IssueData {
    private static final CustomField EPIC_NAME;

    static {
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        if(manager != null)
            EPIC_NAME = manager.getCustomFieldObjectByName("Epic Name");
        else
            EPIC_NAME = null;
    }

    public EpicData(Issue epic) {
        super(epic);
    }

    public String getName() {
        return EPIC_NAME != null ? (String)issue.getCustomFieldValue(EPIC_NAME) : "No Name Epic";
    }

    public String getDescription() {
        return issue.getSummary();
    }
}
