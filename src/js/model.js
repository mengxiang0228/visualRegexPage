import $ from './dom';
import Observable from './Observable';


var $regex = $('#regexSource');
var $regexInput = $regex.find('input');

Observable.fromEvent($regexInput[0], 'focus').map(e => true)
    .merge(Observable.fromEvent($regexInput[0], 'blur').map(e => false))
    .subscribe((isFocus) => {
        console.log('regexSource observable', isFocus);
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


var sourceChangedObservable = Observable.fromEvent($regexInput[0], 'input')
    .map(e => e.target.value)
    .debounceTime(300)
    .distinctUntilChanged()
    // .subscribe(val => console.log('regexSource', val));


var flagObservables = $('#regexFlag').find('input').map(node => {
    return Observable.fromEvent(node, 'change')
        .map(val => node.checked ? node.value : '')
        // .subscribe((val)=>console.log(val));
        .startWith('')
});

var flagChangedObservable = Observable.from(flagObservables)
    .combineAll()
    .map(val => val.join(''))
    .distinctUntilChanged()

export default {
    sourceChanged: sourceChangedObservable,
    flagChanged: flagChangedObservable
}

