import { Weapon } from '../Weapon.js';
import { BleedingEffect } from '../effects/BleedingEffect.js';

export class Sword extends Weapon {
    constructor(config) {
        // 검류의 기본 특성 설정
        const swordConfig = {
            ...config,
            type: 'sword',
            attackSpeed: config.attackSpeed || 1.2,  // 기본보다 20% 빠른 공격속도
            effects: [...(config.effects || []), new BleedingEffect()],  // 출혈 효과 추가
        };
        
        super(swordConfig);
    }

    // 검류 특수 공격: 연속 베기
    async specialAttack(target) {
        const hits = 2;  // 기본 2회 공격
        let totalDamage = 0;

        for (let i = 0; i < hits; i++) {
            const damage = this.calculateDamage() * 0.7;  // 각 히트는 기본 공격의 70%
            totalDamage += damage;
            this.applyEffects(target);
            
            if (i < hits - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));  // 연속 공격 간 딜레이
            }
        }

        return totalDamage;
    }
}

// 구체적인 검 종류들 정의
export class ShortSword extends Sword {
    constructor() {
        super({
            name: '숏소드',
            damage: 15,
            weight: 1,
            attackSpeed: 1.3,
            imagePath: '/assets/images/weapons/swords/short-sword.png'
        });
    }
}

export class LongSword extends Sword {
    constructor() {
        super({
            name: '롱소드',
            damage: 20,
            weight: 1.5,
            attackSpeed: 1.1,
            imagePath: '/assets/images/weapons/swords/long-sword.png'
        });
    }
}

export class GreatSword extends Sword {
    constructor() {
        super({
            name: '그레이트소드',
            damage: 30,
            weight: 2.5,
            attackSpeed: 0.8,
            imagePath: '/assets/images/weapons/swords/great-sword.png'
        });
    }
} 