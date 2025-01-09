import { Weapon } from '../Weapon.js';
import { StunEffect } from '../effects/StunEffect.js';

export class Axe extends Weapon {
    constructor(config) {
        // 도끼류의 기본 특성 설정
        const axeConfig = {
            ...config,
            type: 'axe',
            attackSpeed: config.attackSpeed || 0.7,  // 기본보다 30% 느린 공격속도
            effects: [...(config.effects || []), new StunEffect()],  // 스턴 효과 추가
        };
        
        super(axeConfig);
    }

    // 도끼류 특수 공격: 강력한 내려찍기
    async specialAttack(target) {
        // 특수 공격은 느리지만 매우 강력
        await new Promise(resolve => setTimeout(resolve, 1500));  // 1.5초 딜레이
        
        const damage = this.calculateDamage() * 2.5;  // 250% 데미지
        this.applyEffects(target);
        
        // 특수 공격 시 스턴 확률 증가
        const stunEffect = new StunEffect(0.5);  // 50% 확률로 스턴
        stunEffect.apply(target);
        
        return damage;
    }

    // 데미지 계산 오버라이드 (치명타 확률 증가)
    calculateDamage() {
        const baseDamage = super.calculateDamage();
        // 30% 확률로 치명타 (1.5배 데미지)
        if (Math.random() < 0.3) {
            console.log('치명타!');
            return Math.floor(baseDamage * 1.5);
        }
        return baseDamage;
    }
}

// 구체적인 도끼 종류들 정의
export class HandAxe extends Axe {
    constructor() {
        super({
            name: '핸드액스',
            damage: 18,
            weight: 1.5,
            attackSpeed: 0.8,
            imagePath: '/assets/images/weapons/axes/hand-axe.png'
        });
    }
}

export class BattleAxe extends Axe {
    constructor() {
        super({
            name: '배틀액스',
            damage: 25,
            weight: 2.5,
            attackSpeed: 0.6,
            imagePath: '/assets/images/weapons/axes/battle-axe.png'
        });
    }
} 