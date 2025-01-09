import { ShortSword } from '../items/weapons/Sword.js';

export class Player {
    constructor() {
        this.name = '타른';  // 기본 이름
        this.health = 100;
        this.maxHealth = 100;
        this.defense = 5;
        this.dexterity = 3;
        this.weapon = new ShortSword();
        this.effects = [];
        this.isPlayer = true;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }

    addEffect(effect) {
        this.effects.push(effect);
    }
} 