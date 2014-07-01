package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.fields.CustomField;

/**
 * An EpicData represents a Jira Epic
 */
public class EpicData extends IssueData {

	/**
	 * Creates a new EpicData
	 * 
	 * @param epic the epic to be held in this EpicData
	 */
    public EpicData(Issue epic) {
        super(epic);
    }

    /**
     * Returns the name of the epic
     * If the epic has no name, returns a name saying so
     * 
     * @return the name of the epic
     */
    public String getName() {
        CustomField epicName = null;
        CustomFieldManager manager = ComponentAccessor.getCustomFieldManager();
        if(manager != null) {
            epicName = manager.getCustomFieldObjectByName("Epic Name");
        }

        return epicName != null ? (String)issue.getCustomFieldValue(epicName) : "No Name Epic";
    }

    /**
     * Returns the description of the epic
     * 
     * @return the description of the epic
     */
    public String getDescription() {
        return issue.getSummary();
    }
}
