export default {
    url: {
        source: /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.source,
        flags: 'i'
    },
    email: {
        source: /[\w'.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}/.source,
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
    singleChar: { //半角字符,单字节字符
        source: '[\u0020-\u007f\uff61-\uff9f]',
        flags: 'g'
    },
    doubleChar: { //双字节字符
        source: '[^\u0020-\u007f\uff61-\uff9f\\n]',
        flags: 'g'
    },
    ie: {
        source: /(?:MSIE |Trident\/.*; rv:)(\d+)/.source,
        flags: ''
    },
    edge: {
        source: /(?:Edge|Edg|EdgiOS|EdgA)\/(\d+)/.source,
        flags: ''
    },
    chrome: {
        source: /(?:Chrome|CriOS)\/(\d+)/.source,
        flags: ''
    },
    safari: {
        source: /Version\/([\d.]+)( Mobile\/.+?)? Safari\/\d+/.source,
        flags: ''
    },
    firefox: {
        source: /(?:Firefox|FxiOS)\/(\d+)/.source,
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

    sp1: {   //6-9个数字
        source: '^\\d{6,9}$'
    },
    sp2: {   //只能是英文、数字、下划线
        source: '^\\w+$',
        flags: ''
    },
    sp3: {   //字母开头且只能是英文数字下划线
        source: '^[a-zA-Z]\\w$',
        flags: ''
    },
    positiveInt: { //正整数
        source: '^\\d+$',
        flags: ''
    },
    negativeInt: {//负整数
        source: '^-\\d+$',
        flags: ''
    },
    int: { //整数
        source: '^-?\\d+$',
        flags: ''
    },
    positiveNum: { //正数
        source: '^\\d*\\.?\\d+$',
        flags: ''
    },
    negativeNum: { //负数
        source: '^-\\d*\\.?\\d+$',
        flags: ''
    },
    num: { //数字 Positive Number or Negative Number
        source: '^-?\\d*\\.?\\d+$',
        flags: ''
    },
    ipv4: {
        source: /^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/.source,
        flags: ''
    },
    phone: {
        source: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/.source,
        flags: ''
    }


}

//url: 摘录自: http://urlregex.com/
//positiveInt/negativeInt/int/positiveNum/negativeNum/num/ipv4 摘录自: https://stackoverflow.com/questions/1449817/what-are-some-of-the-most-useful-regular-expressions-for-programmers
//phone: https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md

