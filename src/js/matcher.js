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
        call(reg, str) {
            return str.replace(reg, function (match) {
                return Array(match.length).fill('*').join('');
            })
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