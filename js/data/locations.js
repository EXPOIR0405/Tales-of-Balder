export const locations = {
    start: {
        title: '발더스 게이트 입구',
        description: '어두운 밤...',
        choices: [
           {
            text: '도시를 들어간다',
            action: () => 'city' // 도시로 이동
           },
           {
            text: '주변을 살펴본다',
            action: () => ({
                description: '주변을 살펴보니 운이 좋았다, 누군가 버린 10골드를 얻었다!!',
                gold: 10,
            })
           },
        ]
    },
    city: {
        title: '발더스 게이트 도시',
        description: '발더스 게이트 도시는 넓고 복잡하다...',
        choices: [
            { text: '도시를 돌아다닌다', action: () => 'city' },
            { text: '대화 시작', action: () => 'dialogue' },
        ]
    }
}; 