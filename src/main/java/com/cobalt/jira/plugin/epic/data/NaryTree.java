package com.cobalt.jira.plugin.epic.data;

import java.util.*;


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
     * @param data - IJiraData to be inserted into the tree
     */
    public void insert(IJiraData data) {
        Node node = new Node();

        node.setData(data);

        insert(node, root, 0);
    }

    private void insert(Node insertNode, Node curNode, int curDepth) {
        //get the depth we're trying to reach
        int depth = getDepth(insertNode.getData());

        if(depth == -1 || curDepth >= JiraDataType.values().length) {
            //invalid depth or you've gone to far down into the tree
            return;
        }

        //we're at the correct depth
        if(curDepth == depth) {
            Node index = curNode.getChild(insertNode.getData().getId());

            //the current node doesn't have the same node already so insert it
            if(index == null) {
                curNode.addChild(insertNode);
            }
            //otherwise just update the stored data
            else {
                index.getData().update(insertNode.getData());
            }
        }
        //we need to go deeper into the tree
        else {
            IJiraData parent = getParent(curDepth, insertNode.getData());

            //get the node of the child that we need to follow
            Node nextNode = curNode.getChild(parent.getId());

            //the node currently doesn't contain the child we need so add it
            if(nextNode == null) {
                nextNode = new Node();
                nextNode.setData(parent);
                curNode.addChild(nextNode);
            }

            //update the timestamp in order to get the most recent update time
            nextNode.getData().setUpdatedTimestamp(insertNode.getData().getUpdatedTimestamp());
            nextNode.getData().setDisplayTimestamp(insertNode.getData().getDisplayTimestamp());

            insert(insertNode, nextNode, curDepth+1);
        }
    }

    public void remove(IJiraData removeIssue) {
        remove(removeIssue, root, 0);
    }

    private boolean remove(IJiraData removeIssue, Node curNode, int curDepth) {
        int depth = getDepth(removeIssue);

        if(depth == -1 || curDepth >= JiraDataType.values().length) {
            //invalid depth or you've gone to far down into the tree
            throw new IllegalArgumentException("Invalid depth");
        }

        if(curDepth == depth) {
            //remove node
            Node index = curNode.getChild(removeIssue.getId());

            if(index != null) {
                //update timestamp to let others know this issue has been set to be removed
                index.getData().setUpdatedTimestamp(removeIssue.getUpdatedTimestamp());
                index.getData().remove();

                if(curNode == root)
                    return false;

                for(Node n : curNode.getChildren().values()) {
                    if(n.getData().getDisplayTimestamp() > -1) {
                        return false;
                    }
                }

                curNode.getData().remove();
                return true;
            }
            //else remove node isnt in tree
        }
        else {
            //continue
            IJiraData parent = getParent(curDepth, removeIssue);

            Node index = curNode.getChild(parent.getId());

            if(index != null) {
                //update timestamp to let others know this parent had one of its children change
                index.getData().setUpdatedTimestamp(removeIssue.getUpdatedTimestamp());

                boolean delete = remove(removeIssue, index, curDepth+1);

                //if this node and all sub children have been deleted
                if(delete) {
                    if(curNode == root)
                        return false;

                    for(Node n : curNode.getChildren().values()) {
                        if(n.getData().getDisplayTimestamp() > -1) {
                            return false;
                        }
                    }

                    curNode.getData().remove();
                    return true;
                }
            }
            //else the parent isn't in the tree so obviously neither is the child so fallout
        }

        return false;
    }

    private int getDepth(IJiraData data) {
        return JiraDataType.getLevel(data.getType());
    }

    /**
     * Based on the given depth return the data that we want to use
     * @param depth - current depth in the tree
     * @param node - the node to get the data from
     * @return data for the given depth
     */
    private IJiraData getParent(int depth, IJiraData node)
    {
        switch(depth) {
        case 0:
            return node.getProject();
        case 1:
            return node.getEpic();
        case 2:
            return node.getStory();
        default:
            //if the depth is to high throw an exception
            throw new IllegalArgumentException("Invalid Depth!");
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
        Map<Long, Node> map = node.getChildren();
        if(map != null) {
            Collection<Node> children = map.values();
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
        Map<Long, Node> children = curNode.getChildren();
        if(children == null) {
            return;
        }

        for(Map.Entry<Long, Node> entry : children.entrySet()) {

            long displayTime = entry.getValue().getData().getDisplayTimestamp();

            if(displayTime == -1l){
                displayTime = entry.getValue().getData().getUpdatedTimestamp();
            }

            //if the timestamp is too old remove it from the tree
            if(displayTime < timestamp) {
                children.remove(entry.getKey());
            }
            else {
                pruneOldData(entry.getValue(), timestamp);
            }
        }
    }
}
