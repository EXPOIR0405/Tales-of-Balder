import { DiceSystem } from './DiceSystem.js';

export class CombatSystem {
    constructor(game) {
        this.game = game;
        this.participants = [];  // 전투 참가자들
        this.currentTurn = 0;
        this.isInCombat = false;
        this.diceSystem = new DiceSystem();
    }

    // 전투 시작
    startCombat(players, enemies) {
        this.isInCombat = true;
        this.participants = [...players, ...enemies];
        this.rollInitiative();
        this.startTurn();
    }

    // 이니셔티브 굴림
    rollInitiative() {
        this.participants.forEach(participant => {
            const initiative = this.diceSystem.rollD20() + participant.dexterity;
            participant.initiative = initiative;
        });
        // 이니셔티브 순서로 정렬
        this.participants.sort((a, b) => b.initiative - a.initiative);
    }

    // 턴 시작
    async startTurn() {
        if (!this.isInCombat) return;

        const currentParticipant = this.participants[this.currentTurn];
        
        // 상태 효과 처리
        await this.processEffects(currentParticipant);
        
        // 스턴 상태가 아닐 때만 행동 가능
        if (!currentParticipant.isStunned) {
            await this.processAction(currentParticipant);
        }

        // 다음 턴으로
        this.currentTurn = (this.currentTurn + 1) % this.participants.length;
        this.startTurn();
    }

    // 공격 실행
    async executeAttack(attacker, defender, weapon) {
        // 명중 판정
        const attackRoll = this.diceSystem.rollD20();
        const hitDC = 10 + defender.dexterity;  // 기본 방어도

        if (attackRoll === 20) {  // 크리티컬 히트
            const damage = weapon.calculateDamage() * 2;
            await this.applyDamage(defender, damage, true);
        } else if (attackRoll === 1) {  // 크리티컬 미스
            console.log('크리티컬 미스!');
            return;
        } else if (attackRoll + attacker.attackBonus >= hitDC) {
            const damage = weapon.calculateDamage();
            await this.applyDamage(defender, damage, false);
        } else {
            console.log('공격 빗나감!');
        }
    }

    // 데미지 적용
    async applyDamage(target, damage, isCritical) {
        const finalDamage = Math.max(1, damage - target.defense);
        target.health -= finalDamage;

        // 데미지 표시 애니메이션
        await this.showDamageAnimation(target, finalDamage, isCritical);

        // 사망 처리
        if (target.health <= 0) {
            await this.handleDeath(target);
        }
    }

    // 상태 효과 처리
    async processEffects(participant) {
        for (const effect of participant.effects) {
            await effect.onTurn();
            effect.duration--;
            if (effect.duration <= 0) {
                effect.onRemove();
                participant.effects = participant.effects.filter(e => e !== effect);
            }
        }
    }

    // 전투 종료 체크
    checkCombatEnd() {
        const alivePlayers = this.participants.filter(p => p.isPlayer && p.health > 0);
        const aliveEnemies = this.participants.filter(p => !p.isPlayer && p.health > 0);

        if (alivePlayers.length === 0) {
            this.endCombat('defeat');
        } else if (aliveEnemies.length === 0) {
            this.endCombat('victory');
        }
    }

    // 전투 종료
    endCombat(result) {
        this.isInCombat = false;
        // 전투 결과에 따른 처리
        if (result === 'victory') {
            this.handleVictory();
        } else {
            this.handleDefeat();
        }
    }
} 