// import $ from './dom'
import $ from 'wwl-dom'


var $body = $('body');

var isPc = window.innerWidth >= 1024;

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


var model = {
    isShowAside: false,
};

var action = {
    showAside() {
        if (model.isShowAside) return;
        $body.addClass('showAside');
        model.isShowAside = true;
        fixedPloyfill();
    },
    hideAside() {
        if (!model.isShowAside) return;
        $body.removeClass('showAside');
        model.isShowAside = false;
        fixedPloyfillRemove();
    },
    toggleAside() {
        model.isShowAside ? action.hideAside() : action.showAside();
    }
};

var result = Object.assign(model, action);

export default result;