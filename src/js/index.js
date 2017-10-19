import '../less/index.js';

import model from './model'

import visual from 'visual-regex';


model
    .regexChanged
    .subscribe(reg => {
        console.log(reg, reg.flags);
        var canvas;
        if (reg) {
            canvas = visual(reg);
        }
    })

