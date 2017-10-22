import $ from './dom';
import Observable from './Observable';
import utils from 'wwl-utils';

var $regex = $('#regexSource');
var $regexInput = $regex.find('input');
var $regexError = $regex.find('.formErrorTip');


//source=xxx&flags=muig&match=inputTxt
var hash = location.hash.replace(/^#/, '');
var hashObj = utils.parseParam(hash);

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
var flagObservables = $('#regexFlag').find('input').map(node => {

    node.checked = hashObj.flags.includes(node.value);

    return Observable.fromEvent(node, 'change')
        .map(val => node.checked ? node.value : '')
        .startWith(node.checked ? node.value : '')
});

var flagChangedObservable = Observable.combineLatest(...flagObservables)
    .map(val => val.join(''))
    .distinctUntilChanged()
// .do(val => console.log('flag changed,', val))

//endregion


var predefinedChangedObservable = Observable
    .create(observer => {
        $('#pageAside').onDelegate('click', 'span', e => {
            observer.next(e.target.dataset.reg);
        });
    })
    .startWith(hashObj.source || '')
    .do(reg => {
        $regexInput.val(reg || '')
        $regexInput[0].focus();
        console.log('predefined changed', reg, 'regexInput focus', $regexInput[0]);
    })

var inputChangedObservable = Observable
    .fromEvent($regexInput[0], 'input')
    .map(e => e.target.value)
    .debounceTime(300)

var sourceChangedObservable = predefinedChangedObservable
    .merge(inputChangedObservable)
    .distinctUntilChanged()

var regexChangedObservable = sourceChangedObservable
    .combineLatest(flagChangedObservable)
    .do(arr => {
        // console.log('regexChanged',arr);
        hashObj.source = arr[0];
        hashObj.flags = arr[1];

        console.log('regex changed', arr[0], arr[1], '---');

        location.hash = utils.param(hashObj);
    })
    .map(([source, flags]) => {

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


