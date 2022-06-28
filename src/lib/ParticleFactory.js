let ParticleFactory = (MovingObjectKlass) => {
  return class Particle extends MovingObjectKlass {
		constructor(angle, dist, speed, ttl) {
			super(angle, dist, speed);
			this.ttl = ttl;
      this.initialTTL = ttl;
		}

		alive() {
			return this.ttl > 0;
		}

		tick() {
			this.move();
      this.ttl--;
      this.opacity = (this.ttl / this.initialTTL);
		}
	}
}

export default ParticleFactory;