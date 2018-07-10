import utils from "wwl-utils";
import $ from "wwl-dom";
import Observable from "./Observable";
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

console.log('hash', hashObj);

var blurSourceInput = function () {
    if ($sourceInput.val().trim() !== '') {
        $sourceCtl.addClass('miniTitle');
    }
    else {
        $sourceCtl.removeClass('miniTitle');
    }
}
var focusSourceInput = function () {
    $sourceCtl.addClass('miniTitle');
};

Observable.fromEvent($sourceInput[0], 'focus').map(e => true)
    .merge(Observable.fromEvent($sourceInput[0], 'blur').map(e => false))
    // .debounceTime(200)  //如果添加debounce，则predefinedChangedObservable首次focus不会响应
    .subscribe((isFocus) => {
        console.log('regexInput focus/blur callback');
        isFocus ? focusSourceInput() : blurSourceInput();
    });

$sourceCtl.on('click', e => {
    //dispatchEvent只是触发事件，没有光标。
    //focus()会使input获得光标
    // $regexInput[0].dispatchEvent(new Event('focus'));
    $sourceInput[0].focus();

});


var predefinedChangedObservable = Observable
    .create(observer => {
        $('#pageAside').onDelegate('click', 'li', function (e) {
            var key = $(this).find('span').dataset('reg');
            var reg = predefinedRegs[key] || {};
            observer.next({
                source: reg.source || '',
                flags: reg.flags || ''
            });
        });
    })
    .startWith(hashObj)
    .do(({source, flags}) => {

        console.log('predefined changed', source, flags);
        $flagsInputs.each(node => {
            node.checked = flags.includes(node.value)
            // node.dispatchEvent(new Event('change'));
        });

        console.log('refresh', $sourceInput.val());

        $sourceInput.val(source || '');
        // $sourceInput[0].dispatchEvent(new Event('focus'));
        // $sourceInput.trigger('focus');
        focusSourceInput();
    });

var predefinedSourceObservable = predefinedChangedObservable.map(({source}) => source);
var predefinedFlagsObservable = predefinedChangedObservable.map(({flags}) => flags);


var flagsObservable = Observable
    .create(observer => {
        $flagsCtl.onDelegate('change', 'input', (e) => {
            observer.next($flagsInputs.map(node => node.checked ? node.value : '').join(''));
        })
    })
    .merge(predefinedFlagsObservable)
    .do(val => console.log('flag changed,', val));


var sourceObservable = Observable
    .fromEvent($sourceInput[0], 'input')
    .map(e => e.target.value)
    .debounceTime(300)
    .merge(predefinedSourceObservable);


var regexChangedObservable = sourceObservable
    .combineLatest(flagsObservable)
    .map(([source, flags]) => {
        return {source, flags};
    })
    .distinctUntilChanged((pre, cur) => pre.source === cur.source && pre.flags === cur.flags)
    .do(({source, flags}) => {

        hashObj.source = source;
        hashObj.flags = flags;

        console.log('regex changed', source, flags, '---');

        // location.hash = utils.param(hashObj);
        history.replaceState(null, document.title, '#' + utils.param(hashObj));
    })
    .map(({source, flags}) => {

        var reg = null;
        try {
            reg = new RegExp(source, flags);
            $sourceCtl.removeClass('error');
            $sourceTip.html('');
        }
        catch (err) {
            console.dir(err);
            $sourceCtl.addClass('error');
            $sourceTip.html(err.message);
        }

        if (reg) {
            reg.expando = [source, flags];
        }
        return reg;
    })
    .publishBehavior().refCount();

export {regexChangedObservable as regexChanged, hashObj};