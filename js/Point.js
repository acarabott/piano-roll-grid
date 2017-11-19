export class Point {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator]() { yield this.x; yield this.y; }

  add(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  equalTo(point, thresh = 0) {
    return Math.abs(this.x - point.x) <= thresh  &&
           Math.abs(this.y - point.y) <= thresh;
  }

  lessOrEqualTo(point) {
    return this.x <= point.x && this.y <= point.y;
  }

  greaterOrEqualTo(point) {
    return this.x >= point.x && this.y >= point.y;
  }

  lessThan(point) {
    return this.x < point.x && this.y < point.y;
  }

  greaterThan(point) {
    return this.x > point.x && this.y > point.y;
  }
}
