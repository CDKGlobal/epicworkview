package com.cobalt.jira.plugin.epic.data;

import java.util.Iterator;
import java.util.LinkedHashSet;

/**
 * A JiraData object holds an object implementing the JiraDataInterface
 * and a list of objects implementing the JiraDataInterface. 
 *
 */
public class JiraData implements JiraDataInterface {
    private JiraDataInterface data;
    private LinkedHashSet<JiraDataInterface> list;

    /**
     * Creates a new JiraData
     * 
     * @param data the element to store in the JiraData
     */
    public JiraData(JiraDataInterface data) {
        this.data = data;
        list = new LinkedHashSet<JiraDataInterface>();
    }

    /**
     * Adds the given element to the list
     * 
     * @param data the element to add
     * @modifies list
     * @effect adds data to list
     */
    public void addToList(JiraDataInterface data) {
        list.add(data);
    }

    /**
     * Returns the name of the data
     * 
     * @return the name of the data
     */
    public String getName() {
        return data.getName();
    }

    /**
     * Returns the key of the data
     * 
     * @return the key of the data
     */
    public String getKey() {
        return data.getKey();
    }

    /**
     * Returns the id of the data
     * 
     * @return the key of the data
     */
    public long getId() {
        return data.getId();
    }

    /**
     * Returns the description of the data
     * 
     * @return the description of the data
     */
    public String getDescription() {
        return data.getDescription();
    }

    /**
     * Returns the most recently updated time of the data or any data in the list
     * 
     * @requires the list of data is in order of updated time
     * @return the timestamp of the JiraData
     */
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

    /**
     * Returns the data stored in the JiraData
     * 
     * @return data
     */
    public JiraDataInterface getData() {
        return data;
    }

    /**
     * Returns an iterator over the list of data
     * 
     * @return an iterator over list of data
     */
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
}
