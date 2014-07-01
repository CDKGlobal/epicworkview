package com.cobalt.jira.plugin.epic.data;

/**
 * Created by emgej on 7/1/14.
 */
public interface JiraDataInterface {
    public String getName();
    public String getDescription();
    public long getId();
    public String getKey();
    public long getTimestamp();
}
