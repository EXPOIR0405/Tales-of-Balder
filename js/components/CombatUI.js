export class CombatUI {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.playerStats = null;
        this.enemyStats = null;
        this.actionButtons = null;
        this.combatLog = null;
    }

    initialize() {
        // 메인 컨테이너 생성
        this.container = document.createElement('div');
        this.container.id = 'combat-ui';
        this.container.className = 'fixed inset-0 flex flex-col items-center justify-between p-4';

        // 전투 로그 생성
        this.createCombatLog();
        
        // 적 상태창 생성
        this.createEnemyStats();
        
        // 플레이어 상태창 및 액션 버튼 생성
        this.createPlayerUI();

        document.body.appendChild(this.container);
    }

    createCombatLog() {
        this.combatLog = document.createElement('div');
        this.combatLog.id = 'combat-log';
        this.combatLog.className = 'w-1/3 h-32 bg-gray-800 bg-opacity-80 rounded p-2 overflow-y-auto text-white';
        this.container.appendChild(this.combatLog);
    }

    createEnemyStats() {
        this.enemyStats = document.createElement('div');
        this.enemyStats.id = 'enemy-stats';
        this.enemyStats.className = 'w-full flex justify-center gap-4 my-4';
        this.container.appendChild(this.enemyStats);
    }

    createPlayerUI() {
        const playerSection = document.createElement('div');
        playerSection.className = 'w-full flex justify-between items-end';

        // 플레이어 상태창
        this.playerStats = document.createElement('div');
        this.playerStats.id = 'player-stats';
        this.playerStats.className = 'bg-gray-800 bg-opacity-80 rounded p-4 text-white';

        // 액션 버튼 컨테이너
        this.actionButtons = document.createElement('div');
        this.actionButtons.id = 'action-buttons';
        this.actionButtons.className = 'flex gap-2';

        // 기본 액션 버튼들 추가
        const actions = ['공격', '특수 공격', '방어'];
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action;
            button.className = 'px-4 py-2 bg-bg3-gold text-white rounded hover:bg-yellow-600 transition-colors';
            this.actionButtons.appendChild(button);
        });

        playerSection.appendChild(this.playerStats);
        playerSection.appendChild(this.actionButtons);
        this.container.appendChild(playerSection);
    }

    updateStats(player, enemies) {
        // 플레이어 상태 업데이트
        this.playerStats.innerHTML = `
            <div class="text-lg font-bold">${player.name}</div>
            <div>HP: ${player.health}/${player.maxHealth}</div>
            <div>무기: ${player.weapon.name}</div>
        `;

        // 적 상태 업데이트
        this.enemyStats.innerHTML = enemies.map(enemy => `
            <div class="bg-gray-800 bg-opacity-80 rounded p-4 text-white">
                <img src="${enemy.imagePath}" alt="${enemy.name}" 
                     class="w-24 h-24 object-contain mb-2">
                <div class="text-lg font-bold">${enemy.name}</div>
                <div>HP: ${enemy.health}/${enemy.maxHealth}</div>
                ${enemy.effects.map(effect => 
                    `<div class="text-sm text-red-400">${effect.name}</div>`
                ).join('')}
            </div>
        `).join('');
    }

    addCombatLog(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logEntry.className = 'text-sm';
        this.combatLog.appendChild(logEntry);
        this.combatLog.scrollTop = this.combatLog.scrollHeight;
    }

    showDamageNumber(target, damage, isCritical) {
        const damageDiv = document.createElement('div');
        damageDiv.textContent = damage;
        damageDiv.className = `absolute ${isCritical ? 'text-red-500 text-2xl' : 'text-white text-xl'} 
                              font-bold pointer-events-none animate-damage-popup`;
        
        // 대상 위치에 따라 위치 조정
        const targetElement = document.querySelector(`#${target.id}`);
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            damageDiv.style.left = `${rect.left + rect.width/2}px`;
            damageDiv.style.top = `${rect.top}px`;
            document.body.appendChild(damageDiv);
            
            // 애니메이션 후 제거
            setTimeout(() => damageDiv.remove(), 1000);
        }
    }
} 