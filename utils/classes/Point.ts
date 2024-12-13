import { average } from "../math";

export class Point {
  constructor(private _x: number, private _y: number) {}

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  isHorizontallyAlign(other: Point): boolean {
    return this._x === other.x;
  }

  isVerticallyAlign(other: Point): boolean {
    return this._y === other.y;
  }

  isDiagonallyAlign(other: Point): boolean {
    return Math.abs(other.x - this._x) === Math.abs(other.y - this._y);
  }

  dist(other: Point) {
    const nonSquareDist = (other.x - this._x) * 2 + (other.y - this._y) * 2;
    return Math.sqrt(Math.abs(nonSquareDist));
  }

  relativeDist(other: Point) {
    return other.x - this._x + (other.y - this._y);
  }

  getTranslation(other: Point) {
    return new Point(other.x - this._x, other.y - this._y);
  }

  inverse() {
    return new Point(-this._x, -this._y);
  }

  translate(translation: Point) {
    return new Point(this._x + translation.x, this._y + translation.y);
  }

  toString(): string {
    return `${this._x},${this._y}`;
  }

  static fromString(coordinates: string) {
    const [x, y] = coordinates
      .split(",")
      .map((value) => Number.parseInt(value));
    return new Point(x, y);
  }

  isSame(other: Point) {
    return this._x === other.x && this._y === other.y;
  }

  average(other: Point) {
    return new Point(average(this._x, other.x), average(this._y, other.y));
  }
}
