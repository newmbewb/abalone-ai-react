export const bot2difficulty = (botname) => {
    if (botname === 'ab3') {
        return '쉬움'
    }
    if (botname === 'mcts') {
        return '보통'
    }
}

export const bot2explanation = (botname) => {
    if (botname === 'ab3') {
        return 'AlphaBeta Purning으로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 세 수 앞을 내다봅니다.'
    }
    if (botname === 'mcts') {
        return 'Monte Carlo Tree Search로 만들어진 인공지능입니다.\n아발론에 익숙한 유저만이 이길 수 있습니다. 강한 수읽기를 구사합니다.'
    }
}