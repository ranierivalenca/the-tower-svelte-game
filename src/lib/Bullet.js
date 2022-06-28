import { BULLET_RADIUS } from "../constants";
import MovingObjectFactory from "./MovingObjectFactory";

const BulletMovingObject = MovingObjectFactory.MovingObject(BULLET_RADIUS);

export default class Bullet extends BulletMovingObject {
  constructor(angle, dist, speed, damage) {
    super(angle, dist, speed);
    this.damage = damage;
    this.pierce = false;
    this.hasHit = false;
  }

  hit() {
    this.hasHit = true;
  }

  alive() {
    return !this.hasHit && this.dist < 500;
  }

  tick() {
    this.move();
  }
}