import util from './util'
// import './style.css'
import print from './print'

var ele = util.createElement('div');
ele.innerHTML = 'test66655111';
ele.className = 'red';

document.body.appendChild(ele);


var btn = util.createElement('button');
btn.innerHTML = 'click';
btn.addEventListener('click', function () {
    print.log('click');
})

document.body.appendChild(btn);



