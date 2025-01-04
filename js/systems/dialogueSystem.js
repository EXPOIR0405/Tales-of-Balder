export class DialogueSystem {
    constructor(gameState) {
        this.gameState = gameState;
        
        // NPC 위치 정의
        this.npcLocations = {
            merchant: {
                id: 'tom_stall',
                title: '톰의 상점',
                description: '톰의 가판대는 잡동사니와 초보 탐험가들을 위한 물건들이 전시되어 있습니다. 어쩌면 당신도 유용한 걸 찾을지도요?',
                choices: [],  // 대화 선택지로 대체됨
                parentLocation: 'city'  // 돌아갈 위치
            }
            // 다른 NPC 위치들도 여기에 추가
        };

        // 대화 데이터 정의
        this.dialogues = {
            merchant: {
                id: 'tom',
                name: '톰',
                location: 'tom_stall',  // NPC 위치 ID
                image: '/game/assets/images/npc/tom.png',
                initialDialog: 'tom_greeting',
                conversations: {
                    tom_greeting: {
                        text: "어서 와! 친구! 이 광장에서 이런 보물들을 찾긴 쉽지 않을걸. 뭐든 필요한 게 있나?",
                        choices: [
                            {
                                text: "물건을 보고 싶습니다",
                                next: "tom_shop",
                                condition: () => true
                            },
                            {
                                text: "[정보] 최근 마을 소식이 있나요?",
                                next: "tom_gossip",
                                condition: () => this.gameState.gold >= 5
                            },
                            {
                                text: "아니오, 괜찮습니다",
                                next: "tom_goodbye"
                            }
                        ]
                    },
                    tom_shop: {
                        text: "아, 내 눈은 결코 잘못되지 않지. 당신, 이게 필요할 걸?",
                        choices: [
                            {
                                text: "검을 살펴본다 (10 골드)",
                                action: () => {
                                    if (this.gameState.gold >= 10) {
                                        return this.buyItem('sword', 10);
                                    } else {
                                        // 골드가 부족할 때 대화로 이동
                                        return {
                                            text: "이 정도 돈이 없는데 어떻게 발더스 게이트에서 살아남으려고?",
                                            next: "tom_no_money"
                                        };
                                    }
                                }
                            },
                            {
                                text: "회복 물약을 살펴본다 (5 골드)",
                                action: () => {
                                    return this.buyItem('healing_potion', 5);
                                },
                                condition: () => this.gameState.gold >= 5
                            },
                            {
                                text: "다른 이야기를 하고 싶습니다",
                                next: "tom_greeting"
                            }
                        ]
                    },
                    tom_gossip: {
                        text: "정보는 공짜가 아니야, 친구. 5골드면 내가 아는 모든 걸 알려줄 테지. 자 어때?",
                        choices: [
                            {
                                text: "[5골드] 여기 있습니다",
                                action: () => {
                                    this.gameState.gold -= 5;
                                    return {
                                        text: "들어봐, 최근 마을 바깥 숲에서 이상한 그림자가 목격되고 있대. 뭔가 수상하지 않아?",
                                        next: "tom_greeting"
                                    };
                                },
                                condition: () => this.gameState.gold >= 5
                            },
                            {
                                text: "아니오, 괜찮습니다",
                                action: () => {
                                    this.gameState.gold -= 0;
                                    return {
                                        text: "하, 농담하나? 세상에 공짜로 얻을 수 있는 건 없다네. 다시 돌아오게나, 돈이 준비되면.",
                                        next: "tom_goodbye"
                                    };
                                }
                            }
                        ]
                    },
                    tom_goodbye: {
                        text: "다음에 또 들러! 난 언제나 여기서 기다리고 있을테니까",
                        choices: [
                            {
                                text: "대화 종료",
                                action: () => this.endDialogue()
                            }
                        ]
                    },
                    tom_no_money: {
                        text: "돈이 부족하잖아, 친구. 다시 올 때는 주머니를 꽉 채워오라고.",
                        choices: [
                            {
                                text: "죄송합니다",
                                next: "tom_greeting"
                            }
                        ]
                    },
                    tom_cannot: {
                        text: "공짜로 들으려고?",
                        choices: [
                            {
                                text: "... (쪼잔하긴)",
                                next: "tom_greeting"
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
                            this.showDialogue('tom_no_money');
                        } else {
                            this.showDialogue('tom_cannot');
                        }
                        return;
                    }
                    
                    if (choice.action) {
                        const result = choice.action();
                        if (result && result.text) {
                            if (result.next && this.currentNPC.conversations[result.next]) {
                                this.gameState.ui.updateDialog(
                                    this.currentNPC.name,
                                    result.text,
                                    this.currentNPC.conversations[result.next].choices
                                );
                                this.currentDialogue = result.next;
                            } else {
                                this.gameState.ui.updateDialog(
                                    this.currentNPC.name,
                                    result.text,
                                    dialogue.choices
                                );
                            }
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
            if (this.gameState.inventory.addItem(itemId)) {
                this.gameState.gold -= cost;
                return {
                    text: "좋은 거래야! 너도 만족하겠지",
                    next: "tom_shop"
                };
            } else {
                return {
                    text: "인벤토리 공간이 부족하네요...",
                    next: "tom_shop"
                };
            }
        }
        return {
            text: "이 정도 돈이 없는데 어떻게 발더스 게이트에서 살아남으려고?",
            next: "tom_greeting"
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