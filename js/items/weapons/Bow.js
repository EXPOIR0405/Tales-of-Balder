import { Weapon } from '../Weapon.js';
import { PierceEffect } from '../effects/PierceEffect.js';

export class Bow extends Weapon {
    constructor(config) {
        // 활류의 기본 특성 설정
        const bowConfig = {
            ...config,
            type: 'bow',
            range: config.range || 5,  // 기본 사거리 5
            attackSpeed: config.attackSpeed || 0.8,  // 기본보다 20% 느린 공격속도
            effects: [...(config.effects || []), new PierceEffect()],  // 관통 효과 추가
        };
        
        super(bowConfig);
        this.arrowCount = config.arrowCount || 20;  // 기본 화살 수
    }

    // 화살 소비 확인
    canAttack() {
        return this.arrowCount > 0;
    }

    // 기본 공격 오버라이드 (화살 소비 추가)
    attack(target) {
        if (!this.canAttack()) {
            console.log("화살이 부족합니다!");
            return 0;
        }

        this.arrowCount--;
        return super.attack(target);
    }

    // 활류 특수 공격: 차지 샷
    async specialAttack(target) {
        if (!this.canAttack()) {
            console.log("화살이 부족합니다!");
            return 0;
        }

        this.arrowCount--;
        const chargeTime = 1000;  // 1초 차징
        await new Promise(resolve => setTimeout(resolve, chargeTime));
        
        const damage = this.calculateDamage() * 2;  // 2배 데미지
        this.applyEffects(target);
        
        return damage;
    }

    // 화살 보충
    addArrows(count) {
        this.arrowCount += count;
        console.log(`화살이 ${count}개 추가되었습니다. 현재 화살: ${this.arrowCount}개`);
    }
}

// 구체적인 활 종류들 정의
export class ShortBow extends Bow {
    constructor() {
        super({
            name: '숏보우',
            damage: 12,
            weight: 1,
            range: 4,
            attackSpeed: 1.0,
            arrowCount: 30,
            imagePath: '/assets/images/weapons/bows/short-bow.png'
        });
    }
}

export class LongBow extends Bow {
    constructor() {
        super({
            name: '롱보우',
            damage: 18,
            weight: 1.5,
            range: 6,
            attackSpeed: 0.7,
            arrowCount: 25,
            imagePath: '/assets/images/weapons/bows/long-bow.png'
        });
    }
} 