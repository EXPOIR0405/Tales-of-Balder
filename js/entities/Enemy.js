import { HandAxe } from '../items/weapons/Axe.js';

export class Enemy {
    constructor(config) {
        this.id = 'enemy-' + Math.random().toString(36).substr(2, 9);
        this.name = config.name;
        this.health = config.health;
        this.maxHealth = config.health;
        this.defense = config.defense || 0;
        this.dexterity = config.dexterity || 0;
        this.weapon = config.weapon;
        this.effects = [];
        this.isPlayer = false;
        this.imagePath = config.imagePath;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }

    addEffect(effect) {
        this.effects.push(effect);
    }
}

// 테스트용 적 생성 함수
export function createTestEnemy() {
    return new Enemy({
        name: '고블린',
        health: 30,
        defense: 2,
        dexterity: 2,
        weapon: new HandAxe(),
        imagePath: '/assets/images/enemies/goblin.png'
    });
}