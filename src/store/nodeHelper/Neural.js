export default class {
  constructor() {
    this.nodes = new Map();
    this.links = [];
  }

  setNodeLevel(node, treeLevel) {
    if (node && !this.nodes.get(node.id)) {
      this.nodes.set(node.id,
        { ...node, group: treeLevel, visible: false });
    }
    return node;
  }
}
