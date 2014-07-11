package com.cobalt.jira.plugin.epic.data;

import java.util.LinkedList;
import java.util.List;


/**
 * Simple class for our NaryTree to store data and keep track of its children
 */
public class Node {
    private IJiraData data;
    private List<Node> children;

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
            children = new LinkedList<Node>();
        }

        children.add(node);
    }

    /**
     * Retrieve the children of this node
     * @return
     */
    public List<Node> getChildren() {
        return children;
    }

    public int indexOf(long id) {
        if(children != null) {
            for(int i = 0; i < children.size(); i++) {
                if(id == children.get(i).data.getId()) {
                    return i;
                }
            }
        }

        return -1;
    }
}