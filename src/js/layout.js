import $ from './dom';
import Observable from './Observable';


var $regex = $('#regex');
var $regexInput = $regex.find('input');

console.log($regex, $regexInput);

Observable.fromEvent($regexInput[0], 'focus').map(e => true)
    .merge(Observable.fromEvent($regexInput[0], 'blur').map(e => false))
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


export default {}

