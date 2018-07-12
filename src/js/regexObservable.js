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

Observable.fromEvent($sourceInput[0], 'focus').map(e => true)
    .merge(Observable.fromEvent($sourceInput[0], 'blur').map(e => false))
    // .debounceTime(200)  //如果添加debounce，则predefinedChangedObservable首次focus不会响应
    .subscribe((isFocus) => {
        console.log('regexInput focus/blur callback');
        if ($sourceInput.val().trim() !== '' || isFocus) {
            $sourceCtl.addClass('miniTitle');
        }
        else {
            $sourceCtl.removeClass('miniTitle');
        }
    });

$sourceCtl.on('click', e => {
    //dispatchEvent只是触发事件，没有光标。
    //focus()会使input获得光标
    // $regexInput[0].dispatchEvent(new Event('focus'));
    $sourceInput[0].focus();

});


var predefinedChangedObservable = Observable
    .fromEvent($('#pageAside')[0], 'click', 'li').map(e => {
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
    })
    .startWith(hashObj);

var predefinedSourceObservable = predefinedChangedObservable.map(({source}) => source).do((source) => {
    console.log('predefined source change');
    $sourceInput.val(source || '');
    if (source.trim() !== '') {
        //当前页面未获得焦点的时候，focus回调不会触发。
        $sourceCtl.addClass('miniTitle');
        $sourceInput.trigger('focus');
    }
});
var predefinedFlagsObservable = predefinedChangedObservable.map(({flags}) => flags).do((flags) => {
    console.log('predefined flags change');
    $flagsInputs.each(node => {
        node.checked = flags.includes(node.value)
    });
});


var flagsObservable = Observable
    .fromEvent($flagsCtl[0], 'change', 'input').map((e) => {
        console.log('flag input change', e.target);
        return $flagsInputs.map(node => node.checked ? node.value : '').join('')
    })
    .merge(predefinedFlagsObservable)
    .do(val => console.log('flag changed,', val));


var sourceObservable = Observable
    .fromEvent($sourceInput[0], 'input')
    .map(e => e.target.value)
    .do(val => {
        console.log('source input', val);
    })
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