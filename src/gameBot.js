import i18next from "./lang/i18n";

export const bot2difficulty = (botname) => {
    if (i18next.language === "ko") {
        if (botname === 'self') {
            return '혼자';
        }
        if (botname === 'ab3') {
            return '아주 쉬움'
        }
        if (botname === 'mcts') {
            return '쉬움'
        }
        if (botname === 'network_naive') {
            return '빠름'
        }
        if (botname === 'mcts_ac_r1000') {
            return '보통'
        }
        if (botname === 'mcts_ac_r2000') {
            return '보통+'
        }
    }
    else {
        if (botname === 'self') {
            return 'Alone';
        }
        if (botname === 'ab3') {
            return 'Very Easy'
        }
        if (botname === 'mcts') {
            return 'Easy'
        }
        if (botname === 'network_naive') {
            return 'Fast'
        }
        if (botname === 'mcts_ac_r1000') {
            return 'Normal'
        }
        if (botname === 'mcts_ac_r2000') {
            return 'Normal+'
        }
    }
}


export const bot2port = (botname) => {
    if (botname === 'ab3' || botname === 'mcts') {
        return 9001;
    }
    if (botname === 'mcts_ac_r1000' || botname === 'mcts_ac_r2000' || botname === 'self' || botname === 'network_naive') {
        return 9000;
    }
}


export const bot2explanation = (botname) => {
    if (i18next.language === "ko") {
        if (botname === 'ab3') {
            return 'AlphaBeta Purning으로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 세 수 앞을 내다봅니다.'
        }
        if (botname === 'mcts') {
            return 'Monte Carlo Tree Search로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 10000개의 수를 읽습니다.'
        }
        if (botname === 'network_naive') {
            return '딥러닝으로 강화 학습된 인공지능입니다. 수 읽기를 하지 않습니다.'
        }
        if (botname === 'mcts_ac_r1000') {
            return '딥러닝으로 강화 학습된 인공지능입니다. 1000개의 수를 읽습니다.\n첫 수는 매우 느리니 조금만 기다려주세요.'
        }
        if (botname === 'mcts_ac_r2000') {
            return '딥러닝으로 강화 학습된 인공지능입니다. 2000개의 수를 읽습니다.\n느립니다. 컴퓨터를 기다려 주세요!\n첫 수는 특히나 매우 느리니 조금만 기다려주세요.'
        }
        if (botname === 'self') {
            return '플레이어 혼자 게임합니다.'
        }
    }
    else {
        if (botname === 'ab3') {
            return 'AI uses AlphaBeta Purning.\nYou can win easily. It look-forward three moves.'
        }
        if (botname === 'mcts') {
            return 'AI uses Monte Carlo Tree Search.\nYou can win easily. It rollouts 10000 times.'
        }
        if (botname === 'network_naive') {
            return 'AI is enhanced by reinforcement learning. It does not look-forward.'
        }
        if (botname === 'mcts_ac_r1000') {
            return 'AI is enhanced by reinforcement learning. It rollouts 1000 times.\nFirst move is very slow, so please be patient.'
        }
        if (botname === 'mcts_ac_r2000') {
            return 'AI is enhanced by reinforcement learning. Rollout 2000 times.\nIt is slow. Please wait the AI!\nFirst move is very slow, so please be patient.'
        }
        if (botname === 'self') {
            return 'Player plays alone.'
        }
    }
}