package com.cobalt.jira.plugin.epic.data;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;


/**
 * A tree that for each node can have any number of children
 */
public class NaryTree {
    private Node root;

    /**
     * initializes the a new tree root
     */
    public NaryTree() {
        root = new Node();
    }

    /**
     * Inserts the given JIRA data into the tree
     * @param data
     */
    public void insert(IJiraData data) {
        Node node = new Node();
        node.setData(data);

        insert(node, root, 0);
    }

    private void insert(Node insertNode, Node curNode, int curDepth) {
        //get the depth we're trying to reach
        int depth = getDepth(insertNode.getData());

        if(depth == -1 || curDepth >= IJiraData.DataType.values().length) {
            //invalid depth or you've gone to far down into the tree
            return;
        }

        //we're at the correct depth
        if(curDepth == depth) {
            int index = curNode.indexOf(insertNode.getData().getId());

            //the current node doesn't have the same node already so insert it
            if(index == -1) {
                curNode.addChild(insertNode);
            }
            //otherwise just update the stored data
            else {
                curNode.getChildren().get(index).getData().update(insertNode.getData());
            }
        }
        //we need to go deeper into the tree
        else {
            IJiraData parent = getParent(curDepth, insertNode);

            //get the index of the child that we need to follow
            int index = curNode.indexOf(parent.getId());

            //the node currently doesn't contain the child we need so add it
            if(index == -1) {
                Node newNode = new Node();

                newNode.setData(parent);

                curNode.addChild(newNode);
                index = curNode.getChildren().size() - 1;
            }

            //get the child node and follow it down
            Node nextNode = curNode.getChildren().get(index);

            //update the timestamp in order to get the most recent update time
            nextNode.getData().setTimestamp(insertNode.getData().getTimestamp());

            insert(insertNode, nextNode, curDepth+1);
        }
    }

    private int getDepth(IJiraData data) {
        return IJiraData.DataType.getLevel(data.getType());
    }

    /**
     * Based on the given depth return the data that we want to use
     * @param depth - current depth in the tree
     * @param node - the node to get the data from
     * @return data for the given depth
     */
    private IJiraData getParent(int depth, Node node)
    {
        switch(depth) {
        case 0:
            return node.getData().getProject();
        case 1:
            return node.getData().getEpic();
        case 2:
            return node.getData().getStory();
        default:
            //if the depth is to high throw an exception
            assert false;
            return null;
        }
    }

    /**
     * Get the tree in pre-order representation
     * @return list of the data stored in pre-order notation
     */
    public List<IJiraData> getPreOrder() {
        List<IJiraData> preOrder = new LinkedList<IJiraData>();
        getPreOrder(root, preOrder);
        preOrder.remove(0);//remove the empty root from the list
        return preOrder;
    }

    private void getPreOrder(Node node, List<IJiraData> preOrder) {
        preOrder.add(node.getData());
        List<Node> children = node.getChildren();
        if(children != null) {
            for(Node child : children) {
                getPreOrder(child, preOrder);
            }
        }
    }

    /**
     * Remove any nodes from the tree that are older than the given timestamp
     * @param timestamp - the oldest time a node in the tree can be
     */
    public void pruneOldData(long timestamp) {
        pruneOldData(root, timestamp);
    }

    private void pruneOldData(Node curNode, long timestamp) {
        //for each child node
        Iterator<Node> iter = curNode.getChildren().iterator();

        while(iter.hasNext()) {
            Node node = iter.next();

            //if the timestamp is too old remove it from the tree
            if(node.getData().getTimestamp() < timestamp) {
                iter.remove();
            }
        }
    }
}
