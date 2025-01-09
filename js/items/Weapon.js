// 무기 기본 클래스

export class Weapon { 
    constructor(config) {
        this.name = config.name;
        this.type = config.type;  // 'sword', 'axe', 'bow' 중 하나
        this.damage = config.damage;
        this.imagePath = config.imagePath;
        this.effects = config.effects || [];  // 특수 효과 배열
        
        // 무기 타입별 특성
        this.range = config.range || 1;  // 기본 공격 범위
        this.attackSpeed = config.attackSpeed || 1;  // 공격 속도
        this.weight = config.weight || 1;  // 무기 무게
    }

    // 기본 공격 메서드
    attack(target) {
        // 기본 데미지 계산
        let totalDamage = this.calculateDamage();
        
        // 특수 효과 적용
        this.applyEffects(target);
        
        return totalDamage;
    }

    // 데미지 계산 메서드
    calculateDamage() {
        // 기본 데미지에 랜덤성 추가 (예: ±10%)
        const variation = 0.1;
        const randomFactor = 1 + (Math.random() * variation * 2 - variation);
        return Math.floor(this.damage * randomFactor);
    }

    // 특수 효과 적용 메서드
    applyEffects(target) {
        this.effects.forEach(effect => {
            if (Math.random() < effect.chance) {
                effect.apply(target);
            }
        });
    }
} 