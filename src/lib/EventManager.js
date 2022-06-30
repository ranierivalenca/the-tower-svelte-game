export default class EventManager {

  static functions = {};

  static fire(evt, params) {
    for (let fn of this.functions[evt] ?? []) {
      fn(params);
    }
  }

  static listen(evt, callback) {
    if (!this.functions[evt]) {
      this.functions[evt] = [];
    }
    this.functions[evt].push(callback);
  }
}