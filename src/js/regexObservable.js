import utils from "relax-utils";
import $ from "relax-dom";
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {merge} from 'rxjs/internal/observable/merge';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {map} from 'rxjs/internal/operators/map';
import {startWith} from 'rxjs/internal/operators/startWith';
import {tap} from 'rxjs/internal/operators/tap';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {publishBehavior} from 'rxjs/internal/operators/publishBehavior';
import {refCount} from 'rxjs/internal/operators/refCount';
import predefinedRegs from "./predefined";


var $sourceCtl = $('#regexSource');
var $sourceInput = $sourceCtl.find('input');
var $sourceTip = $sourceCtl.find('.formErrorTip');
var $flagsCtl = $('#regexFlag');
var $flagsInputs = $flagsCtl.find('input');


//source=xxx&flags=muig&match=inputTxt
var hashObj = utils.parseParam(location.hash.replace(/^#/, ''));
hashObj.flags === undefined && (hashObj.flags = '');
hashObj.source === undefined && (hashObj.source = '');
hashObj.match === undefined && (hashObj.match = '');
hashObj.method === undefined && (hashObj.method = '')
hashObj.replacement === undefined && (hashObj.replacement = '*')

console.log('hashObj:', hashObj);

merge(
    fromEvent($sourceInput[0], 'focus').pipe(map(e => true)),
    fromEvent($sourceInput[0], 'blur').pipe(map(e => false))
).subscribe((isFocus) => {
    console.log('regexInput focus/blur callback');
    if ($sourceInput.val().trim() !== '' || isFocus) {
        $sourceCtl.addClass('miniTitle');
    } else {
        $sourceCtl.removeClass('miniTitle');
    }
})

$sourceCtl.on('click', e => {
    //dispatchEvent只是触发事件，没有光标。
    //focus()会使input获得光标
    // $regexInput[0].dispatchEvent(new Event('focus'));
    $sourceInput[0].focus();

});

var predefinedChangedObservable = fromEvent($('#pageAside')[0], 'click', 'li').pipe(
    map((e) => {
        console.log('#pageAside click', e.target);
        var tar = e.target;
        if (tar.tagName !== 'SPAN') {
            tar = $(e.target).find('span')[0];
        }

        var key = tar.dataset.reg;
        var reg = predefinedRegs[key] || {};
        return {
            source: reg.source || '',
            flags: reg.flags || ''
        }
    }),
    startWith(hashObj)
);

var predefinedSourceObservable = predefinedChangedObservable.pipe(
    map(({source}) => source),
    tap(source => {
        console.log('predefined source change');
        $sourceInput.val(source || '');
        if (source.trim() !== '') {
            //当前页面未获得焦点的时候，focus回调不会触发。
            $sourceCtl.addClass('miniTitle');
            $sourceInput.trigger('focus');
        }
    })
)

var predefinedFlagsObservable = predefinedChangedObservable.pipe(
    map(({flags}) => flags),
    tap((flags) => {
        console.log('predefined flags change');
        $flagsInputs.each(node => {
            node.checked = flags.includes(node.value)
        });
    })
)

var flagsObservable = merge(
    fromEvent($flagsCtl[0], 'change', 'input').pipe(map((e) => {
        console.log('flag input change', e.target);
        return $flagsInputs.map(node => node.checked ? node.value : '').join('')
    })),
    predefinedFlagsObservable
).pipe(tap(val => console.log('flag changed,', val)))

var sourceObservable = merge(
    fromEvent($sourceInput[0], 'input').pipe(
        map(e => e.target.value),
        tap(val => {
            console.log('source input', val);
        }),
        debounceTime(300)
    ),
    predefinedSourceObservable
);

var regexChangedObservable = combineLatest([
    sourceObservable,
    flagsObservable
]).pipe(
    map(([source, flags]) => {
        return {source, flags};
    }),
    distinctUntilChanged((pre, cur) => pre.source === cur.source && pre.flags === cur.flags),
    map(({source, flags}) => {

        var reg = null;
        try {
            reg = new RegExp(source, flags);
            $sourceCtl.removeClass('error');
            $sourceTip.html('');
        } catch (err) {
            console.dir(err);
            $sourceCtl.addClass('error');
            $sourceTip.html(err.message);
        }

        if (reg) {
            reg.expando = [source, flags];
        }
        return reg;
    }),
    publishBehavior(),
    refCount()
)

export {regexChangedObservable as regexChanged, hashObj};