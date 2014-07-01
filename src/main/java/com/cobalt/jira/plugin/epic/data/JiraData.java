package com.cobalt.jira.plugin.epic.data;

import java.util.Iterator;
import java.util.LinkedHashSet;


public class JiraData<S extends JiraDataInterface, T extends JiraDataInterface> implements JiraDataInterface {
    private S data;
    private LinkedHashSet<T> list;

    public JiraData(S data) {
        this.data = data;
        list = new LinkedHashSet<T>();
    }

    public void addToList(T data) {
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
        Iterator<T> iterator = getIterator();
        if(iterator.hasNext()) {
            long temp = iterator.next().getTimestamp();
            if(temp > timestamp) {
                timestamp = temp;
            }
        }
        return timestamp;
    }

    public S getData() {
        return data;
    }

    public Iterator<T> getIterator() {
        return list.iterator();
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(getName() + ": (");

        Iterator<T> iterator = getIterator();
        while(iterator.hasNext()) {
            T e = iterator.next();
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
