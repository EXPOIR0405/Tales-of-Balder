import { GameState } from './systems/gameState.js';
import { GameUI } from './ui/gameUI.js';
import { DialogueSystem } from './systems/dialogueSystem.js';
import { OpeningSystem } from './systems/openingSystem.js';

class Game {
    constructor() {
        this.state = new GameState();
       this.ui = new GameUI(this);
        this.dialogue = new DialogueSystem(this.state);
        this.opening = new OpeningSystem(this);
        
        this.state.setUI(this.ui);
    }

    async start() {
        console.log('Starting game...');
        await this.opening.start();
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
window.game.start();