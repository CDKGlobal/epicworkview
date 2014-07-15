package com.cobalt.jira.plugin.epic.data;

import java.util.*;


/**
 * Simple class for our NaryTree to store data and keep track of its children
 */
public class Node {
    private IJiraData data;
    private Map<Long, Node> children;

    /**
     * Initializes an empty Node
     */
    public Node() {
        data = null;
        children = null;
    }

    /**
     * Set the data this node stores
     * @param data
     */
    public void setData(IJiraData data) {
        this.data = data;
    }

    /**
     * retrieve the data this node currently has
     * @return
     */
    public IJiraData getData() {
        return data;
    }

    /**
     * Add the given node to its children
     * @param node - node to add
     */
    public void addChild(Node node) {
        //lazy initialization of children so that we don't create unneeded empty lists
        if(children == null) {
            children = new HashMap<Long, Node>();
        }

        children.put(node.getData().getId(), node);
    }

    /**
     * Retrieve the children of this node
     * @return
     */
    public Map<Long, Node> getChildren() {
        return children;
    }

    public Node getChild(long id) {
        return children == null ? null : children.get(id);
    }
}