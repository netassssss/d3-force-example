export default class {
  constructor() {
    this.questions = [
      { q: 'Is using Mobile?', translate: 'translate(-50, 0)' },
      { q: 'Is device turned off?', translate: 'translate(-65, 0)' },
      { q: 'Are you having fun?', translate: 'translate(-65, 0)' },
      { q: 'Was it Mobile?', translate: 'translate(-50, 0)' },
    ];
    this.currentLevel = 0;
  }

  getNextQuestion() {
    let res = { q: 'End?', translate: 'translate(-10, 0)' };
    if (this.questions.length > this.currentLevel) res = this.questions[this.currentLevel];
    this.currentLevel += 1;
    return res;
  }

  isEnd() {
    return this.questions.length < this.currentLevel;
  }

  append(node) {
    const textItem = this.getNextQuestion();
    node
      .append('text')
      .text(textItem.q)
      .attr('class', 'text')
      .attr('transform', textItem.translate);
  }
}
