import $ from './dom';
import Observable from './Observable';
import utils from 'wwl-utils';
import predefinedRegs from './predefined';

var $regex = $('#regexSource');
var $regexInput = $regex.find('input');
var $regexError = $regex.find('.formErrorTip');


//source=xxx&flags=muig&match=inputTxt
var hash = location.hash.replace(/^#/, '');
var hashObj = utils.parseParam(hash);
hashObj.flags === undefined && (hashObj.flags = '');
hashObj.source === undefined && (hashObj.source = '');
hashObj.match === undefined && (hashObj.match = '');


console.log('hash', hashObj)

Observable.fromEvent($regexInput[0], 'focus').map(e => true)
    .merge(Observable.fromEvent($regexInput[0], 'blur').map(e => false))
    // .debounceTime(200)  //如果添加debounce，则predefinedChangedObservable首次focus不会响应
    .subscribe((isFocus) => {
        console.log('regexInput focus/blur callback');
        if ($regexInput.val().trim() !== '' || isFocus) {
            $regex.addClass('miniTitle');
        }
        else {
            $regex.removeClass('miniTitle');
        }
    });

$regex.on('click', e => {
    $regexInput[0].focus();
})


//region 修饰符
var $regexFlags = $('#regexFlag').find('input');


var flagChangedObservable = Observable
    .create(observer => {
        $('#regexFlag').onDelegate('change', 'input', (e) => {
            observer.next($regexFlags.map(node => node.checked ? node.value : '').join(''));
        })
    })
    .distinctUntilChanged()
    .do(val => console.log('flag changed,', val))
//endregion


var predefinedChangedObservable = Observable
    .create(observer => {
        $('#pageAside').onDelegate('click', 'span', e => {
            var reg = predefinedRegs[e.target.dataset.reg] || {};
            observer.next({
                source: reg.source || '',
                flags: reg.flags || ''
            });
        });
    })
    .startWith(hashObj)
    .do(({source, flags}) => {

        console.log('predefined changed', source, flags);
        $regexFlags.each(node => {
            node.checked = flags.includes(node.value)
            // node.dispatchEvent(new Event('change'));
        });

        $regexInput.val(source || '')
        $regexInput[0].focus();
        // $regexInput[0].dispatchEvent(new Event('input'));
    })

var inputChangedObservable = Observable
    .fromEvent($regexInput[0], 'input')
    .map(e => e.target.value)
    .startWith(hashObj.source)
    .debounceTime(300)
    .combineLatest(flagChangedObservable.startWith(hashObj.flags))
    .map(([source, flags]) => {
        console.log('input changed', source, flags);
        return {source, flags}
    })


var regexChangedObservable = inputChangedObservable
    .merge(predefinedChangedObservable)
    .distinctUntilChanged((pre, cur) => pre.source === cur.source && pre.flags === cur.flags)
    .do(({source, flags}) => {

        hashObj.source = source;
        hashObj.flags = flags;

        console.log('regex changed', source, flags, '---');

        location.hash = utils.param(hashObj);
    })
    .map(({source, flags}) => {

        var reg = null;
        try {
            reg = new RegExp(source, flags);
            $regex.removeClass('error');
            $regexError.html('');
        }
        catch (err) {
            console.dir(err);
            $regex.addClass('error');
            $regexError.html(err.message);
        }

        if (reg) {
            reg.expando = [source, flags];
        }
        return reg;
    })
    .publishBehavior().refCount()


var $figure = $('#figure');
var refreshFigure = function (canvas) {
    if (canvas) {
        canvas.style.width = canvas.width / 2 + 'px';
        canvas.style.height = canvas.height / 2 + 'px';
        $figure.html('');
        $figure.append(canvas);
    }
    else {
        $figure.html('Render error!');
    }
}


//regex log:
var $logInput = $('#logInput');
var $logInputHolder = $logInput.find('span');
var $logInputTxt = $logInput.find('input');

var $logRegSource = $('#logRegSource');
var $logRegFlags = $('#logRegFlags');

var $logOutput = $('#logOutput')

if (hashObj.match) {
    $logInputTxt.val(hashObj.match);
}

Observable.fromEvent($logInputTxt[0], 'input')
    .map(e => e.target.value)
    .startWith(hashObj.match)
    .do(str => {
        $logInputHolder.html(str);
        hashObj.match = str;
        location.hash = utils.param(hashObj);
    })
    .debounceTime(300)
    .distinctUntilChanged()
    .combineLatest(regexChangedObservable)
    .subscribe(([str, reg]) => {

        var result = 'Null';

        if (reg) {
            var [source, flags] = reg.expando;
            $logRegSource.html(source);
            $logRegFlags.html(flags);

            console.log('regex log ', source, flags)

            if (source !== '') {
                let match = reg.exec(str);
                if (match !== null) {
                    result = JSON.stringify(match, null, 2);
                }
            }
        }

        $logOutput.html(result);

    })

export {regexChangedObservable as regexChanged, refreshFigure};


