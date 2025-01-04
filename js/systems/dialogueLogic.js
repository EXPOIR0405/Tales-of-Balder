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
            case 'showText':
                return { text: action.resultText };
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
} 