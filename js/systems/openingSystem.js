export class OpeningSystem {
    static CONSTANTS = {
        FADE_DURATION: 1000,
        TEXT_DISPLAY_TIME: 3000,
        LETTER_DISPLAY_TIME: 6000,
        AUDIO_FADE_TIME: 2000
    };

    constructor(game) {
        this.game = game;
        this.elements = {};
        
        this.openingNarrations = [
            "깊은 밤, 창문 틈새로 스며든 바람이 당신의 작업실을 가득 메운다.",
            "그 순간, 책상 위의 낡은 나무 상자가 당신의 시선을 사로잡는다.",
            "상자 속엔 오래된 인장으로 봉인된 편지 한 장이 들어있다.",
            "편지를 열자, 익숙한 이름이 당신의 심장을 뛰게 한다."
        ];
        
        this.letterContent = 
            "하퍼에게,\n\n" +
            "도움이 필요하다. 발더스 게이트에서 이상한 일이 일어나고 있어.\n\n" +
            "사람들이 하나둘씩 사라지고 있다. 단순한 실종이 아니야.\n\n" +
            "이것은 시작일 뿐... 내가 믿을 수 있는 사람은 너뿐이다.\n\n" +
            "- 윌 레이븐가드 -";
            
        this.endingNarration = "당신은 망설임 없이 발더스 게이트로 향하는 마차에 올랐다...";
        
        // 오디오 초기화
        this.bgm = new Audio('./assets/audio/opening-theme.mp3');
        this.bgm.volume = 0;
        this.bgm.onerror = (e) => console.error('Audio loading error:', e);
    }

    initializeElements() {
        this.elements = {
            scene: document.getElementById('opening-scene'),
            text: document.getElementById('opening-text'),
            skipButton: document.getElementById('skip-opening')
        };
        this.elements.skipButton.onclick = () => this.skip();
        this.elements.text.classList.add('opening-text-style');
    }

    async start() {
        this.initializeElements();

        const startButton = this.createStartButton();
        this.elements.scene.appendChild(startButton);
        await this.handleStartButtonClick(startButton);

        await this.showTextSequence(this.openingNarrations, this.elements.text);
        await this.showLetter(this.elements.scene);
        await this.showEpilogue(this.elements.text);

        await this.fadeOutAudio(this.bgm, OpeningSystem.CONSTANTS.AUDIO_FADE_TIME);
        this.finish();
    }

    createStartButton() {
        const startButton = document.createElement('button');
        startButton.textContent = "오프닝 보기";
        startButton.className = "text-bg3-gold text-xl hover:text-white transition-colors duration-300";
        startButton.id = "startButton";
        return startButton;
    }

    async handleStartButtonClick(startButton) {
        try {
            await new Promise((resolve, reject) => {
                startButton.onclick = async () => {
                    try {
                        startButton.remove();
                        await this.bgm.play();
                        await this.fadeInAudio(this.bgm, OpeningSystem.CONSTANTS.AUDIO_FADE_TIME);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
            });
        } catch (error) {
            console.error('Failed to handle start button click:', error);
            // 사용자에게 오류 표시 가능
        }
    }

    async fadeElement(element, duration = OpeningSystem.CONSTANTS.FADE_DURATION) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        await this.wait(100);
        element.style.opacity = '1';
    }

    async showTextWithFade(element, text, displayTime = OpeningSystem.CONSTANTS.TEXT_DISPLAY_TIME) {
        element.textContent = text;
        await this.fadeElement(element);
        await this.wait(displayTime);
        element.style.opacity = '0';
        await this.wait(OpeningSystem.CONSTANTS.FADE_DURATION);
    }

    async showTextSequence(texts, element) {
        for (const text of texts) {
            await this.showTextWithFade(element, text);
        }
    }

    async showLetter(scene) {
        const letterContainer = document.createElement('div');
        letterContainer.id = "letterContainer";

        const letterContent = document.createElement('div');
        letterContent.id = "letterContent";
        letterContent.textContent = this.letterContent;
        
        letterContainer.appendChild(letterContent);
        scene.appendChild(letterContainer);

        await this.fadeElement(letterContainer);
        await this.fadeElement(letterContent);
        await this.wait(OpeningSystem.CONSTANTS.LETTER_DISPLAY_TIME);
        
        letterContainer.style.opacity = '0';
        await this.wait(OpeningSystem.CONSTANTS.FADE_DURATION);
        letterContainer.remove();
    }

    async showEpilogue(element) {
        await this.showTextWithFade(element, this.endingNarration);
    }

    async fadeInAudio(audio, duration) {
        audio.volume = 0;
        const interval = 50;
        const steps = duration / interval;
        const increment = 0.5 / steps;

        return new Promise((resolve) => {
            const fadeIn = setInterval(() => {
                if (audio.volume + increment < 0.5) {
                    audio.volume += increment;
                } else {
                    audio.volume = 0.5;
                    clearInterval(fadeIn);
                    resolve();
                }
            }, interval);
        });
    }

    async fadeOutAudio(audio, duration) {
        const interval = 50;
        const steps = duration / interval;
        const decrement = audio.volume / steps;

        return new Promise((resolve) => {
            const fadeOut = setInterval(() => {
                if (audio.volume - decrement > 0) {
                    audio.volume -= decrement;
                } else {
                    audio.volume = 0;
                    audio.pause();
                    clearInterval(fadeOut);
                    resolve();
                }
            }, interval);
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    skip() {
        this.fadeOutAudio(this.bgm, OpeningSystem.CONSTANTS.AUDIO_FADE_TIME).then(() => {
            const letterContainer = document.getElementById('letterContainer');
            if (letterContainer) letterContainer.remove();
            this.finish();
        });
    }

    finish() {
        this.elements.scene.classList.add('opacity-0');
        setTimeout(() => {
            this.elements.scene.remove();
            this.game.init();
        }, OpeningSystem.CONSTANTS.FADE_DURATION);
    }
} 