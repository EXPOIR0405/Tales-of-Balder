import { Enemy, createTestEnemy } from '../entities/Enemy.js';
import { HandAxe } from '../items/weapons/Axe.js';

export class EncounterSystem {
    constructor(game) {
        this.game = game;
        this.combatSystem = game.combatSystem;
    }

    // 전투 선택지 UI 표시
    showEncounterChoice() {
        const choiceContainer = document.createElement('div');
        choiceContainer.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';
        
        const choiceBox = document.createElement('div');
        choiceBox.className = 'bg-gray-800 p-6 rounded-lg text-white text-center';
        choiceBox.innerHTML = `
            <h2 class="text-2xl mb-4">고블린과 마주쳤다!</h2>
            <div class="mb-4">
                <img src="/assets/images/enemies/goblin.png" alt="고블린" 
                     class="w-32 h-32 object-contain mx-auto">
            </div>
            <div class="flex gap-4 justify-center">
                <button id="fight-btn" 
                        class="px-4 py-2 bg-bg3-gold hover:bg-yellow-600 rounded transition-colors">
                    전투 시작
                </button>
                <button id="flee-btn" 
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors">
                    도망가기
                </button>
            </div>
        `;

        choiceContainer.appendChild(choiceBox);
        document.body.appendChild(choiceContainer);

        // 버튼 이벤트 리스너
        document.getElementById('fight-btn').onclick = () => {
            this.startCombat();
            choiceContainer.remove();
        };

        document.getElementById('flee-btn').onclick = () => {
            this.flee();
            choiceContainer.remove();
        };
    }

    // 전투 시작
    startCombat() {
        const enemy = createTestEnemy();
        this.combatSystem.startCombat([this.game.player], [enemy]);
    }

    // 도망
    flee() {
        // 도망 성공 확률 계산 (플레이어의 민첩성 영향)
        const fleeChance = 0.5 + (this.game.player.dexterity * 0.1);
        if (Math.random() < fleeChance) {
            this.game.ui.showMessage('도망치는데 성공했다!');
        } else {
            this.game.ui.showMessage('도망치지 못했다!');
            this.startCombat();
        }
    }
} 