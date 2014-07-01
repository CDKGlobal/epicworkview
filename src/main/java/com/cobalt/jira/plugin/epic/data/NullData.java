package com.cobalt.jira.plugin.epic.data;


/**
 * A NullData represents a fake Jira Issue
 */
public class NullData implements JiraDataInterface {
    private String name;
    private String description;

    /**
     * Creates a new NullData
     * 
     * @param name the name of the NullData
     * @param description the description of the NullData
     */
    public NullData(String name, String description) {
        this.name = name;
        this.description = description;
    }

    /**
     * Returns the name of the data
     * 
     * @return the name of the data
     */
    public String getName() {
        return name;
    }

    /**
     * Returns the key of the data
     * The key is a meaningless key
     * 
     * @return the key of the data
     */
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

    /**
     * Returns the description of the data
     * 
     * @return the description of the data
     */
    public String getDescription() {
        return description;
    }

    /**
     * Returns the last updated time of the data
     * Returns -1 because the issue is not real
     * 
     * @return the timestamp of the data
     */
    public long getTimestamp() {
        return -1;
    }
}
