import predefinedRegs from "./predefined";
import {parseParam, param, pick} from "relax-utils";


function getPrefixList() {
    let literal = '';
// literal 加上 a-z A-Z
    [65, 97].forEach((start) => {
        let end = start + 26;
        while (--end >= start) {
            literal += String.fromCharCode(end);
        }
    });

    literal += `0123456789-_!~<>"'`;
    return literal.split('')
}

function getReplaceList() {
    return Object.keys(predefinedRegs).map((key) => {
        return {
            val: predefinedRegs[key].source,
            key
        }
    });
}

const prefixList = getPrefixList();
const replaceList = getReplaceList();

let replaceAll = function (str, subStr, replacement) {
    return str.split(subStr).join(replacement);
}
if (String.prototype.replaceAll) {
    replaceAll = function (str, sub, replace) {
        return str.replaceAll(sub, replace);
    }
}

function encodeSource(source) {
    const prefix = prefixList.find((k) => {
        return !source.includes(k)
    });
    if (!prefix) return {source};

    let result = source;
    replaceList.forEach((item) => {
        result = replaceAll(result, item.val, prefix + item.key);
    })
    return {
        source: result,
        prefix: result === source ? undefined : prefix
    }
}

function decodeSource(source, prefix) {
    if (!prefix) return source;
    let result = source;
    replaceList.forEach(item => {
        result = replaceAll(result, prefix + item.key, item.val);
    })
    return result;
}


let hashObj;

function getInitHash() {
    if (!hashObj) {
        try {
            hashObj = parseParam(location.hash.replace(/^#/, ''));
        } catch (e) {
            console.log('parse param error:', e);
            hashObj = {};
        }
        hashObj.flags === undefined && (hashObj.flags = '');
        hashObj.match === undefined && (hashObj.match = '');
        hashObj.method === undefined && (hashObj.method = '')
        hashObj.replacement === undefined && (hashObj.replacement = '*')
        hashObj.prefix === undefined && (hashObj.prefix = '')

        hashObj.source = decodeSource(hashObj.source || '', hashObj.prefix.trim());

    }
    return hashObj
}

function setHash(obj) {
    const {source, prefix} = encodeSource(obj.source);
    let hashObj = {
        ...obj,
        source,
        prefix
    }
    if (!hashObj.match) hashObj.method = hashObj.replacement = undefined;
    else if (hashObj.method !== 'replace') hashObj.replacement = undefined;

    const str = param(pick(hashObj, key => hashObj[key]));
    console.log('setHash', hashObj, str);

    history.replaceState(null, document.title, '#' + str);
}

export {
    getInitHash,
    setHash
}