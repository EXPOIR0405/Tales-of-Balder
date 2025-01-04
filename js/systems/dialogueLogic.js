export class DialogueLogic {
    constructor(gameState) {
        this.gameState = gameState;
    }

    checkCondition(condition) {
        if (!condition) return true;
        
        switch(condition.conditionType) {
            case 'always':
                return true;
            case 'hasGold':
                return this.gameState.gold >= condition.requiredGold;
            default:
                return true;
        }
    }

    executeAction(action) {
        if (!action) return null;
        
        switch(action.actionType) {
            case 'buyItem':
                return this.buyItem(action.itemId, action.cost);
            case 'payForInfo':
                return this.payForInfo(action.cost, action.resultText);
            case 'rentRoom':
                return this.rentRoom(action.cost);
            case 'buyFood':
                return this.buyFood(action.itemId, action.cost);
            case 'showText':
                return { 
                    text: action.resultText,
                    next: action.next
                };
            case 'endDialogue':
                return { shouldEnd: true };
            default:
                return null;
        }
    }

    buyItem(itemId, cost) {
        if (this.gameState.gold < cost) {
            return {
                text: "돈이 부족하잖아, 친구. 다시 올 때는 주머니를 꽉 채워오라고.",
                next: "tom_greeting"
            };
        }

        // 임시로 인벤토리 체크 (나중에 실제 인벤토리 시스템으로 교체)
        const hasSpace = true; // 실제 구현에서는 인벤토리 공간 체크
        
        if (hasSpace) {
            this.gameState.gold -= cost;
            return {
                text: "좋은 거래야! 너도 만족하겠지",
                next: "tom_shop"
            };
        }
        
        return {
            text: "인벤토리 공간이 부족하네요...",
            next: "tom_shop"
        };
    }

    payForInfo(cost, resultText) {
        if (this.gameState.gold < cost) {
            return {
                text: "공짜로 들으려고? 정보는 공짜가 아니야.",
                next: "tom_cannot"
            };
        }

        this.gameState.gold -= cost;
        return { 
            text: resultText,
            next: "tom_greeting"
        };
    }

    rentRoom(cost) {
        if (this.gameState.gold < cost) {
            return {
                text: "죄송합니다만... 돈이 부족하신 것 같네요.",
                next: "kaerun_greeting"
            };
        }

        this.gameState.gold -= cost;
        // 체력 회복 로직 추가 (게임 시스템에 따라 조정 필요)
        if (this.gameState.health) {
            this.gameState.health = this.gameState.maxHealth || 100;
        }

        return {
            text: "편안히 쉬셨나요? 충분한 휴식이 되셨길 바랍니다...",
            next: "kaerun_greeting"
        };
    }

    buyFood(itemId, cost) {
        if (this.gameState.gold < cost) {
            return {
                text: "죄송합니다만... 돈이 부족하신 것 같네요.",
                next: "kaerun_greeting"
            };
        }

        this.gameState.gold -= cost;
        
        // 음식 효과 적용
        switch(itemId) {
            case 'evernight_soup':
                // 체력 회복 +30
                if (this.gameState.health) {
                    this.gameState.health = Math.min(
                        this.gameState.health + 30,
                        this.gameState.maxHealth || 100
                    );
                }
                return {
                    text: "깊은 맛이 나는 스프입니다... 드로우의 비밀 레시피를 조금 변형했죠. (체력 +30 회복)",
                    next: "kaerun_greeting"
                };
            
            case 'luminate_tea':
                // 마나 회복 +20
                if (this.gameState.mana) {
                    this.gameState.mana = Math.min(
                        this.gameState.mana + 20,
                        this.gameState.maxMana || 100
                    );
                }
                return {
                    text: "달빛을 닮은 차입니다... 마음이 편안해질 거예요. (마나 +20 회복)",
                    next: "kaerun_greeting"
                };
            
            default:
                return {
                    text: "맛있게 드셨나요...?",
                    next: "kaerun_greeting"
                };
        }
    }
} 