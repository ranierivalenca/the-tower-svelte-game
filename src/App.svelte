<script>;
import TimedFunction from './lib/TimedFunction';
import { ParticleFactory } from './lib/ParticleFactory';
import { BULLET_DAMAGE_UP, BULLET_DISPERSION, BULLET_RADIUS_UP, BULLET_RATE_UP, BULLET_SPEED, CX, CY, ENEMY_COUNT_UP, ENEMY_HP_UP, ENEMY_RADIUS, ENEMY_RATE_UP, ENEMY_SPEED_UP, ENEMY_START_DIST, FPS, H, PLAYER_RADIUS, W } from './constants';
import Bullet from './lib/Bullet';
import Enemy from './lib/Enemy';

// Array.prototype.random = function() {
// 	return this[Math.random() * this.length | 0] ?? null
// }

const initialBulletRate = 1;
const initialBulletDamage = 10;
const initialBulletRadius = 149;

let bulletRateLevel = 0;
let bulletDamageLevel = 0;
let bulletRadiusLevel = 0;

$: bulletRate = () => initialBulletRate * (1 + BULLET_RATE_UP) ** bulletRateLevel;
$: bulletDamage = () => initialBulletDamage * (1 + BULLET_DAMAGE_UP) ** bulletDamageLevel;
$: bulletRadius = () => initialBulletRadius + (1 + BULLET_RADIUS_UP) ** bulletRadiusLevel;

const bulletRateUp = () => bulletRateLevel++;
const bulletDamageUp = () => bulletDamageLevel++;
const bulletRadiusUp = () => bulletRadiusLevel++;

let player = {
  x: CX,
  y: CY,
  hp: 50,
  gold: 0
}

let enemies = [];
let bullets = [];
let particles = [];



/* ******** */

let wave = 0;

$: enemyCount = 10 * (1 + ENEMY_COUNT_UP) ** wave | 0;
$: enemyRate = (1 + ENEMY_RATE_UP) ** wave
$: enemyHp = 10 * (1 + ENEMY_HP_UP) ** wave;
$: enemySpeed = 0.5 * (1 + ENEMY_SPEED_UP) ** wave;
// $: enemyGold = 20;

let waveStatus = {}




const EventManager = {
  functions: {},
  fire(evt, params) {
    for (let fn of this.functions[evt] ?? []) {
      fn(params);
    }
  },

  listen(evt, callback) {
    if (!this.functions[evt]) {
      this.functions[evt] = [];
    }
    this.functions[evt].push(callback);
  }
}

EventManager.listen('wave.started', (wave) => {
  console.log(`wave ${wave} started`);
  waveStatus[wave] = 0;
  // console.log(Object.entries(waveStatus));
});

EventManager.listen('enemy.created', (e) => {
  waveStatus[e.wave]++;
  // console.log(e);
});

EventManager.listen('enemy.destroyed', (e) => {
  waveStatus[e.wave]--;
  // console.log('destroyed', e);
  const Particle = ParticleFactory.Particle(e.x(), e.y(), e.radius / 2);

  const newParticles = Array(5).fill(0).map(_ => {
    const angle = Math.random() * 360 | 0;
    return new Particle(angle, 0, e.speed - BULLET_SPEED, 15);
  });
  particles = [...particles, ...newParticles];

  player.gold += e.wave;
});

EventManager.listen('wave.finished', (wave) => {
  console.log(`wave ${wave} finished`);
});




// main loop
new TimedFunction(() => {
  enemies.forEach(e => e.tick());
  bullets.forEach(b => b.tick());
  particles.forEach(p => p.tick());

  bullets.map(bullet => {
    let target = enemies.find(e => e.collide(bullet))
    if (target) {
      target.damagedBy(bullet.damage);
      bullet.hit();
    }
  })

  enemies.map(e => {
    if (e.alive()) {
      return;
    }
    EventManager.fire('enemy.destroyed', e);
  });

  bullets = bullets.filter(b => b.alive());
  enemies = enemies.filter(e => e.alive());
  particles = particles.filter(p => p.alive());

}, 1000 / FPS).start(true);



// shoot loop
const inRange = enemy => enemy.dist - ENEMY_RADIUS < bulletRadius();

const shoot = new TimedFunction(() => {
  let targets = enemies.filter(enemy => inRange(enemy));
  targets.sort((a, b) => a.dist - b.dist);
  if (targets.length) {
    let target = targets[Math.random() * targets.length | 0];
    let angle = target.angle + (Math.random() - 0.5) * 2 * BULLET_DISPERSION;
    bullets = [...bullets, new Bullet(angle, 0, BULLET_SPEED, bulletDamage())];
  }
}, 1000).start();

