import { GameState } from './systems/gameState.js';
import { GameUI } from './ui/gameUI.js';
import { DialogueSystem } from './systems/dialogueSystem.js';  // 추가

class Game {
    constructor() {
        this.state = new GameState(); // UI 없이 먼저 생성
        this.ui = new GameUI(this);
        this.dialogue = new DialogueSystem(this.state);
        
        // GameState에 UI 참조 추가
        this.state.setUI(this.ui);
    }

    init() {
        console.log('Game initializing...');
        this.ui.init();
        this.state.setLocation('start');
        this.ui.updateUI();
        this.ui.showChoices(this.state.currentLocation.choices);
    }

    handleLocationChange(result) {
        if (typeof result === 'string') {
            this.state.setLocation(result);
            this.ui.updateUI();
            this.ui.showChoices(this.state.currentLocation.choices);
        } else if (result && typeof result === 'object') {
            if (result.gold) {
                this.state.gold += result.gold;
            }
            if (result.description) {
                this.ui.elements.descriptionText.textContent = result.description;
            }
            // 현재 위치의 선택지를 다시 표시
            this.ui.showChoices(this.state.currentLocation.choices);
        }
    }
}

window.game = new Game();
window.game.init();