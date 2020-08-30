import { NodeHelper } from './NodeHelper';

/* eslint no-param-reassign: 0 */
/* eslint no-plusplus: 0 */
/* eslint no-console: 0 */
/* eslint no-continue: 0 */
/* eslint no-debugger: 0 */
class NodeHelper1 {
  constructor() {
    this.nodes = new Map();
    this.links = [];

    this.totalNodesInSet = 120;

    this.questions = new Map();
    this.mainNode = null;

    this.globalLevel = 1;
    this.lastSelected = [];
  }

  // ----------- helpers ---------------- //
  static randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static generateWeight() {
    return Math.floor(NodeHelper1.randomInRange(1, 4));
  }

  static generateQuestion() {
    const vowel = ['a', 'e', 'i', 'o', 'u'];
    // ascii table - small letters located between 97 to 122
    const randSmallLetters = parseInt(NodeHelper.randomInRange(97, 122), 10);
    // ascii table - capital letters located between 65 to 90
    const randCapitalLetters = parseInt(NodeHelper.randomInRange(65, 90), 10);
    const firstLetterInName = String.fromCharCode(randCapitalLetters);
    const assembled = new Array(5).fill()
      .reduce((acc, val, index) => {
        if (index % 3 === 0) acc += vowel[parseInt(Math.random() * vowel.length, 10)];
        else {
          acc += String.fromCharCode(randSmallLetters);
        }
        return acc;
      }, '');
    return firstLetterInName + assembled;
  }

  static prettyfiy(node) {
    return {
      id: node[0], weight: node[1], radius: 10, opacity: 1, color: '#88B1D1',
    };
  }

  static getRandomNode(arr, level) {
    let node;
    const nodesByGroup = level ? arr.filter((a) => a.group === level) : arr;
    const maxTries = nodesByGroup.length * 3;
    let tryNum = 0;
    while (!node || tryNum >= maxTries) {
      const index = Math.floor(Math.random() * nodesByGroup.length);
      const randNode = nodesByGroup[index];
      if (!randNode.visible) node = randNode;
      tryNum += 1;
    }
    return node.id;
  }
  // ------------------------------------- //

  setNodeLevel(node, treeLevel) {
    if (node && !this.nodes.get(node.id)) {
      this.nodes.set(node.id,
        { ...node, group: treeLevel, visible: false });
    }
    return node;
  }

  static getNode(allNodes, parenNode) {
    // reduce visited from original nodes
    const validNodes = [...allNodes]
      .filter((node) => node[0] !== parenNode[0]);
    if (validNodes.length === 0) return null;
    // if (validNodes.length === 1) return { id: validNodes[0][0], weight: 0 };
    const node = validNodes[Math.floor(Math.random() * validNodes.length)];
    return NodeHelper1.prettyfiy(node);
  }

  getLevel(index) {
    if (index >= ((this.questions.size / 4) * this.globalLevel)) this.globalLevel += 1;
    return this.globalLevel;
  }

  createConnections(parentNode, level) {
    const weight = parentNode[1];
    const allNodes = [...this.questions]; // [[name, weight]]
    for (let i = 0; i < weight; i += 1) {
      const node = NodeHelper1.getNode(allNodes, parentNode);
      if (!node || parentNode[0] === node[0]) continue;
      this.setNodeLevel(NodeHelper1.prettyfiy(parentNode), level + i);
      const prettyNode = this.setNodeLevel(node, level + i);
      this.links.push({
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
        id = `${NodeHelper1.generateQuestion()}-1`;
        if (!this.questions.has(id)) found = true;
      }
      this.mainNode = NodeHelper1.prettyfiy([id, 1]);
      this.mainNode.color = '#fff';
      this.mainNode.border = '#303030';
      this.mainNode.radius = 70;
      this.setNodeLevel(this.mainNode, 0);
    }
    this.links.push({
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
      id = `${NodeHelper1.generateQuestion()}-${index++}`;
      const weight = NodeHelper1.generateWeight();
      if (!this.questions.has(id)) this.questions.set(id, weight);
    }

    this.createDescisionTree();

    return {
      nodes: [...this.nodes.values()],
      links: this.links,
    };
  }

  getNodeFromPath(level = 1) {
    let index = 0;
    // find source by source and last target
    let lastSource = this.lastSelected[index];
    const getLinkCondition = () => this.links
      .find((link) => lastSource === link.source.id
        && (link.target.group >= level || !link.target.visible));
    const getTargetLink = () => {
      const maxTries = this.nodes.size;
      let tryNum = 0;
      let target = getLinkCondition();
      while (!target && tryNum < maxTries) {
        lastSource = NodeHelper1.getRandomNode([...this.nodes.values()], 1);
        target = getLinkCondition();
        tryNum += 1;
      }
      return target;
    };

    while (index < this.lastSelected.length) {
      // node will be the source, take the next node to be the source
      const targetLink = getTargetLink();
      if (!targetLink) break;
      index += 1;
      level += 1;
      lastSource = targetLink.target.id;
    }
    return lastSource;
  }

  getSelectedNode() {
    const nodeId = this.lastSelected.length
      ? this.getNodeFromPath() : NodeHelper1.getRandomNode([...this.nodes.values()], 1);
    this.lastSelected.push(nodeId);
    return nodeId;
  }

  updateNodesOpacity(parentNode) {
    const nodeId = parentNode.id;
    parentNode.visible = true;
    const relatedNodes = this.links
      .reduce((acc, link) => {
        if (link.source.id === nodeId) acc.push(link.target.id);
        if (link.target.id === nodeId) acc.push(link.source.id);
        return acc;
      }, []);
    this.nodes
      .forEach((node) => {
        if (relatedNodes.indexOf(node.id) > -1) {
          node.visible = true;
        }
      });
    return [...this.nodes.values()];
  }

  updateLinks() {
    const nodeId = this.getSelectedNode();
    if (!nodeId) {
      return {
        nodes: this.nodes,
        links: this.links,
      };
    }
    return {
      nodes: this.updateNodesOpacity(this.nodes.get(nodeId)),
      links: this.links
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

export default new NodeHelper1();
