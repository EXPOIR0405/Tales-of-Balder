import { DialogueLogic } from './dialogueLogic.js';

export class DialogueSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.dialogues = {};
        console.log('DialogueSystem initialized');
        this.logic = new DialogueLogic(gameState);
        this.loadDialogues();
    }

    async loadDialogues() {
        try {
            console.log('Loading dialogues...');
            
            // 케이런 대화 데이터 로드
            const innkeeperResponse = await fetch('./js/data/dialogues/innkeeper.json');
            if (!innkeeperResponse.ok) {
                throw new Error(`HTTP error! status: ${innkeeperResponse.status}`);
            }
            const innkeeperData = await innkeeperResponse.json();
            console.log('Loaded innkeeper data:', innkeeperData);  // 로그 추가
            this.dialogues.kaerun = innkeeperData;
            
            // 상인 대화 데이터 로드
            const merchantResponse = await fetch('./js/data/dialogues/merchant.json');
            if (!merchantResponse.ok) {
                throw new Error(`HTTP error! status: ${merchantResponse.status}`);
            }
            const merchantData = await merchantResponse.json();
            this.dialogues.tom = merchantData;
            
            console.log('All loaded dialogues:', this.dialogues);  // 로그 추가
        } catch (error) {
            console.error('Error loading dialogues:', error);
        }
    }

    startDialogue(npcId) {
        console.log('Starting dialogue with NPC:', npcId);
        console.log('Current dialogues state:', this.dialogues);
        
        const npcData = this.dialogues[npcId];
        if (!npcData) {
            console.error('No dialogue found for NPC:', npcId);
            return;
        }
        
        this.currentNPC = npcData;
        
        // NPC 이미지 업데이트
        const npcImage = document.getElementById('npc-image');
        npcImage.src = npcData.image;
        npcImage.classList.remove('hidden');
        
        this.showDialogue(npcData.initialDialog);
    }

    showDialogue(dialogId) {
        const dialogue = this.currentNPC.conversations[dialogId];
        if (!dialogue) return;

        // NPC 이미지 처리
        const npcImage = document.getElementById('npc-image');
        
        // 임시 이미지가 있는 경우 (음식 등)
        if (dialogue.tempImage) {
            npcImage.src = dialogue.tempImage;
        } else {
            // 일반 대화의 경우 NPC 이미지
            npcImage.src = this.currentNPC.image;
        }

        this.currentDialogue = dialogId;
        this.gameState.setDialogueState(this.currentNPC.id, dialogId);

        this.gameState.ui.updateDialog(
            this.currentNPC.name,
            dialogue.text,
            this.processChoices(dialogue.choices)
        );
    }

    processChoices(choices) {
        return choices.map(choice => ({
            ...choice,
            action: () => {
                if (choice.conditionType && !this.logic.checkCondition(choice)) {
                    if (choice.actionType === 'payForInfo') {
                        this.showDialogue('tom_cannot');
                    } else {
                        this.showDialogue('tom_no_money');
                    }
                    return;
                }

                if (choice.actionType) {
                    const result = this.logic.executeAction(choice);
                    if (result) {
                        if (result.shouldEnd) {
                            this.endDialogue();
                            return;
                        }

                        if (result.text) {
                            this.gameState.ui.updateDialog(
                                this.currentNPC.name,
                                result.text,
                                this.processChoices([
                                    {
                                        text: "돌아가기",
                                        next: result.next || this.currentDialogue
                                    }
                                ])
                            );
                        } else if (result.next) {
                            this.showDialogue(result.next);
                        }
                    }
                } else if (choice.next) {
                    this.showDialogue(choice.next);
                }
            }
        }));
    }

    endDialogue() {
        this.currentNPC = null;
        this.currentDialogue = null;
        this.gameState.setDialogueState(null, null);
        this.gameState.ui.closeDialog();
        
        if (this.previousLocation) {
            this.gameState.setLocation(this.previousLocation);
        }
    }
}