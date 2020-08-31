/* eslint no-param-reassign: 0 */
export default class {
  static randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static generateWeight() {
    return Math.floor(this.randomInRange(1, 4));
  }

  static generateQuestion() {
    const vowel = ['a', 'e', 'i', 'o', 'u'];
    // ascii table - small letters located between 97 to 122
    const randSmallLetters = parseInt(this.randomInRange(97, 122), 10);
    // ascii table - capital letters located between 65 to 90
    const randCapitalLetters = parseInt(this.randomInRange(65, 90), 10);
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

  static getNode(allNodes, parenNode) {
    // reduce visited from original nodes
    const validNodes = [...allNodes]
      .filter((node) => node[0] !== parenNode[0]);
    if (validNodes.length === 0) return null;
    // if (validNodes.length === 1) return { id: validNodes[0][0], weight: 0 };
    const node = validNodes[Math.floor(Math.random() * validNodes.length)];
    return this.prettyfiy(node);
  }
}
