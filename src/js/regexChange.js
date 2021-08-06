import $ from 'relax-dom';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {map} from 'rxjs/internal/operators/map';
import {startWith} from 'rxjs/internal/operators/startWith';
import {tap} from 'rxjs/internal/operators/tap';
import {pairwise} from 'rxjs/internal/operators/pairwise';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {first} from 'rxjs/internal/operators/first';

import {getInitHash, setHash} from './hash';
import {regexChanged} from './regexObservable'

import hljs from 'highlight.js/lib/highlight'
import jsonCss from 'highlight.js/styles/default.css'
import visualRegex from 'visual-regex';
import matcher from './matcher';
import utils from 'relax-utils';
import log from './log';

hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));

function visual(reg) {
    const v = visualRegex(reg);

    const canvas = v.visualCanvas();
    canvas.style.width = canvas.width / 2 + 'px';
    canvas.style.height = canvas.height / 2 + 'px';

    const dom = v.visualDom();
    dom.className = 'vr_root';

    return [canvas, dom]
}

var $figure = $('#figure');

//regex log:
var $logRoot = $('#logRoot');
var $logInputCtl = $('#logInput');
var $logInputHolder = $logInputCtl.find('span');
var $logInputTextarea = $logInputCtl.find('textarea');
var $logInputSelect = $('#logSelect');
var $logInputReplacement = $('#logReplacementInput');

var $logRegSource = $('#logRegSource');
var $logRegFlags = $('#logRegFlags');

var $logOutput = $('#logOutput');

const hashObj = getInitHash();
if (hashObj.match) {
    $logInputTextarea.val(hashObj.match);
}
if (hashObj.method) {
    $logInputSelect.val(hashObj.method);
} else {
    hashObj.method = $logInputSelect.val();
}

var matchValueObservable = fromEvent($logInputTextarea[0], 'input').pipe(
    map(e => e.target.value),
    startWith(hashObj.match),
    tap(str => {
        $logInputHolder.text(str);
        $logInputHolder.append('<br/>');
    }),
    debounceTime(300),
    distinctUntilChanged()
)

var methodValueObservable = fromEvent($logInputSelect[0], 'change').pipe(
    map(e => e.target.value),
    startWith(hashObj.method),
    tap(method => {
        log('cur method', method, 'cur hasObj:', JSON.stringify(hashObj));
        // hashObj.method = method;
        // history.replaceState(null, document.title, '#' + utils.param(hashObj));

        const isReplace = method === 'replace';
        const showReplacementCls = 'isReplaceMethod';
        if (isReplace) {
            $logRoot.addClass(showReplacementCls);
            $logInputReplacement.trigger('focus');
        } else $logRoot.removeClass(showReplacementCls);

    })
)

var replacementObservable = fromEvent($logInputReplacement[0], 'input').pipe(
    map(e => e.target.value),
    startWith(hashObj.replacement),
    debounceTime(300),
    distinctUntilChanged()
);
replacementObservable.pipe(first()).subscribe((replacement) => {
    $logInputReplacement.val(replacement); // 设置hashObj的初始值 *
});

combineLatest([
    regexChanged.pipe(
        pairwise(),
        tap(([preReg, reg]) => {
            log('refresh canvas', reg, 'pre:', preReg);
            var canvas, dom;
            if (reg && reg.expando[0]) {
                log('refresh canvas, reg exist', reg, reg.flags);
                [canvas, dom] = visual(reg);
                $figure.removeClass('error').html('');
                $figure.append(dom).append(canvas);
            }

            if (canvas) { // 正常渲染，返回
                return;
            }

            // source为空字符
            if (reg && !reg.expando[0]) {
                [canvas] = visual(/请输入正则表达式/);
                $figure.addClass('error').html('').append(canvas);
            } else if (preReg && preReg.expando[0]) {
                [canvas, dom] = visual(preReg);
                $figure.addClass('error').html('');
                $figure.append(dom).append(canvas);
            } else {
                $figure.addClass('error').html('Render Error!');
            }

        }),
        map(([pre, cur]) => cur)
    ),
    matchValueObservable, methodValueObservable, replacementObservable
]).subscribe(([reg, str, method, replacement]) => {

    log(`final subscribe, reg: ${reg}, expando: ${reg && reg.expando}, method: ${method}, replacement: ${replacement}`);

    const [source, flags] = reg ? reg.expando : ['', ''];
    hashObj.flags = flags;
    hashObj.source = source;
    hashObj.match = str;
    hashObj.method = method;
    hashObj.replacement = replacement;
    setHash(hashObj);

    var result = 'Null';

    if (reg) {
        $logRegSource.html(utils.htmlEncode(source));
        $logRegFlags.html(flags);

        log('regex log ', source, flags, reg, str);

        if (source !== '') {
            log('method', method, hashObj.method);
            // let match = reg.exec(str);
            let match = matcher[method].call(reg, str, replacement);
            if (match !== null) {
                result = JSON.stringify(match, null, 2);
            }
            // log('regex log result:',match,reg.exec(str));
        }
        reg.lastIndex = 0;
    }


    $logOutput.html(result);
    hljs.highlightBlock($logOutput[0]);

});

