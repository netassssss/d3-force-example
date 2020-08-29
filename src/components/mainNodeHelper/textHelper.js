import TextButton from './textButtons';
import RectButton from './rectButton';

export class TextHelper {
  constructor(features) {
    this.yes = new TextButton('Yes', features);
    this.yesRect = new RectButton(features);

    this.no = new TextButton('No', features, false);
    this.noRect = new RectButton(features, false);
  }

  append(node, clickHanldr) {
    const yesG = node
      .append('g')
      .style('cursor', 'pointer')
      .on('click', clickHanldr);
    this.yesRect.append(yesG);
    this.yes.append(yesG);
    this.noRect.append(node);
    this.no.append(node);
  }
}

export default TextHelper;
