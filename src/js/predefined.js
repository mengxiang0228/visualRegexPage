export default {
    url: {
        source: '^https?:\\/\\/(([a-zA-Z0-9_-])+(\\.)?)*(:\\d+)?(\\/((\\.)?(\\?)?=?&?[a-zA-Z0-9_-](\\?)?)*)*$',
        flags: 'i'
    },
    email: {
        source: '\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*',
        flags: ''
    },
    postcode: { //邮编
        source: '^[1-9]\\d{5}(?!\\d)$',
        flags: ''
    },
    idNum: { //身份证
        source: '^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',
        flags: ''
    },
    trim: { //首尾空格
        source: '^\\s*|\\s*$',
        flags: 'g'
    },
    singleChar: { //半角字符
        source: '\u0020-\u007f|\uff61-\uff9f',
        flags: 'g'
    },
    ie: {
        source: 'MSIE (\\d+)|Trident\\/.*; rv:(\\d+)|(Edge\\/\\d+)',
        flags: ''
    },
    chrome: {
        source: 'Chrome\\/(\\d+)',
        flags: ''
    },
    safari: {
        source: 'Safari\\/(\\d+)',
        flags: ''
    },
    firefox: {
        source: 'Firefox\\/(\\d+)',
        flags: ''
    },
    ios: {
        source: 'iphone|ipad|ipod|ios',
        flags: 'i'
    },
    android: {
        source: 'Android',
        flags: 'i'
    },
    wechat: { //微信
        source: 'MicroMessenger',
        flags: ''
    },

    sp1:{   //6-9个数字
        source:'^\\d{6,9}$'
    },
    sp2:{   //只能是英文、数字、下划线
        source:'^\\w+$',
        flags:''
    },
    sp3:{   //字母开头且只能是英文数字下划线,6~18位
        source:'^[a-zA-Z]\\w{5,17}$',
        flags:''
    }


}