import $ from 'relax-dom';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {map} from 'rxjs/internal/operators/map';
import {startWith} from 'rxjs/internal/operators/startWith';
import {tap} from 'rxjs/internal/operators/tap';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {first} from 'rxjs/internal/operators/first';

import {getInitHash,setHash} from './hash';
import {regexChanged} from './regexObservable'

import hljs from 'highlight.js/lib/highlight'
import jsonCss from 'highlight.js/styles/default.css'
import visual from 'visual-regex';
import matcher from './matcher';

hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));


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
        console.log('cur method', method, 'cur hasObj:', JSON.stringify(hashObj));
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
        tap(reg => {
            console.log('refresh canvas', reg);
            var canvas;
            if (reg && reg.expando[0]) {
                console.log(reg, reg.flags);
                canvas = visual(reg);
            }

            if (canvas) {
                canvas.style.width = canvas.width / 2 + 'px';
                canvas.style.height = canvas.height / 2 + 'px';
                $figure.html('');
                $figure.append(canvas);
            } else {
                $figure.html('Render error!');
            }
        })
    ),
    matchValueObservable, methodValueObservable, replacementObservable
]).subscribe(([reg, str, method, replacement]) => {

    console.log(`final subscribe, reg: ${reg}, expando: ${reg && reg.expando}, method: ${method}, replacement: ${replacement}`);

    const [source, flags] = reg ? reg.expando : ['', ''];
    hashObj.flags = flags;
    hashObj.source = source;
    hashObj.match = str;
    hashObj.method = method;
    hashObj.replacement = replacement;
    setHash(hashObj);

    var result = 'Null';

    if (reg) {
        $logRegSource.html(source);
        $logRegFlags.html(flags);

        console.log('regex log ', source, flags, reg, str);

        if (source !== '') {
            console.log('method', method, hashObj.method);
            // let match = reg.exec(str);
            let match = matcher[method].call(reg, str, replacement);
            if (match !== null) {
                result = JSON.stringify(match, null, 2);
            }
            // console.log('regex log result:',match,reg.exec(str));
        }
        reg.lastIndex = 0;
    }


    $logOutput.html(result);
    hljs.highlightBlock($logOutput[0]);

});

