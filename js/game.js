import { GameState } from './gameState.js';
import { GameUI } from './gameUI.js';
import { DialogueSystem } from './systems/dialogueSystem.js';

export class Game {
    constructor() {
        console.log('Game initializing...');
        this.gameState = new GameState(this);
        this.ui = new GameUI(this);
        this.dialogue = new DialogueSystem(this.gameState);
        
        window.game = this;
        console.log('Game initialized with dialogue system:', this.dialogue);
    }

    init() {
        this.gameState.init();
        this.ui.init();
        // 초기 위치 설정
        this.handleLocationChange('start');
    }

    handleLocationChange(location) {
        if (typeof location === 'string') {
            this.gameState.setLocation(location);
        } else {
            // 특별한 이벤트 처리 (예: 골드 획득)
            if (location.gold) {
                this.gameState.gold += location.gold;
            }
            if (location.description) {
                this.ui.updateText(location.description);
            }
        }
    }
} 