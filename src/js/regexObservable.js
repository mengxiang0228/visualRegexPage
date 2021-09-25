import $ from "relax-dom";
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {merge} from 'rxjs/internal/observable/merge';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {map} from 'rxjs/internal/operators/map';
import {startWith} from 'rxjs/internal/operators/startWith';
import {filter} from 'rxjs/internal/operators/filter';
import {tap} from 'rxjs/internal/operators/tap';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {publishBehavior} from 'rxjs/internal/operators/publishBehavior';
import {refCount} from 'rxjs/internal/operators/refCount';
import predefinedRegs from "./predefined";
import {getInitHash} from './hash';
import {isPc} from "./constant";
import log from './log';
import cls from '../less/index.js';


var $sourceCtl = $('#regexSource');
var $sourceInput = $sourceCtl.find('input');
var $sourceTip = $sourceCtl.find('.formErrorTip');
var $flagsCtl = $('#regexFlag');
var $flagsInputs = $flagsCtl.find('input');


//source=xxx&flags=muig&match=inputTxt

let hashObj = getInitHash();
log('hashObj:', hashObj);

merge(
    fromEvent($sourceInput[0], 'focus').pipe(map(e => true)),
    fromEvent($sourceInput[0], 'blur').pipe(map(e => false))
).subscribe((isFocus) => {
    log('regexInput focus/blur callback');
    if ($sourceInput.val().trim() !== '' || isFocus) {
        $sourceCtl.addClass(cls.miniTitle);
    } else {
        $sourceCtl.removeClass(cls.miniTitle);
    }
})

$sourceCtl.on('click', e => {
    //dispatchEvent只是触发事件，没有光标。
    //focus()会使input获得光标
    // $regexInput[0].dispatchEvent(new Event('focus'));
    $sourceInput[0].focus();

});

var predefinedObservable = fromEvent($('#pageAside')[0], 'click').pipe(
    filter((e) => {
        log('#pageAside click target.tagName:', e.target.tagName);
        return e.target.tagName === 'SPAN' || e.target.tagName === 'LI';
    }),
    map((e) => {
        log('#pageAside click', e.target, e.currentTarget);
        var tar = e.target;
        if (tar.tagName !== 'SPAN') {
            tar = $(e.target).find('span')[0];
        }

        var key = tar.dataset.reg;
        var reg = predefinedRegs[key] || {};

        log('#pageAside click, key:', key, ',reg:', reg);

        return {
            source: reg.source || '',
            flags: reg.flags || ''
        }
    }),
    startWith(hashObj),
    tap(({source}) => {
        log('predefined source change:', source);
        $sourceInput.val(source || '');
        if (source.trim() !== '') {
            // 这里需注意，将addClass miniTitle和focus事件响应分开了。所以miniTitle的样式类不是严格和focus响应中的处理保持一致状态。

            //当前页面未获得焦点的时候，focus回调不会触发。
            $sourceCtl.addClass(cls.miniTitle);

            if (isPc) {
                $sourceInput.trigger('focus');
            } else {
                $sourceInput[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }),
    tap(({flags}) => {
        log('predefined flags change', flags);
        $flagsInputs.each(node => {
            node.checked = flags.includes(node.value)
        });
    })
);

var flagsObservable = fromEvent($flagsCtl[0], 'change', 'input').pipe(
    map((e) => {
        log('flag input change', e.target);
        return $flagsInputs.map(node => node.checked ? node.value : '').join('')
    })
);

var sourceObservable = fromEvent($sourceInput[0], 'input').pipe(
    map(e => e.target.value),
    tap(val => {
        log('source input', val);
    }),
    debounceTime(300)
)

// 发出RegExp对象，如果new RegExp出错，则发出null。
// 过滤连续出错(连续发出null)的情况，即连续两次发出的值，一定有一个是有效的RegExp对象
var regexChangedObservable = combineLatest([
    merge(
        predefinedObservable.pipe(map(({source}) => source)),
        sourceObservable
    ),
    merge(
        predefinedObservable.pipe(map(({flags}) => flags)),
        flagsObservable,
    )
]).pipe(
    distinctUntilChanged((pre, cur) => pre[0] === cur[0] && pre[1] === cur[1]),
    map(([source, flags]) => {
        log('new RegExp:', source, flags)
        var reg = null;
        try {
            reg = new RegExp(source, flags);
            $sourceCtl.removeClass(cls.error);
            $sourceTip.html('');
        } catch (err) {
            console.dir(err);
            $sourceCtl.addClass(cls.error);
            $sourceTip.html(err.message);
        }

        if (reg) {
            // source为空字符时，reg.source不是空字符
            reg.expando = [source, flags];
        }
        return reg;
    }),
    distinctUntilChanged((pre, cur) => !pre && !cur), // 过滤两次都为null的情况
    publishBehavior(),
    refCount()
)

export {regexChangedObservable as regexChanged};