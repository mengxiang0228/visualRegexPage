import '../less/index.js';

import {regexChanged, refreshFigure} from './model'

import visual from 'visual-regex';


regexChanged
    .subscribe(reg => {
        var canvas;
        if (reg && reg.expando[0]) {
            console.log(reg, reg.flags);
            canvas = visual(reg);
        }

        refreshFigure(canvas);

    })

