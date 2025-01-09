export class BleedingEffect {
    constructor() {
        this.name = '출혈';
        this.chance = 0.3;  // 30% 확률로 발동
        this.duration = 3;  // 3턴 지속
        this.damagePerTurn = 5;  // 턴당 5의 데미지
    }

    apply(target) {
        target.addEffect({
            name: this.name,
            duration: this.duration,
            onTurn: () => {
                target.takeDamage(this.damagePerTurn);
                console.log(`${target.name}이(가) 출혈로 ${this.damagePerTurn}의 데미지를 받았습니다.`);
            }
        });
    }
} 