export class GameUI {
    constructor(game) {
        this.game = game;
        this.elements = {};
    }

    init() {
        // 메인 UI 구조 생성
        document.getElementById('game-container').innerHTML = `
            <!-- 상단 상태바 -->
            <div class="fixed top-4 left-4 right-4 flex justify-between items-center">
                <div class="status-bar-container">
                    <div class="text-bg3-gold mb-1">HP: <span id="player-hp">100/100</span></div>
                    <div class="status-bar">
                        <div id="hp-bar" class="health-bar" style="width: 100%"></div>
                    </div>
                </div>
                
                <!-- 메뉴 버튼들 -->
                <div class="flex gap-2">
                    <button id="save-button" class="menu-button">저장</button>
                    <button id="load-button" class="menu-button">불러오기</button>
                    <button id="inventory-button" class="menu-button">인벤토리</button>
                </div>
            </div>

            <!-- 메인 게임 화면 -->
            <div class="max-w-2xl mx-auto mt-20 mb-32">
                <!-- 위치 정보 -->
                <h2 id="location-title" class="text-2xl font-serif mb-4 text-bg3-gold"></h2>
                
                <!-- 대화/설명창 -->
                <div id="dialogue-box" class="dialogue-box mb-4">
                    <p id="description-text"></p>
                </div>

                <!-- 선택지 컨테이너 -->
                <div id="choices-container" class="space-y-2"></div>
            </div>

            <!-- 하단 인벤토리 바 -->
            <div class="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-bg3-gold/30 p-2">
                <div id="quick-inventory" class="flex justify-center space-x-2">
                    ${Array(8).fill(0).map(() => `
                        <div class="inventory-slot"></div>
                    `).join('')}
                </div>
            </div>

            <!-- 모달 컨테이너 -->
            <div id="modal-container" class="modal hidden">
                <div class="modal-content">
                    <h3 id="modal-title" class="text-xl mb-4"></h3>
                    <div id="modal-content"></div>
                    <button id="modal-close" class="menu-button mt-4">닫기</button>
                </div>
            </div>
        `;

        // 요소 참조 저장
        this.elements = {
            playerHp: document.getElementById('player-hp'),
            hpBar: document.getElementById('hp-bar'),
            locationTitle: document.getElementById('location-title'),
            descriptionText: document.getElementById('description-text'),
            choicesContainer: document.getElementById('choices-container'),
            modalContainer: document.getElementById('modal-container'),
            modalTitle: document.getElementById('modal-title'),
            modalContent: document.getElementById('modal-content')
        };

        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // 저장 버튼
        document.getElementById('save-button').addEventListener('click', () => {
            this.showSaveModal();
        });

        // 불러오기 버튼
        document.getElementById('load-button').addEventListener('click', () => {
            this.showLoadModal();
        });

        // 인벤토리 버튼
        document.getElementById('inventory-button').addEventListener('click', () => {
            this.showInventory();
        });

        // 모달 닫기
        document.getElementById('modal-close').addEventListener('click', () => {
            this.hideModal();
        });
    }

    updateUI() {
        const state = this.game.state;
        
        // HP 업데이트
        this.elements.playerHp.textContent = `${state.hp}/${state.maxHp}`;
        this.elements.hpBar.style.width = `${(state.hp / state.maxHp) * 100}%`;

        // 위치 정보 업데이트
        this.elements.locationTitle.textContent = state.currentLocation.title;
        this.elements.descriptionText.textContent = state.currentLocation.description;
    }

    showChoices(choices) {
        this.elements.choicesContainer.innerHTML = '';
        
        choices.forEach(choice => {
            if (!choice.condition || choice.condition()) {
                const button = document.createElement('button');
                button.className = `choice-button ${choice.type === 'danger' ? 'danger' : ''}`;
                button.innerHTML = `<span class="mr-2">➤</span>${choice.text}`;
                button.addEventListener('click', () => choice.action());
                this.elements.choicesContainer.appendChild(button);
            }
        });
    }

    showModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalContent.innerHTML = content;
        this.elements.modalContainer.classList.remove('hidden');
    }

    hideModal() {
        this.elements.modalContainer.classList.add('hidden');
    }

    showSaveModal() {
        const saveSlots = Array(5).fill(0).map((_, i) => {
            const savedData = this.game.save.getSaveData(i + 1);
            return `
                <button class="choice-button mb-2" onclick="game.save.saveGame(${i + 1})">
                    슬롯 ${i + 1} ${savedData ? `- ${savedData.timestamp}` : '- 비어있음'}
                </button>
            `;
        }).join('');

        this.showModal('게임 저장', saveSlots);
    }

    showLoadModal() {
        const loadSlots = Array(5).fill(0).map((_, i) => {
            const savedData = this.game.save.getSaveData(i + 1);
            if (savedData) {
                return `
                    <button class="choice-button mb-2" onclick="game.save.loadGame(${i + 1})">
                        슬롯 ${i + 1} - ${savedData.timestamp}
                    </button>
                `;
            }
            return `
                <button class="choice-button mb-2" disabled>
                    슬롯 ${i + 1} - 비어있음
                </button>
            `;
        }).join('');

        this.showModal('게임 불러오기', loadSlots);
    }

    showInventory() {
        const inventory = this.game.state.inventory.map(item => `
            <div class="flex items-center justify-between p-2 border-b border-bg3-gold/30">
                <span>${item.name}</span>
                <button class="menu-button" onclick="game.useItem('${item.id}')">사용</button>
            </div>
        `).join('');

        this.showModal('인벤토리', inventory || '인벤토리가 비어있습니다.');
    }

    // 전투 UI 업데이트
    updateCombatUI(enemy) {
        if (enemy) {
            const enemyHealth = `
                <div class="mb-4">
                    <div class="text-bg3-gold mb-1">${enemy.name} HP: ${enemy.hp}/${enemy.maxHp}</div>
                    <div class="status-bar">
                        <div class="health-bar" style="width: ${(enemy.hp / enemy.maxHp) * 100}%"></div>
                    </div>
                </div>
            `;
            this.elements.descriptionText.innerHTML = enemyHealth + this.elements.descriptionText.innerHTML;
        }
    }
} 