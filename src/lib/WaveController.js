import TimedFunction from "./TimedFunction";

const ENEMY_COUNT_START = 10;
const ENEMY_RATE_START = 1;
const ENEMY_HP_START = 10;
const ENEMY_SPEED_START = 0.5;

const ENEMY_COUNT_UP = 0.01;
const ENEMY_RATE_UP = 0.005;
const ENEMY_HP_UP = 0.05;
const ENEMY_SPEED_UP = 0.004;



const WaveController = (enemies, eventManager) => {
  return {
    sendWave: function(wave) {
      const enemyCount = ENEMY_COUNT_START * (1 + ENEMY_COUNT_UP) ** wave;
      const enemyRate = ENEMY_RATE_START * (1 + ENEMY_RATE_UP) ** wave;
      const enemyHp = ENEMY_HP_START * (1 + ENEMY_HP_UP) ** wave;
      const enemySpeed = ENEMY_SPEED_START * (1 + ENEMY_SPEED_UP) ** wave;

      eventManager.fire('wave.started', wave);

      // ((count, rate, hp, speed, wave) => {
      //   const fn = new TimedFunction(() => {
      //     // console.log(count, rate, hp);
      //     const angle = Math.random() * 360 | 0;
      //     const enemy = new Enemy(
      //       angle,
      //       ENEMY_START_DIST,
      //       speed + (Math.random() - 0.5) * speed,
      //       hp,
      //       wave
      //     );
      //     EventManager.fire('enemy.created', enemy);
      //     enemies = [
      //       ...enemies,
      //       enemy
      //     ];
      //   }, 1000 / rate);

      //   // console.log(fn);
      //   fn.start(true, count, () => {
      //     EventManager.fire('wave.finished', wave);
      //   });
      // })(enemyCount, enemyRate, enemyHp, enemySpeed, wave);

      return {
        enemyCount,
        enemyRate,
        enemyHp,
        enemySpeed,
      }
    }
  }
}


export default WaveController;