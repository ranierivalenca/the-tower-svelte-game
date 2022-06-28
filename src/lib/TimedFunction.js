class TimedFunction {
	constructor(fn, interval) {
		this.fn = fn;
		this.interval = interval;
		this.timeoutId;
    this.running = false;
	}

  setInterval(interval) {
    this.interval = interval;
  }

	start(justStart = false, rounds = 0, callback = () => {}) {
    if (this.running) {
      return;
    }
    this.running = true;
    let remainindRounds = Math.abs(rounds) || Infinity
		const main = (realTime) => {
      this.fn();

			const now = Date.now();
      let deviation = now - realTime
      // console.warn(deviation);

			this.timeoutId = setTimeout(
        main,
        this.interval - deviation,
        realTime + this.interval
      );

      if (--remainindRounds <= 0) {
        this.stop();
        return callback();
      }
		}

		this.timeoutId = setTimeout(
      main,
      justStart ? 0 : this.interval,
      Date.now() + (justStart ? 0 : this.interval)
    );
		return this;
	}

	stop() {
		clearTimeout(this.timeoutId);
    this.running = false;
	}
}

export default TimedFunction;

// https://blog.bitsrc.io/how-to-get-an-accurate-setinterval-in-javascript-ca7623d1d26a

// function intervalTimer(callback, interval = 500) {
//   let counter = 1;
//   let timeoutId;
//   const startTime = Date.now();

//   function main() {
//     const nowTime = Date.now();
//     const nextTime = startTime + counter * interval;
//     timeoutId = setTimeout(main, interval - (nowTime - nextTime));

//     console.log('deviation', nowTime - nextTime);

//     counter += 1;
//     callback();
//   }

//   timeoutId = setTimeout(main, interval);

//   return () => {
//     clearTimeout(timeoutId);
//   };
// }