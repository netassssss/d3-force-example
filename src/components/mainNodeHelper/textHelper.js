import TextButton from './textButtons';
import RectButton from './rectButton';
import Questions from './questionsHelper';

export class TextHelper {
  constructor(features) {
    this.yes = new TextButton('Yes', features);
    this.yesRect = new RectButton(features);

    this.no = new TextButton('No', features, false);
    this.noRect = new RectButton(features, false);

    this.Questions = new Questions();
  }

  static setContainer(node, clickHanldr) {
    return node
      .append('g')
      .style('cursor', 'pointer')
      .on('click', clickHanldr);
  }

  handleClick(node, clickHanldr) {
    if (!this.Questions.isEnd()) {
      clickHanldr();
      const textItem = this.Questions.getNextQuestion();
      node.selectAll('.text')
        .text(textItem.q)
        .attr('transform', textItem.translate);
    }
  }

  append(node, clickHanldr) {
    const customHandler = () => this.handleClick(node, clickHanldr);
    this.Questions.append(node);

    const yesG = TextHelper.setContainer(node, customHandler);
    this.yesRect.append(yesG);
    this.yes.append(yesG);

    const noG = TextHelper.setContainer(node, clickHanldr);
    this.noRect.append(noG);
    this.no.append(noG);
  }
}

export default TextHelper;
