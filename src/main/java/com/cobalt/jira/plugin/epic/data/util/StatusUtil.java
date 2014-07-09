package com.cobalt.jira.plugin.epic.data.util;

public final class StatusUtil {
    private static final String INITIAL_STATES = "Open, 'To Do'";
    private static final String END_STATES = "Closed, Resolved, Done";

    private StatusUtil() {
    }

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
}
