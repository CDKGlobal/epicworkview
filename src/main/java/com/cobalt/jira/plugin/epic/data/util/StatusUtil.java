package com.cobalt.jira.plugin.epic.data.util;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.changehistory.ChangeHistory;
import com.atlassian.jira.issue.history.ChangeItemBean;

import java.util.List;


public final class StatusUtil {
    private static final String INITIAL_STATES = "Open, 'To Do'";
    private static final String END_STATES = "Closed, Resolved, Done";

    public static String getInitialStates() {
        return INITIAL_STATES;
    }

    public static String getEndStates() {
        return END_STATES;
    }

    public static boolean leftInitialState(String fromState) {
        return fromState != null && fromState.length() > 0 && getInitialStates().contains(fromState);
    }

    public static boolean enteredEndState(String toState) {
        return toState != null && toState.length() > 0 && getEndStates().contains(toState);
    }

    public static boolean hasBeenWorkedOn(Issue issue) {
        return lastWorkedOnTime(issue) > -1;
    }

    public static long lastWorkedOnTime(Issue issue) {
        List<ChangeHistory> histories = ComponentAccessor.getChangeHistoryManager().getChangeHistories(issue);
        for(int i = histories.size() - 1; i >= 0; i--) {
            ChangeHistory changeHistory = histories.get(i);
            //get the latest bean
            for(ChangeItemBean cib : changeHistory.getChangeItemBeans()) {
                if(cib.getField().equalsIgnoreCase("status") && (leftInitialState(cib.getFromString()) || enteredEndState(cib.getToString()))) {
                    return changeHistory.getTimePerformed().getTime();
                }
            }
        }
        return -1;
    }
}
