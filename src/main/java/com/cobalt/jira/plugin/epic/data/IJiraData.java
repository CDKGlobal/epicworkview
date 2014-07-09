package com.cobalt.jira.plugin.epic.data;

import com.atlassian.crowd.embedded.api.User;


public interface IJiraData {
    public static enum DataType {
        PROJECT, EPIC, STORY, SUBTASK;

        private static final DataType[] order = {PROJECT, EPIC, STORY, SUBTASK};

        public static int getIndex(DataType dt) {
            for(int i = 0; i < order.length; i++) {
                if(dt == order[i]) {
                    return i;
                }
            }

            return -1;
        }
    }

    public void setTimestamp(long timestamp);

    public DataType getType();
    public String getName();
    public String getDescription();
    public long getId();
    public String getKey();
    public long getTimestamp();
    public boolean completed();
    public User getAssignee();
    public IJiraData getProject();
    public IJiraData getEpic();
    public IJiraData getStory();

    public void update(IJiraData updatedIssue);
}
