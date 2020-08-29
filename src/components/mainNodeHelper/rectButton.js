import Alignments from './alignments';
import { color, fontSize } from '../consts';

export default class {
  constructor(features = {}, isLeft = true) {
    this.isLeft = isLeft;
    this.alignmentsHelper = new Alignments(fontSize, features);
  }

  append(node) {
    node
      .append('rect')
      .attr('transform', (d) => this.alignmentsHelper.translate(d, false, this.isLeft))
      .attr('fill', color)
      .attr('width', '30')
      .attr('height', '20');
  }
}
