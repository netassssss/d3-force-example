import Common from './common';
import Neural from './Neural';

/* eslint no-plusplus: 0 */
/* eslint no-continue: 0 */
/* eslint no-param-reassign: 0 */
export default class {
  constructor() {
    this.totalNodesInSet = 120;

    this.questions = new Map();
    this.mainNode = null;

    this.neural = new Neural();
    this.globalLevel = 1;

    this.lastSelected = [];
  }

  getLevel(index) {
    if (index >= ((this.questions.size / 4) * this.globalLevel)) this.globalLevel += 1;
    return this.globalLevel;
  }

  setNodeLevel(node, treeLevel) {
    if (node && !this.neural.nodes.get(node.id)) {
      this.neural.nodes.set(node.id,
        { ...node, group: treeLevel, visible: false });
    }
    return node;
  }

  createConnections(parentNode, level) {
    const weight = parentNode[1];
    const allNodes = [...this.questions]; // [[name, weight]]
    for (let i = 0; i < weight; i += 1) {
      const node = Common.getNode(allNodes, parentNode);
      if (!node || parentNode[0] === node[0]) continue;
      this.setNodeLevel(Common.prettyfiy(parentNode), level + i);
      const prettyNode = this.setNodeLevel(node, level + i);
      this.neural.links.push({
        source: parentNode[0],
        target: prettyNode.id,
        visible: false,
      });
    }
  }

  createMainNodeConnection(nodeId) {
    let id = null;
    let found = this.mainNode;
    if (!found) {
      while (!found) {
        id = `${Common.generateQuestion()}-1`;
        if (!this.questions.has(id)) found = true;
      }
      this.mainNode = Common.prettyfiy([id, 1]);
      this.mainNode.color = '#fff';
      this.mainNode.border = '#303030';
      this.mainNode.radius = 70;
      this.setNodeLevel(this.mainNode, 0);
    }
    this.neural.links.push({
      source: this.mainNode.id,
      target: nodeId,
    });
  }

  createDescisionTree() {
    const questions = [...this.questions]; // [[id, weight]]
    questions
      .forEach((question, index) => {
        const level = this.getLevel(index);
        this.createConnections(question, level);
        if (level === 1) this.createMainNodeConnection(question[0]);
      });
  }

  createInitialNodesAndLinks() {
    let id = '';
    let index = 1;
    while (this.questions.size < this.totalNodesInSet) {
      id = `${Common.generateQuestion()}-${index++}`;
      const weight = Common.generateWeight();
      if (!this.questions.has(id)) this.questions.set(id, weight);
    }

    this.createDescisionTree();

    return {
      nodes: [...this.neural.nodes.values()],
      links: this.neural.links,
    };
  }

  getLinkCondition(level, lastSource) {
    return this.neural.links
      .find((link) => lastSource === link.source.id
        && (link.target.group >= level || !link.target.visible));
  }

  getTargetLink(level, lastSource) {
    const maxTries = this.neural.nodes.size;
    let tryNum = 0;
    let target = this.getLinkCondition(level, lastSource);
    while (!target && tryNum < maxTries) {
      lastSource = Common.getRandomNode([...this.neural.nodes.values()], 1);
      target = this.getLinkCondition(level, lastSource);
      tryNum += 1;
    }
    return target;
  }

  getNodeFromPath(level = 1) {
    let index = 0;
    // find source by source and last target
    let lastSource = this.lastSelected[index];

    while (index < this.lastSelected.length) {
      // node will be the source, take the next node to be the source
      const targetLink = this.getTargetLink(level, lastSource);
      if (!targetLink) break;
      index += 1;
      level += 1;
      lastSource = targetLink.target.id;
    }
    return lastSource;
  }

  getSelectedNode() {
    const nodeId = this.lastSelected.length
      ? this.getNodeFromPath() : Common.getRandomNode([...this.neural.nodes.values()], 1);
    this.lastSelected.push(nodeId);
    return nodeId;
  }

  updateNodesOpacity(parentNode) {
    const nodeId = parentNode.id;
    parentNode.visible = true;
    const relatedNodes = this.neural.links
      .reduce((acc, link) => {
        if (link.source.id === nodeId) acc.push(link.target.id);
        if (link.target.id === nodeId) acc.push(link.source.id);
        return acc;
      }, []);
    this.neural.nodes
      .forEach((node) => {
        if (relatedNodes.indexOf(node.id) > -1) {
          node.visible = true;
        }
      });
    return [...this.neural.nodes.values()];
  }

  updateLinks() {
    const nodeId = this.getSelectedNode();
    if (!nodeId) {
      return {
        nodes: this.neural.nodes,
        links: this.neural.links,
      };
    }
    return {
      nodes: this.updateNodesOpacity(this.neural.nodes.get(nodeId)),
      links: this.neural.links
        .map((link) => {
          if ((link.source.id !== this.mainNode.id && link.target.id !== this.mainNode.id)
            && (link.source.id === nodeId || link.target.id === nodeId)) {
            link.visible = true;
          }
          return link;
        }),
    };
  }
}
