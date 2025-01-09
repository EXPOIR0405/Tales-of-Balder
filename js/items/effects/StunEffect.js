export class StunEffect {
    constructor(chance = 0.2) {  // 기본 20% 확률, but 변경 가능
        this.name = '스턴';
        this.chance = chance;
        this.duration = 1;  // 1턴 지속
    }

    apply(target) {
        target.addEffect({
            name: this.name,
            duration: this.duration,
            onApply: () => {
                target.isStunned = true;
                console.log(`${target.name}이(가) 스턴에 걸렸습니다!`);
            },
            onRemove: () => {
                target.isStunned = false;
                console.log(`${target.name}의 스턴이 해제되었습니다.`);
            },
            onTurn: () => {
                console.log(`${target.name}은(는) 스턴 상태여서 행동할 수 없습니다.`);
                return false;  // 턴 스킵
            }
        });
    }
} 