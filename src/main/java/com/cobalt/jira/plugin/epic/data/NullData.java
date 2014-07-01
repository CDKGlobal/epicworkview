package com.cobalt.jira.plugin.epic.data;


import com.atlassian.jira.issue.Issue;


public class NullData extends EpicData {
    private static long ID_COUNT = -1;

    private String name;
    private String description;

    private NullData(Issue epic) {
        super(null);
    }

    public NullData(String name, String description) {
        super(null);
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getKey() {
        return "NOKEY";
    }

    /**
     * return a unique negative id for this fake data
     * @return
     */
    public long getId() {
        return -1;
    }

    public String getDescription() {
        return description;
    }

    public long getTimestamp() {
        return -1;
    }
}
