export class GameUI {
    constructor(game) {
        this.game = game;
        this.elements = {};
    }

    // 대화 업데이트 함수 추가
    updateDialog(npcName, text, choices) {
        this.elements.locationTitle.textContent = npcName;
        this.elements.descriptionText.textContent = text;

        // NPC 이미지 업데이트
        const npcImage = document.getElementById('npc-image');
        const npcData = Object.values(this.game.dialogue.dialogues).find(
            npc => npc.name === npcName
        );

        if (npcData && npcData.image) {
            npcImage.style.backgroundImage = `url('${npcData.image}')`;
            npcImage.classList.remove('hidden');
        } else {
            npcImage.classList.add('hidden');
        }

        // 대화창 제목 업데이트
        this.elements.locationTitle.textContent = npcName;
        
        // 대화 내용 업데이트
        this.elements.descriptionText.textContent = text;

        //골드 상태 업데이트
        document.getElementById('player-gold').textContent = this.game.state.gold;
        
        // 선택지 업데이트
        this.elements.choicesContainer.innerHTML = '';
        if (choices) {
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = choice.text;
                button.onclick = () => {
                    if (choice.action) {
                        const result = choice.action();
                        if (result && result.next) {
                            //action의 결과로 받은 텍스트와 다음 대화 데이터를 업데이트
                            this.elements.descriptionText.textContent = result.text;
                            if (result.next) {
                                this.game.dialogue.showDialogue(result.next);
                            }
                        }
                    } else if (choice.next) {
                        this.game.dialogue.showDialogue(choice.next);
                    }
                };
                this.elements.choicesContainer.appendChild(button);
            });
        }
    }

    // 대화창 닫기 함수 추가
    closeDialog() {
        // 대화가 끝난 후 NPC 이미지 숨기기
        const npcImage = document.getElementById('npc-image');
        npcImage.classList.add('hidden');
    
        // 대화가 끝난 후 원래 위치 정보로 되돌리기
        this.updateUI();
        this.showChoices(this.game.state.currentLocation.choices);
    }

    init() {
        // 메인 UI 구조 생성
        document.getElementById('game-container').innerHTML = `
            <div class="game-container">
                <!-- 상단 상태바 -->
                <div class="fixed top-4 left-4 right-4 flex justify-between items-center">
                    <div class="status-bar-container">
                        <div class="text-bg3-gold mb-1">HP: <span id="player-hp">100/100</span></div>
                        <div class="text-bg3-gold mb-1">Gold: <span id="player-gold">0</span></div>
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
                        <div class="flex items-start gap-4">
                            <div id="npc-image" class="npc-portrait hidden"></div>
                            <p id="description-text"></p>
                        </div>
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
            </div>
        `;

        // 요소 참조 저장 - 콘솔로그 추가
        this.elements = {
            playerHp: document.getElementById('player-hp'),
            hpBar: document.getElementById('hp-bar'),
            locationTitle: document.getElementById('location-title'),
            descriptionText: document.getElementById('description-text'),
            choicesContainer: document.getElementById('choices-container'),
            saveButton: document.getElementById('save-button'),
            loadButton: document.getElementById('load-button')
        };

        console.log('Save button:', this.elements.saveButton); // 디버깅
        console.log('Load button:', this.elements.loadButton); // 디버깅

        // 저장/불러오기 버튼 이벤트 리스너
        const saveButton = document.getElementById('save-button');
        const loadButton = document.getElementById('load-button');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                console.log('Save button clicked');
                this.showSaveLoadWindow('save');
            });
        }

        if (loadButton) {
            loadButton.addEventListener('click', () => {
                console.log('Load button clicked');
                this.showSaveLoadWindow('load');
            });
        }

        // 이벤트 리스너 설정
        document.getElementById('inventory-button').addEventListener('click', () => {
            alert('인벤토리는 아직 구현되지 않았습니다.');
        });

        // HP 표시 업데이트
        this.updateHP();
    }


    updateHP() {
        if (this.game && this.game.state) {
            const hp = this.game.state.hp || 0;
            const maxHp = this.game.state.maxHp || 100;
            if (this.elements.playerHp) {
                this.elements.playerHp.textContent = `${hp}/${maxHp}`;
            }
            if (this.elements.hpBar) {
                this.elements.hpBar.style.width = `${(hp / maxHp) * 100}%`;
            }
        }
    }

    // 전반적인 UI 업데이트하는 메인함수 (위치, 설명 텍스트, HP, 골드)
    updateUI() {
        const state = this.game.state;
        if (state.currentLocation) {  // null 체크 추가
            this.elements.locationTitle.textContent = state.currentLocation.title || '';
            this.elements.descriptionText.textContent = state.currentLocation.description || '';
            this.elements.playerHp.textContent = `${state.hp}/${state.maxHp}`;
            document.getElementById('player-gold').textContent = state.gold || 0;
        }
    }

    showChoices(choices) {
        if (!choices) return;  // null 체크 추가
        
        this.elements.choicesContainer.innerHTML = '';
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => choice.action();
            this.elements.choicesContainer.appendChild(button);
        });
    }

    showSaveLoadWindow(mode = 'save') {
        console.log('Creating save/load window');
        
        const isSave = mode === 'save';
        const title = isSave ? '저장하기' : '불러오기';
        
        // 기존 창이 있다면 제거
        this.closeSaveLoadWindow();
        
        // 기존 저장 데이터 불러오기
        const saves = JSON.parse(localStorage.getItem('gameSaves') || '{}');
        
        // div 요소 직접 생성
        const windowElement = document.createElement('div');
        windowElement.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
        
        windowElement.innerHTML = `
            <div class="bg-bg3-dark border-2 border-bg3-gold/50 p-4 max-w-md w-full">
                <h2 class="text-bg3-gold text-xl mb-4">${title}</h2>
                <div class="space-y-2 mb-4">
                    ${Array(3).fill(0).map((_, i) => {
                        const save = saves[`slot${i + 1}`];
                        const date = save ? new Date(save.timestamp).toLocaleString() : '비어있음';
                        const details = save ? `Gold: ${save.gold} | HP: ${save.hp}/${save.maxHp}` : '';
                        return `
                            <div class="flex items-center gap-2">
                                <button class="save-slot flex-grow text-left p-2 border border-bg3-gold/30 hover:bg-bg3-gold/20"
                                        data-slot="${i + 1}">
                                    저장 슬롯 ${i + 1}
                                    <div class="text-sm text-gray-400">${date}</div>
                                    <div class="text-sm text-bg3-gold">${details}</div>
                                </button>
                                ${save ? `
                                    <button class="delete-slot bg-red-500/50 hover:bg-red-500 text-white px-2 py-1 rounded"
                                            data-slot="${i + 1}">삭제</button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <button class="close-window menu-button">닫기</button>
            </div>
        `;

        // 창을 body에 추가
        document.body.appendChild(windowElement);

        // 이벤트 리스너 추가
        const self = this;
        
        // 저장/불러오기 버튼
        windowElement.querySelectorAll('.save-slot').forEach(button => {
            button.addEventListener('click', function() {
                const slot = this.dataset.slot;
                if (isSave && saves[`slot${slot}`]) {
                    if (confirm('이미 저장된 데이터가 있습니다. 덮어쓰시겠습니까?')) {
                        self.handleSaveLoad(slot, mode);
                    }
                } else {
                    self.handleSaveLoad(slot, mode);
                }
            });
        });

        // 삭제 버튼
        windowElement.querySelectorAll('.delete-slot').forEach(button => {
            button.addEventListener('click', function() {
                const slot = this.dataset.slot;
                if (confirm('정말로 이 저장 데이터를 삭제하시겠습니까?')) {
                    delete saves[`slot${slot}`];
                    localStorage.setItem('gameSaves', JSON.stringify(saves));
                    self.showSaveLoadWindow(mode); // 창 새로고침
                }
            });
        });

        // 닫기 버튼
        const closeButton = windowElement.querySelector('.close-window');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeSaveLoadWindow();
            });
        }
    }

    handleSaveLoad(slot, mode) {
        const saves = JSON.parse(localStorage.getItem('gameSaves') || '{}');
        
        if (mode === 'save') {
            // 현재 게임 상태 저장
            const saveData = this.game.state.saveGame(); // saveGame 메서드 사용
            saveData.timestamp = Date.now();
            saves[`slot${slot}`] = saveData;
            localStorage.setItem('gameSaves', JSON.stringify(saves));
            alert(`슬롯 ${slot}에 저장되었습니다!`);
        } else {
            // 저장된 데이터 불러오기
            const saveData = saves[`slot${slot}`];
            if (saveData) {
                // loadGame 메서드 사용
                if (this.game.state.loadGame(saveData)) {
                    this.updateUI();
                    if (this.game.state.currentLocation) {
                        this.showChoices(this.game.state.currentLocation.choices);
                    }
                    alert(`슬롯 ${slot}에서 불러왔습니다!`);
                }
            }
        }
        
        this.closeSaveLoadWindow();
    }

    closeSaveLoadWindow() {
        const existingWindow = document.querySelector('.fixed.inset-0');
        if (existingWindow) {
            existingWindow.remove();
        }
    }
}