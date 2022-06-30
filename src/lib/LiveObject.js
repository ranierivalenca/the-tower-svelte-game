// https://javascript.info/mixins
// https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/#bettermixinsthroughclassexpressions

export default (superclass) => class extends superclass {
  constructor(hp, ...args) {
    super(...args);
    this.hp = hp;
    this.maxHp = hp;
  }

  isAlive() {
    return this.hp > 0;
  }

  damagedBy(damage) {
    this.hp -= damage;
  }
}