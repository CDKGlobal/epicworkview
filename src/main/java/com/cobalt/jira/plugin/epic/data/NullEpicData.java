package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;
import org.codehaus.jackson.annotate.JsonIgnore;


/**
 * A NullEpicData represents a fake Jira Epic
 */
public class NullEpicData extends JiraData implements IEpicData {
    @JsonIgnore
    private String name;
    @JsonIgnore
    private String description;

    /**
     * Creates a new NullEpicData
     * 
     * @param name the name of the NullEpicData
     * @param description the description of the NullEpicData
     */
    public NullEpicData(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public JiraDataType getType() {
        return JiraDataType.EPIC;
    }

    public String getName() {
        return name;
    }

    public String getKey() {
        return "NOKEY";
    }

    /**
     * Returns the id of the data
     * The id is -1 so it will be unique from any real issues
     * 
     * @return the id of the data
     */
    public long getId() {
        return -1;
    }

    public String getDescription() {
        return description;
    }

    public boolean completed() {
        return false;
    }

    public User getAssignee() {
        return null;
    }

    public IJiraData getProject() {
        return null;
    }

    public IJiraData getEpic() {
        return this;
    }

    public IJiraData getStory() {
        return null;
    }

    public String getColor() {
        return "#fdf4bb";
    }

    public void update(IJiraData iJiraData) {
        super.update(iJiraData);

        if(iJiraData instanceof NullEpicData) {
            name = iJiraData.getName();
            description = iJiraData.getDescription();
        }
    }
}
