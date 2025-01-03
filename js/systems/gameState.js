// 게임 상태 관리(hp, 골드, 인벤토리, 현재 위치 정보, 위치 변경 처리)

import { locations } from '../data/locations.js';

export class GameState {
    constructor() {
        this.gold = 0;
        this.inventory = [];
        this.hp = 100;
        this.maxHp = 100;
        this.currentLocation = null;
        this.currentLocationId = null;
        this.ui = null;
        this.currentNPC = null;
        this.currentDialogue = null;
        this.game = null;
    }

    setUI(ui) {
        this.ui = ui;
    }

    setGame(game) {
        this.game = game;
    }

    setLocation(locationId, keepDialogue = false) {
        console.log('===== Location Change =====');
        console.log('Previous state:', {
            location: this.currentLocationId,
            npc: this.currentNPC,
            dialogue: this.currentDialogue
        });
        
        if (locations[locationId]) {
            this.currentLocation = locations[locationId];
            this.currentLocationId = locationId;
            
            if (!keepDialogue) {
                this.currentNPC = null;
                this.currentDialogue = null;
            }
            
            console.log('New state:', {
                location: locationId,
                npc: this.currentNPC,
                dialogue: this.currentDialogue,
                fullLocation: this.currentLocation
            });
        }
    }

    setDialogueState(npcId, dialogueId) {
        console.log('Setting dialogue state:', { npc: npcId, dialogue: dialogueId });
        this.currentNPC = npcId;
        this.currentDialogue = dialogueId;
    }

    loadGame(saveData) {
        console.log('===== Loading Game =====');
        console.log('Save data to load:', saveData);
        
        if (saveData) {
            // 기본 데이터 복원
            this.gold = saveData.gold;
            this.inventory = saveData.inventory;
            this.hp = saveData.hp;
            this.maxHp = saveData.maxHp;
            
            // 대화 상태 복원 (안전하게 체크)
            if (saveData.currentNPC && saveData.currentDialogue) {
                this.setDialogueState(saveData.currentNPC, saveData.currentDialogue);
                
                // 이전 위치 복원 (game.dialogue가 있을 때만)
                if (saveData.previousLocation && this.game && this.game.dialogue) {
                    this.game.dialogue.previousLocation = saveData.previousLocation;
                }
            }
            
            // 위치 설정
            this.setLocation(saveData.currentLocationId, true);
            
            // 대화 복원 (game.dialogue가 있을 때만)
            if (this.currentNPC && this.currentDialogue && this.game && this.game.dialogue) {
                console.log('Restoring dialogue state');
                this.game.dialogue.restoreDialogue(
                    this.currentNPC,
                    this.currentDialogue
                );
            }
            
            return true;
        }
        return false;
    }

    saveGame() {
        // 기본 저장 데이터
        const saveData = {
            gold: this.gold,
            inventory: this.inventory,
            hp: this.hp,
            maxHp: this.maxHp,
            currentLocationId: this.currentLocationId,
            currentNPC: this.currentNPC,
            currentDialogue: this.currentDialogue
        };

        // NPC 위치 저장 시도 (안전하게 체크)
        if (this.game && this.game.dialogue && 
            this.currentNPC && 
            this.game.dialogue.npcLocations && 
            this.game.dialogue.npcLocations[this.currentNPC]) {
            
            saveData.currentLocationId = this.game.dialogue.npcLocations[this.currentNPC].id;
            saveData.previousLocation = this.game.dialogue.previousLocation;
            console.log('Saving with NPC location:', saveData.currentLocationId);
        }

        console.log('===== Saving Game =====');
        console.log('Current game state:', saveData);
        
        return saveData;
    }
}