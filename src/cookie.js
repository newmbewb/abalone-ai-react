import { Cookies } from "react-cookie";
import { bot2difficulty } from "./gameBot";

const cookies = new Cookies();

export const setCookie = (name, value) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1000);
    return cookies.set(name, value, {expires,});
}

export const getCookie = (name) => {
    return cookies.get(name)
}

export const getRandomKey = () => {
    var randomKey = getCookie('randomkey');
    if (randomKey === undefined) {
        randomKey = Math.random().toString(36);
        setCookie('randomkey', randomKey);
    }
    return randomKey;
}

export const getRecordRaw = () => {
    const userId = getCookie('userid');
    const record_full = getCookie(encodeURIComponent(userId) + '_record');
    return record_full;
}

function getRecord () {
    const record_full = getRecordRaw();
    if (record_full === undefined) {
        return {};
    }
    else {
        const ret = {};
        const records = record_full.split(';');
        var length = records.length;
        for (var i = 0; i < length; i++) {
            const diff_and_record = records[i].split(':');
            const wld = diff_and_record[1].split('/');
            ret[diff_and_record[0]] = {
                'win': parseInt(wld[0]),
                'loss': parseInt(wld[1]),
                'disconnected': parseInt(wld[2])
            }
        }
        return ret;
    }
}

function prepareRecordBot (record, bot) {
    if (record[bot] === undefined) {
        record[bot] = {
            'win': 0,
            'loss': 0,
            'disconnected': 0
        }
    }
}

function saveRecord (record) {
    var record_str_list = [];
    for(var bot in record) {
        var value = record[bot];
        const record_str = [value['win'], value['loss'], value['disconnected']].join('/')
        record_str_list.push(bot + ':' + record_str);
    }
    const userId = getCookie('userid');
    const record_str = record_str_list.join(';');
    setCookie(encodeURIComponent(userId) + '_record', record_str);
}

export const recordWin = (bot) => {
    const record = getRecord();
    prepareRecordBot(record, bot);
    record[bot]['win'] += 1;
    if (record[bot]['disconnected'] > 0) {
        record[bot]['disconnected'] -= 1;
    }
    saveRecord(record);
}

export const recordLoss = (bot) => {
    const record = getRecord();
    prepareRecordBot(record, bot);
    record[bot]['loss'] += 1;
    if (record[bot]['disconnected'] > 0) {
        record[bot]['disconnected'] -= 1;
    }
    saveRecord(record);
}

// export const recordLoss = (bot) => {
//     const record = getRecord();
//     prepareRecordBot(record, bot);
//     record[bot]['loss'] += 1;
//     if (record[bot]['disconnected'] > 0) {
//         record[bot]['disconnected'] -= 1;
//     }
//     saveRecord(record);
// }

export const recordDisconnected = (bot) => {
    const record = getRecord();
    prepareRecordBot(record, bot);
    record[bot]['disconnected'] += 1;
    saveRecord(record);
}

export const getRecordString = () => {
    const record = getRecord();
    var record_str_list = [];
    for(var bot in record) {
        var value = record[bot];
        const record_str = '' + value['win'] + ' 승 / ' + value['loss'] + ' 패 / ' + value['disconnected'] + ' 접속 끊김'
        record_str_list.push(bot2difficulty(bot) + ': ' + record_str);
    }
    const record_str = record_str_list.join("\n");
    return record_str;
}