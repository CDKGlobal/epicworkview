package com.cobalt.jira.plugin.epic.data;

/**
 * enumeration for the different types of jira data stored
 */
public enum JiraDataType {
    PROJECT, EPIC, STORY, SUBTASK;

    /**
     * Gets the level of a data type in JIRA's hierarchy
     * @param dt - DataType to check
     * @return the level of the DataType given, -1 if null or not in the JIRA hierarchy
     */
    public static int getLevel(JiraDataType dt) {
        JiraDataType[] order = JiraDataType.values();
        for(int i = 0; i < order.length; i++) {
            if(dt == order[i]) {
                return i;
            }
        }

        return -1;
    }
}
