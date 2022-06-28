import { ENEMY_RADIUS, PLAYER_RADIUS } from "../constants";
import HSLA from "./HSLA";
import MovingObjectFactory from "./MovingObjectFactory";

const EnemyMovingObject = MovingObjectFactory.MovingObject(ENEMY_RADIUS);

export default class Enemy extends EnemyMovingObject {
    constructor(angle, dist, speed, hp, wave) {
      super(angle, dist, speed);
      this.hp = hp;
      this.maxHp = hp;
      this.color = new HSLA(0, 100, 40);
      this.wave = wave;
    }

    alive() {
      return this.hp > 0;
    }

    damagedBy(damage) {
      this.hp -= damage;
      this.color = HSLA.clone(this.color)
      this.color.a = Math.min(1, Math.max(this.hp, 0) / this.maxHp);
    }

    tick() {
      this.move();
      if (this.dist <= PLAYER_RADIUS + this.radius - 2) {
        this.hp = -1;
      }
    }
  }