import { GameState } from './systems/gameState.js';
import { GameUI } from './ui/gameUI.js';

class Game {
    constructor() {
        this.state = new GameState();
        this.ui = new GameUI(this);
    }

    init() {
        console.log('Game initializing...');
        this.ui.init();
        this.state.setLocation('start');
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
        }
    }
}

window.game = new Game();
window.game.init(); 