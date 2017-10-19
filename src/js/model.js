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
    .debounceTime(300);

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
        return reg;
    });

// console.log('catch', regexChangedObservable.catch);


// regexChangedObservable.subscribe(val => console.log('regexChanged', val));


export default {
    regexChanged: regexChangedObservable
}

