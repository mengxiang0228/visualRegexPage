const {hashContentSync} = require('relax-hash');

const name2hash = {};
const hash2name = {};

function getLocalIdent(context, localIdentName, localName, options) {
    const filepath = context.resourcePath; // 绝对路径

    if (/visualDom\.less/.test(filepath)) return localName;
    if (/highlight\.js\/styles/.test(filepath)) return localName;

    if (!name2hash[localName]) {
        const hash = '_' + hashContentSync(localName, 'md5').slice(0, 3);
        if (hash2name[hash]) throw new Error(`Have same hash, hash:${hash}, name: ${hash2name[hash]}, ${localName}`);

        name2hash[localName] = hash;
        hash2name[hash] = localName;
    }

    return name2hash[localName];
}

function getJson(){
    return name2hash;
}

module.exports = {
    getLocalIdent,
    getJson
};