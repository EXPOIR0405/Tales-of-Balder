export class DiceSystem {
    constructor() {
        this.diceTypes = [4, 6, 8, 10, 12, 20];
    }

    // 기본 주사위 굴림
    rollDice(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    // D20 굴림
    rollD20() {
        return this.rollDice(20);
    }

    // 여러 개의 주사위 굴림 (예: 2d6)
    rollMultiple(count, sides) {
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += this.rollDice(sides);
        }
        return total;
    }

    // 어드밴티지 굴림 (2번 굴리고 높은 값 선택)
    rollWithAdvantage() {
        const roll1 = this.rollD20();
        const roll2 = this.rollD20();
        return Math.max(roll1, roll2);
    }

    // 디스어드밴티지 굴림 (2번 굴리고 낮은 값 선택)
    rollWithDisadvantage() {
        const roll1 = this.rollD20();
        const roll2 = this.rollD20();
        return Math.min(roll1, roll2);
    }

    // 주사위 굴림 애니메이션 (UI 구현 필요)
    async animateRoll(sides) {
        // 애니메이션 구현
        return new Promise(resolve => {
            // 애니메이션 후 결과 반환
            const result = this.rollDice(sides);
            resolve(result);
        });
    }
} 