// import $ from './dom';
import $ from 'wwl-dom';
import Observable from './Observable';
import utils from 'wwl-utils';

import {regexChanged, hashObj} from './regexObservable'

import hljs from 'highlight.js/lib/highlight'
import jsonCss from 'highlight.js/styles/default.css'
import visual from 'visual-regex';

hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));


var $figure = $('#figure');
regexChanged
    .subscribe(reg => {
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

    });


//regex log:
var $logInputCtl = $('#logInput');
var $logInputHolder = $logInputCtl.find('span');
var $logInputTextarea = $logInputCtl.find('textarea');


var $logRegSource = $('#logRegSource');
var $logRegFlags = $('#logRegFlags');

var $logOutput = $('#logOutput');

if (hashObj.match) {
    $logInputTextarea.val(hashObj.match);
}


Observable.fromEvent($logInputTextarea[0], 'input')
    .map(e => e.target.value)
    .startWith(hashObj.match)
    .do(str => {
        $logInputHolder.text(str);
        $logInputHolder.append('<br/>');
        hashObj.match = str;
        location.hash = utils.param(hashObj);
    })
    .debounceTime(300)
    .distinctUntilChanged()
    .combineLatest(regexChanged)
    .subscribe(([str, reg]) => {

        var result = 'Null';

        if (reg) {
            var [source, flags] = reg.expando;
            $logRegSource.html(source);
            $logRegFlags.html(flags);

            console.log('regex log ', source, flags, reg, str);

            if (source !== '') {
                let match = reg.exec(str);
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


