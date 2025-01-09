export class PierceEffect {
    constructor() {
        this.name = '관통';
        this.chance = 0.2;  // 20% 확률로 발동
        this.armorPierceAmount = 5;  // 방어력 관통량
    }

    apply(target) {
        const originalDefense = target.defense || 0;
        target.addEffect({
            name: this.name,
            duration: 1,  // 1턴 지속
            onApply: () => {
                target.defense = Math.max(0, originalDefense - this.armorPierceAmount);
                console.log(`${target.name}의 방어력이 ${this.armorPierceAmount}만큼 감소했습니다.`);
            },
            onRemove: () => {
                target.defense = originalDefense;
            }
        });
    }
} 