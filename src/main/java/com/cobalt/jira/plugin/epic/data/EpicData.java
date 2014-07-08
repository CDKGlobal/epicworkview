package com.cobalt.jira.plugin.epic.data;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.CustomFieldManager;
import com.atlassian.jira.issue.Issue;


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

    public DataType getType() {
        return DataType.EPIC;
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
        return epicName instanceof String ? (String)epicName : "No Name Epic";
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
