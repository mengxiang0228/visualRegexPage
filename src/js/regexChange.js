// import $ from './dom';
import $ from 'wwl-dom';
import Observable from './Observable';
import utils from 'wwl-utils';

import {regexChanged, hashObj} from './regexObservable'

import hljs from 'highlight.js/lib/highlight'
import jsonCss from 'highlight.js/styles/default.css'
import visual from 'visual-regex';
import matcher from './matcher';

hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));


var $figure = $('#figure');

//regex log:
var $logInputCtl = $('#logInput');
var $logInputHolder = $logInputCtl.find('span');
var $logInputTextarea = $logInputCtl.find('textarea');
var $logInputSelect = $('#logSelect');

var $logRegSource = $('#logRegSource');
var $logRegFlags = $('#logRegFlags');

var $logOutput = $('#logOutput');

if (hashObj.match) {
    $logInputTextarea.val(hashObj.match);
}
if (hashObj.method) {
    $logInputSelect.val(hashObj.method);
}
else {
    hashObj.method = $logInputSelect.val();
}


var matchValueObservable = Observable.fromEvent($logInputTextarea[0], 'input')
    .map(e => e.target.value)
    .startWith(hashObj.match)
    .do(str => {
        $logInputHolder.text(str);
        $logInputHolder.append('<br/>');
        hashObj.match = str;
        // location.hash = utils.param(hashObj);
        console.log('match change ', hashObj);
        history.replaceState(null, document.title, '#' + utils.param(hashObj));
    })
    .debounceTime(300)
    .distinctUntilChanged();

var methodValueObservable = Observable.fromEvent($logInputSelect[0], 'change')
    .map(e => e.target.value)
    .startWith(hashObj.method)
    .do(method => {
        console.log('cur method', method);
        hashObj.method = method;
        history.replaceState(null, document.title, '#' + utils.param(hashObj));
    });

regexChanged
    .do(reg => {
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
        }
        else {
            $figure.html('Render error!');
        }

    })
    .combineLatest(matchValueObservable, methodValueObservable)
    .subscribe(([reg, str, method]) => {

        var result = 'Null';

        if (reg) {
            var [source, flags] = reg.expando;
            $logRegSource.html(source);
            $logRegFlags.html(flags);

            console.log('regex log ', source, flags, reg, str);

            if (source !== '') {
                console.log('method', method, hashObj.method);
                // let match = reg.exec(str);
                let match = matcher[method].call(reg, str);
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

