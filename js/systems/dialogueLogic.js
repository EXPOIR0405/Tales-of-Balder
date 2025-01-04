import { ITEMS } from '../data/items.js';

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
                return this.buyFood(action.itemId, action.cost, action);
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

    buyFood(itemId, cost, choice) {
        if (this.gameState.gold < cost) {
            return {
                text: "죄송합니다만... 돈이 부족하신 것 같네요.",
                next: "kaerun_greeting"
            };
        }

        this.gameState.gold -= cost;
        
        // 아이템 데이터 가져오기
        const itemData = ITEMS[itemId];
        
        // 인벤토리에 아이템 추가
        const slots = document.querySelectorAll('.inventory-slot');
        const emptySlot = Array.from(slots).find(slot => !slot.querySelector('img'));
        
        if (emptySlot) {
            const img = document.createElement('img');
            img.src = itemData.image;
            img.alt = itemData.name;
            img.dataset.itemId = itemData.id;
            emptySlot.appendChild(img);
            
            // 툴팁 구조 개선
            const tooltip = document.createElement('div');
            tooltip.className = 'item-tooltip';
            
            // 이미지 섹션
            const imageSection = document.createElement('div');
            imageSection.className = 'tooltip-image';
            const tooltipImg = document.createElement('img');
            tooltipImg.src = itemData.image;
            tooltipImg.alt = itemData.name;
            imageSection.appendChild(tooltipImg);
            
            // 텍스트 섹션
            const textSection = document.createElement('div');
            textSection.className = 'tooltip-text';
            
            const title = document.createElement('div');
            title.className = 'tooltip-title';
            title.textContent = itemData.name;
            
            const description = document.createElement('div');
            description.className = 'tooltip-description';
            description.textContent = itemData.description;
            
            textSection.appendChild(title);
            textSection.appendChild(description);
            
            // 조립
            tooltip.appendChild(imageSection);
            tooltip.appendChild(textSection);
            emptySlot.appendChild(tooltip);
        }

        // JSON에서 정의된 resultText와 next를 그대로 반환
        return {
            text: choice.resultText,
            next: choice.next
        };
    }
} 