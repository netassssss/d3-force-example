import Alignments from './alignments';
import { fontSize } from '../consts';

export default class TextButton {
  constructor(text, features = {}, isLeft = true) {
    this.isLeft = isLeft;
    this.text = text;
    this.fontSize = fontSize;
    this.alignmentHelper = new Alignments(this.fontSize, features);
  }

  append(node) {
    return node
      .append('text')
      .text(this.text)
      .attr('transform', (d) => this.alignmentHelper.translate(d, true, this.isLeft))
      .attr('font-size', `${this.fontSize}em`);
  }
}
