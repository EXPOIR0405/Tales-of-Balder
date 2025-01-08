// 게임 위치와 선택지 데이터

export const locations = {
    start: {
        title: '발더스 게이트 입구',
        description: '어두운 밤, 당신은 발더스 게이트의 입구에 도착했습니다. 도시의 높은 성벽이 달빛에 희미하게 빛나고 있습니다.',
        choices: [
            {
                text: '도시 안으로 들어간다',
                action: () => game.handleLocationChange('city')
            },
            {
                text: '주변을 살펴본다',
                action: () => game.handleLocationChange({
                    description: '주변을 살펴보니 누군가 떨어뜨린 동전 주머니를 발견했다! (10 골드 획득)',
                    gold: 10
                })
            }
        ]
    },
    city: {
        title: '발더스 게이트 광장',
        description: '붐비는 도시 광장에 도착했습니다. 상인들의 외침과 사람들의 발걸음 소리가 뒤섞여 있습니다.',
        choices: [
            {
                text: '상인과 대화하기',
                action: () => game.dialogue.startDialogue('tom')
            },
            {
                text: '달 그림자 여관으로 이동',
                action: () => game.handleLocationChange('inn')
            },
            {
                text: '도시 입구로 돌아가기',
                action: () => game.handleLocationChange('start')
            }
        ]
    },
    inn: {
        title: '달 그림자 여관 (Moonshadow Inn)',
        description: '도시의 조용한 구석에 자리 잡은 여관입니다. 달빛처럼 은은한 조명이 실내를 비추고 있으며, 드로우 특유의 세련된 장식들이 벽을 따라 놓여있습니다.',
        choices: [
            {
                text: '여관주인 케이런과 대화하기',
                action: () => game.dialogue.startDialogue('kaerun')
            },
            {
                text: '광장으로 돌아가기',
                action: () => game.handleLocationChange('city')
            }
        ]
    }
}; 

