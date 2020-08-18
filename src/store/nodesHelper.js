/* eslint no-debugger: 0 */
/* eslint no-plusplus: 0 */
/* eslint no-param-reassign: 0 */
export const getNodesAndLinks = () => {
  let originNodes = new Array(10).fill().map((t, i) => ({ id: `Step${i}` }));
  let inbetweenersNodes = new Array(20).fill().map((t, i) => ({ id: `Betweener${i}` }));

  let originIndex = 0;
  let inbetweenrIndex = 0;

  // origin1 -> inbetweener1 origin1 -> inbetweener2,
  // inbwetweener2 -> origin2
  // ,origin2 -> inbetweener3 origin2 -> inbetweener4
  const nodes = [];
  const links = [];

  const addNode = (toAddArr, group) => {
    toAddArr.forEach((node) => {
      if (!nodes.find((n) => n.id === node.id)) {
        nodes.push({ ...node, group });
      }
    });
  };
  const createSetOfNodes = () => {
    const originNode = originNodes[originIndex++];
    const inb1 = inbetweenersNodes[inbetweenrIndex++];
    const inb2 = inbetweenersNodes[inbetweenrIndex];

    addNode([originNode, inb1, inb2], originIndex - 1);

    links.push({
      source: originNode.id,
      target: inb1.id,
    }, {
      source: originNode.id,
      target: inb2.id,
    });
  };

  const createConnection = () => {
    const originNode = originNodes[originIndex];
    const inb1 = inbetweenersNodes[inbetweenrIndex++];

    if (!inb1 || !originNode) return;

    addNode([originNode, inb1], originIndex);

    links.push({
      source: inb1.id,
      target: originNode.id,
    });
  };

  const createCore = (id) => {
    const originNode = originNodes[originIndex];
    const inb1 = { id };

    if (!originNode) return;

    addNode([originNode, inb1], originIndex);

    links.push({
      source: originNode.id,
      target: inb1.id,
    });
  };

  const createBatch = (len, stepId, betweenerId, coreId) => {
    originNodes = new Array(10).fill().map((t, i) => ({ id: `${stepId}${i}` }));
    inbetweenersNodes = new Array(20).fill().map((t, i) => ({ id: `${betweenerId}${i}` }));

    originIndex = 0;
    inbetweenrIndex = 0;

    for (let i = 0; i < len; i += 1) {
      createCore(coreId);
      createSetOfNodes();
      createConnection();
    }
  };

  const findNodeById = (id) => nodes.find((node) => node.id === id);
  const connectNodes = (core1, core2) => {
    if (!core2) return;

    addNode([core1, core2], core1.group);

    links.push({
      source: core1.id,
      target: core2.id,
    });
  };

  const connectRandomNodes = () => {
    let last = nodes.length - 1;
    let start = 0;
    for (let i = start; i < nodes.length / 4; i += 1) {
      last = i % 2 === 0
        ? (nodes.length - (start + 1))
        : Math.round((nodes.length / 3) * 2) - (start + 1);
      start = i;
      const firstCore = nodes[start];
      const lastCore = nodes[last];
      connectNodes(firstCore, lastCore);
    }
  };

  const connectCores = () => {
    const core1 = findNodeById('core');
    const core2 = findNodeById('TagCore');
    const core3 = findNodeById('TagaimCore');
    connectNodes(core1, core2);
    connectNodes(core2, core3);
  };

  const len = originNodes.length;
  createBatch(len, 'Step', 'Betweeners', 'core');
  createBatch(len, 'TagStep', 'TagBetweeners', 'TagCore');
  createBatch(len, 'TagaimStep', 'TagaimBetweeners', 'TagaimCore');
  connectCores();
  connectRandomNodes();

  return {
    nodes,
    links,
  };
};

export default {
  getNodesAndLinks,
};
