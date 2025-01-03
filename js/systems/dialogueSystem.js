export class DialogueSystem {
    constructor(gameState) {
        this.gameState = gameState;
        
        // NPC 위치 정의
        this.npcLocations = {
            merchant: {
                id: 'merchant_shop',
                title: '상인의 가게',
                description: '다양한 물건들이 진열된 상인의 가게입니다.',
                choices: [],  // 대화 선택지로 대체됨
                parentLocation: 'city'  // 돌아갈 위치
            }
            // 다른 NPC 위치들도 여기에 추가
        };

        // 대화 데이터 정의
        this.dialogues = {
            merchant: {
                id: 'merchant',
                name: '상인',
                location: 'merchant_shop',  // NPC 위치 ID
                initialDialog: 'merchant_greeting',
                conversations: {
                    merchant_greeting: {
                        text: "어서오세요! 무엇을 도와드릴까요?",
                        choices: [
                            {
                                text: "물건을 보고 싶습니다",
                                next: "merchant_shop",
                                condition: () => true
                            },
                            {
                                text: "[정보] 최근 마을 소식이 있나요?",
                                next: "merchant_gossip",
                                condition: () => this.gameState.gold >= 5
                            },
                            {
                                text: "아니오, 괜찮습니다",
                                next: "merchant_goodbye"
                            }
                        ]
                    },
                    merchant_shop: {
                        text: "이런 물건들이 있습니다.",
                        choices: [
                            {
                                text: "검을 살펴본다 (10 골드)",
                                action: () => this.buyItem('sword', 10),
                                condition: () => this.gameState.gold >= 10
                            },
                            {
                                text: "다른 이야기를 하고 싶습니다",
                                next: "merchant_greeting"
                            }
                        ]
                    },
                    merchant_gossip: {
                        text: "5골드를 주시면 최근 소식을 알려드리죠...",
                        choices: [
                            {
                                text: "[5골드] 여기 있습니다",
                                action: () => {
                                    this.gameState.gold -= 5;
                                    return {
                                        text: "최근 고블린들이 마을 근처에서 자주 목격된다고 하네요. 조심하시는 게 좋을 거예요.",
                                        next: "merchant_greeting"
                                    };
                                },
                                condition: () => this.gameState.gold >= 5
                            },
                            {
                                text: "아니오, 괜찮습니다",
                                next: "merchant_greeting"
                            }
                        ]
                    },
                    merchant_goodbye: {
                        text: "다음에 또 들러주세요!",
                        choices: [
                            {
                                text: "대화 종료",
                                action: () => this.endDialogue()
                            }
                        ]
                    },
                    merchant_no_money: {
                        text: "죄송하지만 골드가 부족하시네요...",
                        choices: [
                            {
                                text: "죄송합니다",
                                next: "merchant_greeting"
                            }
                        ]
                    },
                    merchant_cannot: {
                        text: "저도 먹고 살아야죠. 엣헴...",
                        choices: [
                            {
                                text: "알겠습니다",
                                next: "merchant_greeting"
                            }
                        ]
                    }
                }
            }
            // 다른 NPC들의 대화도 여기에 추가할 수 있습니다
        };
    }

    startDialogue(npcId) {
        const npc = this.dialogues[npcId];
        if (!npc) return;

        // 이전 위치 저장
        this.previousLocation = this.gameState.currentLocationId;
        
        // NPC의 위치로 이동
        const npcLocation = this.npcLocations[npcId];
        if (npcLocation) {
            console.log('Moving to NPC location:', npcLocation.id);
            this.gameState.setLocation(npcLocation.id);
        }

        this.currentNPC = npc;
        this.showDialogue(npc.initialDialog);
    }

    showDialogue(dialogueId) {
        const dialogue = this.currentNPC.conversations[dialogueId];
        if (!dialogue) return;

        // 현재 대화 상태 저장
        this.currentDialogue = dialogueId;
        this.gameState.setDialogueState(this.currentNPC.id, dialogueId);

        // 대화창 업데이트
        this.gameState.ui.updateDialog(
            this.currentNPC.name,
            dialogue.text,
            dialogue.choices.map(choice => ({
                ...choice,
                action: () => {
                    if (choice.condition && !choice.condition()) {
                        if (choice.text.includes('골드')) {
                            this.showDialogue('merchant_no_money');
                        } else {
                            this.showDialogue('merchant_cannot');
                        }
                        return;
                    }
                    
                    if (choice.action) {
                        const result = choice.action();
                        if (result && result.text) {
                            this.showDialogue(result.next);
                        }
                    } else if (choice.next) {
                        this.showDialogue(choice.next);
                    }
                }
            }))
        );
    }

    makeChoice(choice) {
        if (choice.action) {
            const result = choice.action();
            if (result && result.text) {
                this.gameState.ui.updateDialog(
                    this.currentNPC.name,
                    result.text,
                    this.filterChoices(this.currentNPC.conversations[result.next].choices)
                );
            }
        } else if (choice.next) {
            this.showDialogue(choice.next);
        }
    }

    filterChoices(choices) {
        return choices.filter(choice => !choice.condition || choice.condition());
    }

    buyItem(itemId, cost) {
        if (this.gameState.gold >= cost) {
            this.gameState.gold -= cost;
            this.gameState.inventory.push(itemId);
            return {
                text: "거래 감사합니다!",
                next: "merchant_greeting"
            };
        }
        return {
            text: "골드가 부족하시네요...",
            next: "merchant_greeting"
        };
    }

    // 대화 상태 복원 메서드 추가
    restoreDialogue(npcId, dialogueId) {
        console.log('Restoring dialogue:', { npc: npcId, dialogue: dialogueId });
        if (npcId && dialogueId) {
            const npc = this.dialogues[npcId];
            if (npc) {
                this.currentNPC = npc;
                // NPC 위치 복원
                const npcLocation = this.npcLocations[npcId];
                if (npcLocation) {
                    this.previousLocation = npcLocation.parentLocation;
                    this.gameState.setLocation(npcLocation.id);
                }
                this.showDialogue(dialogueId);
            }
        }
    }

    endDialogue() {
        console.log('Ending dialogue');
        
        // 이전 위치로 복귀
        const npcLocation = this.npcLocations[this.currentNPC?.id];
        if (npcLocation && npcLocation.parentLocation) {
            console.log('Returning to:', npcLocation.parentLocation);
            this.gameState.setLocation(npcLocation.parentLocation);
        }
        
        this.currentNPC = null;
        this.currentDialogue = null;
        this.gameState.setDialogueState(null, null);
        this.gameState.ui.closeDialog();
    }
}