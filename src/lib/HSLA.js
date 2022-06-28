class HSLA {
	constructor(h, s, l, a = 1) {
		this.h = h;
		this.s = s;
		this.l = l;
		this.a = a;
	}

	toString() {
		return `hsla(${this.h}, ${this.s | 0}%, ${this.l | 0}%, ${this.a})`;
	}

	static clone(color) {
		return new HSLA(color.h, color.s, color.l, color.a);
	}
}

export default HSLA;