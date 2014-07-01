package com.cobalt.jira.plugin.epic.data;

import java.util.Iterator;
import java.util.LinkedHashSet;


public class JiraData implements JiraDataInterface {
    private JiraDataInterface data;
    private LinkedHashSet<JiraDataInterface> list;

    public JiraData(JiraDataInterface data) {
        this.data = data;
        list = new LinkedHashSet<JiraDataInterface>();
    }

    public void addToList(JiraDataInterface data) {
        list.add(data);
    }

    public String getName() {
        return data.getName();
    }

    public String getKey() {
        return data.getKey();
    }

    public long getId() {
        return data.getId();
    }

    public String getDescription() {
        return data.getDescription();
    }

    public long getTimestamp() {
        long timestamp = -1;
        Iterator<JiraDataInterface> iterator = getIterator();
        if(iterator.hasNext()) {
            long temp = iterator.next().getTimestamp();
            if(temp > timestamp) {
                timestamp = temp;
            }
        }
        return timestamp;
    }

    public JiraDataInterface getData() {
        return data;
    }

    public Iterator<JiraDataInterface> getIterator() {
        return list.iterator();
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(getName() + ": (");

        Iterator<JiraDataInterface> iterator = getIterator();
        while(iterator.hasNext()) {
            JiraDataInterface e = iterator.next();
            sb.append(e.toString() + " ");
        }
        sb.deleteCharAt(sb.length() - 1);
        sb.append(")");

        return sb.toString();
    }

    public boolean equals(Object o) {
        if(o instanceof JiraData)
        {
            JiraData jd = (JiraData)o;
            boolean equals = jd.data.getClass().equals(data.getClass());
            return equals && (getId() == jd.getId());
        }
        return false;
    }
}
