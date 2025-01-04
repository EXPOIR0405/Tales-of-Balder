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
            const merchantData = await fetch('/js/data/dialogues/merchant.json')
                .then(response => response.json());
            this.dialogues.merchant = merchantData;
            
            const innkeeperData = await fetch('/js/data/dialogues/innkeeper.json')
                .then(response => response.json());
            this.dialogues.innkeeper = innkeeperData;
            
            console.log('Loaded dialogues:', this.dialogues);
        } catch (error) {
            console.error('Error loading dialogues:', error);
        }
    }

    startDialogue(npcId) {
        console.log('Starting dialogue with:', npcId);
        console.log('Available dialogues:', this.dialogues);
        
        const npc = this.dialogues[npcId];
        if (!npc) {
            console.error('No dialogue found for NPC:', npcId);
            return;
        }

        this.currentNPC = npc;
        console.log('Loading dialogue:', npc.initialDialog);
        this.showDialogue(npc.initialDialog);
    }

    showDialogue(dialogueId) {
        console.log('Showing dialogue:', dialogueId);
        const dialogue = this.currentNPC.conversations[dialogueId];
        if (!dialogue) return;

        this.currentDialogue = dialogueId;
        this.gameState.setDialogueState(this.currentNPC.id, dialogueId);

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