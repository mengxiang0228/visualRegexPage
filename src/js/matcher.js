export default {
    'search': {
        call(reg, str) {
            return str.search(reg);
        }
    },
    'match': {
        call(reg, str) {
            return str.match(reg);
        }
    },
    'replace': {
        call(reg, str, replacement) {
            return str.replace(reg, replacement || '')
        }
    },
    'split': {
        call(reg, str) {
            return str.split(reg);
        }
    },
    'exec': {
        call(reg, str) {
            return reg.exec(str);
        }
    },

}