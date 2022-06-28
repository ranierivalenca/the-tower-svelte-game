let BulletFactory = (MovingObjectKlass) => {
  return class Bullet extends MovingObjectKlass {
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
}

export default BulletFactory;