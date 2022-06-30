import { ENEMY_RADIUS, PLAYER_RADIUS } from "../constants";
import EventManager from "./EventManager";
import HSLA from "./HSLA";
import LiveObject from "./LiveObject";
import MovingObjectFactory from "./MovingObjectFactory";

const EnemyMovingObject = MovingObjectFactory.MovingObject(ENEMY_RADIUS);

export default class Enemy extends LiveObject(EnemyMovingObject) {
    constructor(angle, dist, speed, hp, wave) {
      super(hp, angle, dist, speed);
      this.color = new HSLA(0, 100, 40);
      this.wave = wave;

      EventManager.fire('enemy.created', this);
    }

    damagedBy(damage, obj = null) {
      super.damagedBy(damage);
      if (!this.isAlive()) {
        EventManager.fire('enemy.destroyed', [this, obj]);
      }
      this.color = HSLA.clone(this.color)
      this.color.a = Math.min(1, Math.max(this.hp, 0) / this.maxHp);
    }

    tick() {
      this.move();
      if (this.dist <= PLAYER_RADIUS + this.radius - 2) {
        this.damagedBy(this.hp + 1);
      }
    }
  }