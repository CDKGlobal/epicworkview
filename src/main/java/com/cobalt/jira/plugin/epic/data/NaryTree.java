package com.cobalt.jira.plugin.epic.data;

import java.util.LinkedList;
import java.util.List;

public class NaryTree {
    private Node root;

    public NaryTree() {
        root = new Node();
    }

    public void insert(IJiraData data) {
        Node node = new Node();
        node.setData(data);

        insert(node, root, 0);
    }

    private void insert(Node insertNode, Node curNode, int curDepth) {
        int depth = getDepth(insertNode.getData());

        if(depth == -1 || curDepth >= IJiraData.DataType.values().length) {
            //invalid depth or you've gone to down into the tree
            return;
        }

        //we're at the correct depth
        if(curDepth == depth) {
            int index = curNode.indexOf(insertNode.getData().getId());

            //the current node doesn't have the same node already
            if(index == -1) {
                curNode.addChild(insertNode);
            }
            else {
                curNode.getChildren().get(index).getData().update(insertNode.getData());
            }
        }
        else {//we need to go deeper into the tree
            int index = curNode.indexOf(getParent(curDepth, insertNode).getId());

            if(index == -1) {
                Node newNode = new Node();

                newNode.setData(getParent(curDepth, insertNode));

                curNode.addChild(newNode);
                index = curNode.getChildren().size() - 1;
            }
            Node nextNode = curNode.getChildren().get(index);
            nextNode.getData().setTimestamp(insertNode.getData().getTimestamp());

            insert(insertNode, nextNode, curDepth+1);
        }
    }

    private int getDepth(IJiraData data) {
        return IJiraData.DataType.getIndex(data.getType());
    }

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
            assert false;
            return null;
        }
    }

    public List<IJiraData> getPreOrder() {
        List<IJiraData> preOrder = new LinkedList<IJiraData>();
        getPreOrder(root, preOrder);
        preOrder.remove(0);//remove the empty root from the list
        return preOrder;
    }

    private void getPreOrder(Node node, List<IJiraData> preOrder) {
        preOrder.add(node.getData());
        for(Node child : node.getChildren()) {
            getPreOrder(child, preOrder);
        }
    }
}
