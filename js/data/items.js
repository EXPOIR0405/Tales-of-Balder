export const ITEMS = {
    luminate_tea: {
        id: 'luminate_tea',
        name: '루미네이트 차',
        description: '달빛 허브로 우려낸 이 차는 잔잔한 빛을 발하며 마시는 이에게 마음의 평온을 가져다줍니다. 드로우들의 고된 삶 속에서 작은 위안을 제공했던 전통 음료로, 차 한 잔에 담긴 따뜻함과 신비로움은 모험가들에게도 특별한 휴식을 제공합니다.',
        image: './assets/images/food/tea.png',
        type: 'consumable',
        effect: {
            type: 'restore_mana',
            value: 20
        }
    },
    evernight_soup: {
        id: 'evernight_soup',
        name: '에버나이트 스프',
        description: '이 진한 검은 스프는 드로우의 전통 요리로, 어둠 속에서도 빛을 발하는 희미한 별빛을 닮은 재료들로 만들어졌습니다. 깊고 풍부한 맛은 한 모금만으로도 전사의 피로를 씻어주며, 민감한 감각을 잠시나마 마비시키는 독특한 효과를 가집니다. 신중히 먹는 것이 좋습니다.',
        image: './assets/images/food/soup.png',
        type: 'consumable',
        effect: {
            type: 'restore_health',
            value: 30
        }
    }
    // ... 다른 아이템들도 여기에 추가 가능
}; 