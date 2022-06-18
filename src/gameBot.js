export const bot2difficulty = (botname) => {
    if (botname === 'self') {
        return '혼자'
    }
    if (botname === 'ab3') {
        return '아주 쉬움'
    }
    if (botname === 'mcts') {
        return '쉬움'
    }
    if (botname === 'network_naive') {
        return '보통-빠름'
    }
    if (botname === 'mcts_ac_r1000') {
        return '보통'
    }
    if (botname === 'mcts_ac_r2000') {
        return '보통+'
    }
}


export const bot2port = (botname) => {
    if (botname === 'network_naive') {
        return 9002;
    }
    if (botname === 'ab3' || botname === 'mcts') {
        return 9001;
    }
    if (botname === 'mcts_ac_r1000' || botname === 'mcts_ac_r2000' || botname === 'self') {
        return 9000;
    }
}


export const bot2explanation = (botname) => {
    if (botname === 'ab3') {
        return 'AlphaBeta Purning으로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 세 수 앞을 내다봅니다.'
    }
    if (botname === 'mcts') {
        return 'Monte Carlo Tree Search로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 20000개의 수를 읽습니다.'
    }
    if (botname === 'network_naive') {
        return '딥러닝으로 강화 학습된 인공지능입니다. 수 읽기를 하지 않습니다.'
    }
    if (botname === 'mcts_ac_r1000') {
        return '딥러닝으로 강화 학습된 인공지능입니다. 1000개의 수를 읽습니다.'
    }
    if (botname === 'mcts_ac_r2000') {
        return '딥러닝으로 강화 학습된 인공지능입니다. 2000개의 수를 읽습니다.\n느립니다. 컴퓨터를 기다려 주세요!'
    }
    if (botname === 'self') {
        return '플레이어 혼자 게임합니다.'
    }
}