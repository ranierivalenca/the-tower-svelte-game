import MovingObjectFactory from "./MovingObjectFactory";

export class ParticleFactory {

  static Particle(cx, cy, radius) {
    const ParticleMovingObject = MovingObjectFactory.MovingObject(
      radius,
      {
        cx, cy
      }
    );

    return class Particle extends ParticleMovingObject {
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
}