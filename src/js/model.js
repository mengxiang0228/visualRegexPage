import $ from './dom';
import Observable from './Observable';
import utils from 'wwl-utils';

var $regex = $('#regexSource');
var $regexInput = $regex.find('input');
var $regexError = $regex.find('.formErrorTip');


//source=xxx&flags=muig
var hash = location.hash.replace(/^#/, '');
var hashObj = utils.parseParam(hash);

console.log('hash', hashObj)

Observable.fromEvent($regexInput[0], 'focus').map(e => true)
    .merge(Observable.fromEvent($regexInput[0], 'blur').map(e => false))
    .debounceTime(200)
    .subscribe((isFocus) => {
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
    return Observable.fromEvent(node, 'change')
        .map(val => node.checked ? node.value : '')
        .startWith('')
});

var flagChangedObservable = Observable.from(flagObservables)
    .combineAll()
    .map(val => val.join(''))
    .startWith(hashObj.flags || '')
    .distinctUntilChanged()

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
    });

var inputChangedObservable = Observable
    .fromEvent($regexInput[0], 'input')
    .map(e => e.target.value)
    .debounceTime(300)
    .do(source => console.log('source input changed', source, '---'))

var sourceChangedObservable = predefinedChangedObservable
    .merge(inputChangedObservable)
    .distinctUntilChanged()

var regexChangedObservable = sourceChangedObservable
    .combineLatest(flagChangedObservable)
    .do(arr => {
        // console.log('regexChanged',arr);
        location.hash = utils.param(`source=${arr[0]}&flags=${arr[1]}`)
    })
    .map(([source, flags]) => {

        console.log('regex changed', source, flags, '---');

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
    });


// console.log('catch', regexChangedObservable.catch);


// regexChangedObservable.subscribe(val => console.log('regexChanged', val));


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

Observable.fromEvent($logInputTxt[0], 'input')
    .map(e => e.target.value)
    .startWith('')
    .do(str => {
        $logInputHolder.html(str);
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


