export const bot2difficulty = (botname) => {
    if (botname === 'ab3') {
        return '아주 쉬움'
    }
    if (botname === 'mcts') {
        return '쉬움'
    }
    if (botname === 'mcts_ac_r1000') {
        return '보통'
    }
    if (botname === 'mcts_ac_r2000') {
        return '어려움'
    }
}

export const bot2explanation = (botname) => {
    if (botname === 'ab3') {
        return 'AlphaBeta Purning으로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 세 수 앞을 내다봅니다.'
    }
    if (botname === 'mcts') {
        return 'Monte Carlo Tree Search로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 20000개의 수를 읽습니다.'
    }
    if (botname === 'mcts_ac_r1000') {
        return '딥러닝으로 학습된 봇입니다. 1000개의 수를 읽습니다.'
    }
    if (botname === 'mcts_ac_r2000') {
        return '딥러닝으로 학습된 봇입니다. 2000개의 수를 읽습니다.\n느립니다. 봇을 기다려 주세요!'
    }
}