import { ENEMY_COUNT_START, ENEMY_COUNT_UP, ENEMY_HP_START, ENEMY_HP_UP, ENEMY_RATE_START, ENEMY_RATE_UP, ENEMY_SPEED_START, ENEMY_SPEED_UP, ENEMY_START_DIST } from "../constants";
import Enemy from "./Enemy";
import EventManager from "./EventManager";
import TimedFunction from "./TimedFunction";

class Wave {
  constructor(wave) {
    this.wave = wave;

    this.count = ENEMY_COUNT_START * (1 + ENEMY_COUNT_UP) ** this.wave;
    this.rate = ENEMY_RATE_START * (1 + ENEMY_RATE_UP) ** this.wave;
    this.hp = ENEMY_HP_START * (1 + ENEMY_HP_UP) ** this.wave;
    this.speed = ENEMY_SPEED_START * (1 + ENEMY_SPEED_UP) ** this.wave;

    this.sentEnemies = 0;
    this.killedEnemies = 0;
    this.fn = null;

    EventManager.listen(`enemy.created`, (e) => {
      if (e.wave != this.wave) return;
      console.log(`created enemy on wave ${this.wave}`)
      this.sentEnemies++;
    });

    EventManager.listen(`enemy.destroyed`, (e) => {
      if (e.wave != this.wave) return;
      // console.log(`killed enemy on wave ${this.wave}`)
      this.killedEnemies++;
    });
  }

  start() {
    EventManager.fire('wave.started', this.wave);
    this.fn = new TimedFunction(() => {
      const angle = Math.random() * 360 | 0;
      const enemy = new Enemy(
        angle,
        ENEMY_START_DIST,
        this.speed + (Math.random() - 0.5) * this.speed,
        this.hp,
        this.wave
      );

      EnemiesManager.enemies = [
        ...EnemiesManager.enemies,
        enemy
      ];
    }, 1000 / this.rate).start(true, this.count, () => {
      EventManager.fire('wave.finished', this.wave);
    });

    return this;
  }
}

export class EnemiesManager {
  static enemies = [];
  static waves = [];

  static createWave(waveNumber) {
    const wave = new Wave(waveNumber).start();
    EnemiesManager.waves.push(wave);

    return wave;
  }

  static computeAlive() {
    EnemiesManager.enemies = EnemiesManager.enemies.filter(e => e.isAlive());
  }

  static tick() {
    this.enemies.forEach(e => e.tick());
  }
}