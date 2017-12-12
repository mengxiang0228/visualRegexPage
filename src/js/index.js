import '../less/index.js';

import utils from 'wwl-utils';

import {regexChanged, refreshFigure} from './model'

import visual from 'visual-regex';

import $ from './dom'

import mvc from './mvc'


if (utils.isIE()) {
    alert('恐怕不能兼容IE浏览器，最好切换为极速模式或chrome浏览器。');
}

var isPc = window.innerWidth >= 1024;


$('#toggleAside').on('click', function (e) {
    mvc.toggleAside();
});

if(isPc){
    mvc.showAside();
}
else{
    $('#pageAside').onDelegate('click', 'span', e => {
        mvc.toggleAside();
    });
}


regexChanged
    .subscribe(reg => {
        var canvas;
        if (reg && reg.expando[0]) {
            console.log(reg, reg.flags);
            canvas = visual(reg);
        }

        refreshFigure(canvas);

    });