$: ((shootRate) => {
  shoot.setInterval(shootRate);
})(1000 / bulletRate());



// wave
const nextWave = () => {
  EventManager.fire('wave.started', wave);
  ((count, rate, hp, speed, wave) => {
    const fn = new TimedFunction(() => {
      // console.log(count, rate, hp);
      const angle = Math.random() * 360 | 0;
      const enemy = new Enemy(
        angle,
        ENEMY_START_DIST,
        speed + (Math.random() - 0.5) * speed,
        hp,
        wave
      );
      EventManager.fire('enemy.created', enemy);
      enemies = [
        ...enemies,
        enemy
      ];
    }, 1000 / rate);

    // console.log(fn);
    fn.start(true, count, () => {
      EventManager.fire('wave.finished', wave);
    });
  })(enemyCount, enemyRate, enemyHp, enemySpeed, wave);

  wave++;
}

// 	let enemyHp = 20

// 	let addEnemy = () => {
// 		let angle = Math.random() * 360 | 0
// 		enemies = [...enemies, new Enemy(angle, ENEMY_START_DIST, 30 + Math.random() * 30, enemyHp)]
// 	}

</script>

<style>
	svg {
		background: #cecece;
		display: block
	}

  @keyframes waves {
    0% {
      r: 10px;
      opacity: 1;
    }
    100% {
      r: var(--radius);
      opacity: 0;
    }
  }

  /* circle.rangeAnimation {
    stroke: gray; */
    /* stroke-width: 5px; */
    /* animation: waves 1s infinite ease-out;
  } */
</style>

<svg width={W} height={H}>
	<circle class="player" cx={player.x} cy={player.y} r="{PLAYER_RADIUS}" stroke="black" stroke-width="1" fill="transparent" />
	<!-- <circle class="playerAura" cx={player.x} cy={player.y} r="{PLAYER_RADIUS}" stroke="black" stroke-width="1" fill="transparent" /> -->
	<circle cx={player.x} cy={player.y} r="{bulletRadius()}" stroke="hsla(0, 0%, 0%, 0.1)" stroke-width="1" fill="transparent" />
	<!-- <circle class="rangeAnimation" style="--radius: {bulletRadius}" cx={player.x} cy={player.y} r="{bulletRadius}" stroke-width="1" fill="transparent" /> -->

  {#each particles as p}
		<circle cx={p.x()} cy={p.y()} r="{p.radius}" stroke="black" fill={p.color ?? 'white'} opacity={p.opacity}></circle>
	{/each}

	{#each enemies as e}
		<circle class="enemy" cx={e.x()} cy={e.y()} r="{e.radius}" stroke="black" fill="{e.getColor() ?? 'black'}"></circle>
	{/each}

	{#each bullets as b}
		<circle cx={b.x()} cy={b.y()} r="{b.radius}" stroke="black" fill={b.color ?? 'blue'}></circle>
	{/each}
</svg>
<div>
	<!-- bps: <input type="number" bind:value={bulletRate}> -->
  Bullets Rate: {bulletRateLevel} / {bulletRate()}
  <br>
  <button on:click={bulletRateUp}>+</button>
</div>
<div>
	<!-- damage: <input type="number" bind:value={bulletDamage}> -->
  Damage: {bulletDamageLevel} / {bulletDamage()}
  <br>
  <button on:click={bulletDamageUp}>+</button>
</div>
<div>
	<!-- bulletRadius: <input type="number" bind:value={bulletRadius}> -->
  Radius: {bulletRadiusLevel} / {bulletRadius()}
  <br>
  <button on:click={bulletRadiusUp}>+</button>
</div>
{player.gold}
<div>
	# wave <input type="number" bind:value={wave}>
	<br>
	count: {enemyCount} <br>
	rate: {enemyRate} <br>
	hp: {enemyHp} <br>
	speed: {enemySpeed} <br>
	<!-- gold: {enemyGold} -->
</div>

<button on:click={nextWave}>
	Next wave
</button>

{#each Object.entries(waveStatus) as [waveNumber, enemies]}
  {waveNumber}: {enemies} <br>
{/each}

<!-- <input type="number" bind:value={enemyHp}>
<button on:click={addEnemy}>
	Add enemy
</button> -->

<!-- {frame}
{animationFrame}
{animationFrame - frame} -->