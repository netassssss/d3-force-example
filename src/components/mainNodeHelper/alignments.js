export default class {
  constructor(fontSize, features = {}) {
    this.fontSize = fontSize;
    this.features = features;
  }

  emToPixel() {
    return this.fontSize * 16;
  }

  fontSizeToX() {
    return this.emToPixel() / 2;
  }

  fontSizeToY() {
    return this.emToPixel() + 2;
  }

  isTextAlignmentX(isTextType) {
    return isTextType ? this.fontSizeToX() : 0;
  }

  isTextAlignmentY(isTextType) {
    return isTextType ? this.fontSizeToY() : 0;
  }

  calculateRightSide(elm, isText) {
    return (elm.vx) + (10 + this.isTextAlignmentX(isText));
  }

  calculateLeftSide(elm, isText) {
    return (elm.vx - this.features.w) + (30 + this.isTextAlignmentX(isText));
  }

  translateCalc(isText, elm, isLeft) {
    return isLeft ? this.calculateLeftSide(elm, isText) : this.calculateRightSide(elm, isText);
  }

  translate(elm, isText, isLeft = true) {
    return `translate(${this.translateCalc(isText, elm, isLeft)}, ${(this.features.h - 40) + this.isTextAlignmentY(isText)})`;
  }
}
