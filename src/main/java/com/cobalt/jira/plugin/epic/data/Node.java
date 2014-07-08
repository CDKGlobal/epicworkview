package com.cobalt.jira.plugin.epic.data;

import java.util.LinkedList;
import java.util.List;


public class Node {
    private IJiraData data;
    private List<Node> children;

    public Node() {
        data = null;
        children = new LinkedList<Node>();
    }

    public int indexOf(long id) {
        for(int i = 0; i < children.size(); i++) {
            if(id == children.get(i).data.getId()) {
                return i;
            }
        }
        return -1;
    }

    public void setData(IJiraData data) {
        this.data = data;
    }

    public IJiraData getData() {
        return data;
    }

    public void addChild(Node node) {
        children.add(node);
    }

    public List<Node> getChildren() {
        return children;
    }
}