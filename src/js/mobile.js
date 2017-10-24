import $ from './dom'

var $body = $('body');

var showPredefinedReg = function () {
    $body.addClass('showPageAside');
};
var hidePredefinedReg = function () {
    $body.removeClass('showPageAside');
}


var mobileCompat = function () {
    $('#headerShowReg').on('click', function () {
        showPredefinedReg();
    })

    $('#headerHideReg').on('click', function () {
        hidePredefinedReg()
    });


    $('#pageAside').onDelegate('click', 'span', e => {
       hidePredefinedReg();
    });

}

export default mobileCompat();



