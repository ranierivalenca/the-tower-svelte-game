import { CX, CY } from '../constants';
import AngledObject from './AngledObject'

export default class MovingObjectFactory {
  static MovingObject(radius, options = {}) {
    options = {
       cx: CX,
       cy: CY,
       ...options
    }

    return class MovingObject extends AngledObject {
      constructor(angle, dist, speed) {
        super(angle, dist);
        this.speed = speed;
        this.radius = radius;
        this.color = null;
        this.opacity = 1;
      }

      x() {
        return options.cx + Math.cos(this.angle * Math.PI / 180) * this.dist
      }

      y() {
        return options.cy + Math.sin(this.angle * Math.PI / 180) * this.dist
      }

      move() {
        // this.dist -= this.speed / fps;
        this.dist -= this.speed;
      }

      getColor() {
        return this.color;
      }

      collide(that) {
        let dx = that.x() - this.x();
        let dy = that.y() - this.y();
        let dist = Math.sqrt(dx**2 + dy**2);
        return dist < (this.radius + that.radius);
      }
    }
  }
}