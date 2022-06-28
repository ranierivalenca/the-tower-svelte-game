import AngledObject from './AngledObject'

class MovingObjectFactory {
		constructor() {
			this.cx = null;
			this.cy = null;
			// this.fps = null;
			this.radius = null;
		}
		setCenter(cx, cy) {
			this.cx = cx;
			this.cy = cy;
			return this;
		}
		// setFPS(fps) {
		// 	this.fps = fps;
		// 	return this;
		// }
		setRadius(radius) {
			this.radius = radius;
			return this;
		}

		get() {
			let cx = this.cx;
			let cy = this.cy;
			// let fps = this.fps;
			let radius = this.radius;

			if (!cx || !cy || !radius) {
				throw "need set all variables";
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
					return cx + Math.cos(this.angle * Math.PI / 180) * this.dist
				}

				y() {
					return cy + Math.sin(this.angle * Math.PI / 180) * this.dist
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

export default MovingObjectFactory