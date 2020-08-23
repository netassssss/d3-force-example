/* eslint no-debugger: 0 */
/* eslint no-plusplus: 0 */
/* eslint no-param-reassign: 0 */
export class NodeHelper {
  constructor() {
    this.originNodes = [];
    this.inbetweenersNodes = [];

    this.originIndex = 0;
    this.inbetweenrIndex = 0;

    this.nodes = [];
    this.links = [];

    this.nodeNames = new Set();
  }

  addNode(toAddArr, group) {
    toAddArr.forEach((node) => {
      if (!this.nodes.find((n) => n.id === node.id)) {
        this.nodes.push({ ...node, group });
      }
    });
  }

  createSetOfNodes() {
    const originNode = this.originNodes[this.originIndex++];
    const inb1 = this.inbetweenersNodes[this.inbetweenrIndex++];
    const inb2 = this.inbetweenersNodes[this.inbetweenrIndex];

    this.addNode([originNode, inb1, inb2], this.originIndex - 1);

    this.links.push({
      value: (Math.random() * 1000).toFixed(2),
      source: originNode.id,
      target: inb1.id,
    }, {
      value: (Math.random() * 1000).toFixed(2),
      source: originNode.id,
      target: inb2.id,
    });
  }

  createGeneralNodeConnection(inb1) {
    const originNode = this.originNodes[this.originIndex];

    if (!inb1 || !originNode) return;

    this.addNode([originNode, inb1], this.originIndex);

    this.links.push({
      value: (Math.random() * 1000).toFixed(2),
      source: inb1.id,
      target: originNode.id,
    });
  }

  createConnection() {
    const inb1 = this.inbetweenersNodes[this.inbetweenrIndex++];
    this.createGeneralNodeConnection(inb1);
  }

  createCore(id) {
    const inb1 = { id };
    this.createGeneralNodeConnection(inb1);
  }

  createBatch(len, stepId, betweenerId, coreId, radiuses, opacities, color = '#88B1D1', weight = 10) {
    this.originNodes = new Array(weight)
      .fill()
      .map((t, i) => ({
        id: `${stepId}${i}`, radius: radiuses[0] || 10, opacity: opacities[0] || 1, color,
      }));
    this.inbetweenersNodes = new Array(weight * 2)
      .fill()
      .map((t, i) => ({
        id: `${betweenerId}${i}`, radius: radiuses[1] || 5, opacity: opacities[1] || 0.6, color,
      }));

    this.originIndex = 0;
    this.inbetweenrIndex = 0;

    for (let i = 0; i < len; i += 1) {
      this.createCore(coreId);
      this.createSetOfNodes();
      this.createConnection();
    }
  }

  findNodeById(id) {
    return this.nodes.find((node) => node.id === id);
  }

  connectNodes(core1, core2) {
    if (!core2) return;

    this.addNode([core1, core2], core1.group);

    this.links.push({
      value: (Math.random() * 1000).toFixed(2),
      source: core1.id,
      target: core2.id,
    });
  }

  connectRandomNodes() {
    let last = this.nodes.length - 1;
    let start = 0;
    for (let i = start; i < this.nodes.length / 4; i += 1) {
      last = i % 2 === 0
        ? (this.nodes.length - (start + 1))
        : Math.round((this.nodes.length / 3) * 2) - (start + 1);
      start = i;
      const firstCore = this.nodes[start];
      const lastCore = this.nodes[last];
      this.connectNodes(firstCore, lastCore);
    }
  }

  connectCores() {
    const nodeNames = [...this.nodeNames];
    const core1 = this.findNodeById(`${nodeNames[2]}core`);
    const core2 = this.findNodeById(`${nodeNames[5]}core`);
    const core3 = this.findNodeById(`${nodeNames[8]}core`);
    this.connectNodes(core1, core2);
    this.connectNodes(core2, core3);
  }

  static randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static generateName() {
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

  createInitialNodesAndLinks() {
    const len = 10;
    let name = '';
    while (this.nodeNames.size < 9) {
      name = NodeHelper.generateName();
      if (!this.nodeNames.has(name)) this.nodeNames.add(name);
    }
    const nodeNames = [...this.nodeNames];
    this.createBatch(len, nodeNames[0], nodeNames[1], `${nodeNames[2]}core`, [10, 5], [1, 0.6]);
    this.createBatch(len, nodeNames[3], nodeNames[4], `${nodeNames[5]}core`, [5, 5], [0.6, 0.6]);
    this.createBatch(len, nodeNames[6], nodeNames[7], `${nodeNames[8]}core`, [3, 3], [0.6, 0.6]);
    this.connectCores();
    this.connectRandomNodes();

    return {
      nodes: this.nodes,
      links: this.links,
    };
  }

  updateNodesAndLinks(weight) {
    let name = '';
    const size = this.nodeNames.size + 2;
    while (this.nodeNames.size < size) {
      name = NodeHelper.generateName();
      if (!this.nodeNames.has(name)) this.nodeNames.add(name);
    }
    const nodeNames = [...this.nodeNames];
    const name1 = nodeNames[nodeNames.length - 2];
    const name2 = nodeNames[nodeNames.length - 1];
    this.createBatch(weight, name1, name2, `${name1}core`, [3, 3], [0.6, 0.6], '#ff0000', weight);
    this.connectCores();
    this.connectRandomNodes();

    return {
      nodes: this.nodes,
      links: this.links,
    };
  }
}

export default new NodeHelper();
