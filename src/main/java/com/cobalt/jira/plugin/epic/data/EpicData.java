package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;

import java.util.Iterator;
import java.util.LinkedHashSet;


public class EpicData extends IssueData {

    public EpicData(Issue epic) {
        super(epic);
    }

    public String getName() {
        CustomField epicName = null;
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        if(manager != null) {
            epicName = manager.getCustomFieldObjectByName("Epic Name");
        }

        return epicName != null ? (String)issue.getCustomFieldValue(epicName) : "No Name Epic";
    }

    public String getDescription() {
        return issue.getSummary();
    }
}
