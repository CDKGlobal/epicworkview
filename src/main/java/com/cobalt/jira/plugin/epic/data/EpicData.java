package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;


/**
 * An EpicData represents a Jira Epic
 */
public class EpicData extends IssueData implements IEpicData {
    /**
     * Creates a new EpicData
     *
     * @param epic the epic to be held in this EpicData
     */
    public EpicData(Issue epic) {
        super(epic);
    }

    public JiraDataType getType() {
        return JiraDataType.EPIC;
    }

    /**
     * Returns the name of the epic
     * If the epic has no name, returns a name saying so
     *
     * @return the name of the epic
     */
    public String getName() {
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        Object epicName = issue.getCustomFieldValue(manager.getCustomFieldObjectByName("Epic Name"));

        return epicName instanceof String ? (String) epicName : "No Name Epic";
    }

    /**
     * Returns the description of the epic
     *
     * @return the description of the epic
     */
    public String getDescription() {
        return issue.getSummary();
    }

    /**
     * Returns the color of the epic
     *
     * @return the color of the epic
     */
    public String getColor() {
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        Object epicColor = null;

        //get the custom field
        CustomField customField = manager.getCustomFieldObjectByName("Epic Color");

        //if it does exist get the value for this issue
        if(customField != null) {
            epicColor = customField.getValue(issue);
        }
        //otherwise try with a different custom field
        else {
            customField = manager.getCustomFieldObjectByName("Epic Colour");
            if(customField != null) {
                epicColor = customField.getValue(issue);
            }
        }

        //if the color isn't null and is a String return the color else given a default color as backup
        return epicColor instanceof String ? (String)epicColor : "#fdf4bb";
    }
}
