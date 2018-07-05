import '../less/index.js';

import utils from 'wwl-utils';

import $ from 'wwl-dom'

import regexChange from './regexChange';

var $body = $(document.body);

if (utils.isIE()) {
    alert('恐怕不太能兼容IE浏览器，最好切换为极速模式或chrome浏览器。');
}

var isPc = window.innerWidth >= 1024;
var isShowAside = false;


//region fix 滚动穿透
var fixedPloyfill = function () {
    if (isPc) return;
    $body.style({
        overflow: 'hidden',
    });
};
var fixedPloyfillRemove = function () {
    if (isPc) return;
    $body.style({
        overflow: 'auto'
    });
};
//endregion


var action = {
    showAside() {
        if (isShowAside) return;
        $body.addClass('showAside');
        isShowAside = true;
        fixedPloyfill();
    },
    hideAside() {
        if (!isShowAside) return;
        $body.removeClass('showAside');
        isShowAside = false;
        fixedPloyfillRemove();
    },
    toggleAside() {
        isShowAside ? action.hideAside() : action.showAside();
    }
};


$('#toggleAside').on('click', function (e) {
    action.toggleAside();
});

$('#pageAsideCover').on('click', function (e) {
    action.hideAside();
});
if (isPc) {
    action.showAside();
}
else {
    $('#pageAside').onDelegate('click', 'li', e => {
        action.toggleAside();
    });
}




