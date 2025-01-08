export class OpeningSystem {
    constructor(game) {
        this.game = game;
        this.normalTexts = [
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
        this.epilogue = "당신은 망설임 없이 발더스 게이트로 향하는 마차에 올랐다...";
        
        // 오디오 초기화
        this.bgm = new Audio('./assets/audio/opening-theme.mp3');
        this.bgm.volume = 0;
        
        // 오디오 로딩 에러 처리
        this.bgm.onerror = (e) => {
            console.error('Audio loading error:', e);
        };
    }

    async start() {
        const openingScene = document.getElementById('opening-scene');
        const openingText = document.getElementById('opening-text');
        const skipButton = document.getElementById('skip-opening');

        // 일반 텍스트 스타일 설정
        openingText.style.cssText = `
            padding: 0 2rem;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.8;
            font-size: 1.25rem;
            text-align: center;
        `;

        // 오프닝 보기 버튼 추가
        const startButton = document.createElement('button');
        startButton.textContent = "오프닝 보기";
        startButton.className = "text-bg3-gold text-xl hover:text-white transition-colors duration-300";
        startButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1rem 2rem;
            cursor: pointer;
            background: none;
            border: 1px solid #C4A484;
            border-radius: 4px;
        `;

        openingScene.appendChild(startButton);

        // 시작 버튼 클릭 시 오프닝 시작
        await new Promise(resolve => {
            startButton.onclick = async () => {
                startButton.remove();
                try {
                    await this.bgm.play();
                    this.fadeInAudio(this.bgm, 2);
                    resolve();
                } catch (error) {
                    console.error('Failed to play audio:', error);
                    resolve();
                }
            };
        });

        skipButton.onclick = () => this.skip();

        // 일반 텍스트 표시
        for (const text of this.normalTexts) {
            openingText.textContent = text;
            openingText.classList.remove('opacity-0');
            await this.wait(3000);
            openingText.classList.add('opacity-0');
            await this.wait(1000);
        }

        // 편지 표시
        const letterContainer = document.createElement('div');
        letterContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            background-image: url('/assets/images/opening/letter.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            padding: 1rem;
            overflow-y: auto;
        `;

        const letterContent = document.createElement('div');
        letterContent.style.cssText = `
            padding: 2rem;
            font-family: 'Times New Roman', serif;
            font-size: 1.3rem;
            color: #2C1810;
            white-space: pre-line;
            text-align: left;
            line-height: 1.8;
            opacity: 0;
            transition: opacity 2s ease-in-out;
        `;

        letterContent.textContent = this.letterContent;
        letterContainer.appendChild(letterContent);
        openingScene.appendChild(letterContainer);

        // 편지와 내용 함께 페이드 인
        await this.wait(100);
        letterContainer.style.opacity = '1';
        letterContent.style.opacity = '1';
        
        // 편지 보여주는 시간
        await this.wait(6000);

        // 편지 페이드 아웃
        letterContainer.style.opacity = '0';
        await this.wait(1000);
        letterContainer.remove();

        // 에필로그
        openingText.textContent = this.epilogue;
        openingText.classList.remove('opacity-0');
        await this.wait(3000);
        openingText.classList.add('opacity-0');
        await this.wait(1000);

        // 에필로그 이후
        await this.wait(1000);
        await this.fadeOutAudio(this.bgm, 2); // 2초 동안 페이드아웃
        this.finish();
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 오디오 페이드인
    fadeInAudio(audio, duration) {
        audio.volume = 0;
        const interval = 50; // 50ms마다 업데이트
        const steps = duration * 1000 / interval;
        const increment = 0.5 / steps; // 최대 볼륨 0.5까지

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

    // 오디오 페이드아웃
    fadeOutAudio(audio, duration) {
        const interval = 50;
        const steps = duration * 1000 / interval;
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

    skip() {
        // 스킵할 때도 오디오 페이드아웃
        this.fadeOutAudio(this.bgm, 1).then(() => {
            const letterContainer = document.getElementById('letter-container');
            if (letterContainer) letterContainer.remove();
            this.finish();
        });
    }

    finish() {
        const openingScene = document.getElementById('opening-scene');
        openingScene.classList.add('opacity-0');
        setTimeout(() => {
            openingScene.remove();
            this.game.init();
        }, 1000);
    }
} 