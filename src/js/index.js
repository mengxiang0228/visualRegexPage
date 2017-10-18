import '../less/index.js';

import visualRegex from 'visual-regex';

import Rx from 'rxjs/Rx';   //npm install rxjs-es


// var canvas = visualRegex(/wwl/);
//
// canvas.style.transform = 'scale(0.5)';
// canvas.style.transformOrigin = 'left top';
//
// document.body.appendChild(canvas);


// var o = Rx.Observable.of('foo', 'bar');
//
// console.log(Rx.Observable.of('foo', 'bar'));
// console.log(Rx.Observable.from([1, 2, 3]));
// console.log(Rx.Observable.of(1, 2, 3));
//
// var nexto = o.subscribe(val => console.log(val));
// o.subscribe(val => console.log(val));
//
// var myObservable = Rx.Observable.create(observer => {
//     console.log('create observable');
//     observer.next('111');
//     setTimeout(() => {
//         observer.next(222)
//     }, 1000)
// });
//
// myObservable.subscribe((val) => console.log(val));
//
//
// var increaseButton = document.querySelector('#btn');
//
// var cnt = 1;
// // var stream = Rx.Observable.fromEvent(increaseButton, 'click')
//
// // var stream = Rx.Observable.create((observer) =>
// //     setInterval(
// //         () => observer.next(Math.random())
// //         , 1000
// //     ))
//
// var stream = Rx.Observable.create((observer) => {
//
//     console.log('observer', observer);
//
//     var id = setInterval(() => {
//         observer.next(Math.random());
//         if (cnt > 5) {
//             observer.error('error111');
//         }
//     }, 1000)
//
//     console.log('interval id ', id);
//
//     return function unsubscribe() {
//         clearInterval(id);
//         console.log('clearInterval', id);
//     }
// })
//
// stream.subscribe((e) => {
//     console.log(cnt++, e);
//
// }, (err) => console.log('get a error', err));
//
// setTimeout(() =>{
//
//     var subscription = stream.subscribe((e) => {
//         console.log('again', cnt, e)
//     })
//
//     subscription.unsubscribe()
//
//     // setTimeout(() => {
//     //     console.log('call unsubscribe');
//     //     subscription.unsubscribe()
//     // }, 1000)
// },2000)
//
//


var stream1 = Rx.Observable.of('a', 'b', 'c');
var stream2 = Rx.Observable.timer(0, 1000);
var stream3 = Rx.Observable.range(-10, 10);

// var zipStream = Rx.Observable.zip(stream1, stream2, stream3,
//     (s1, s2, s3) => ['stream1:', s1, 'stream2:', s2, 'stream3:', s3].join(''));

// var zipStream=Rx.Observable.combineLatest(stream2,stream1,stream3);
//
// zipStream.subscribe((val) => console.log(val));


// stream2.bufferTime(3100,1000).subscribe((val) =>console.log(val));
// stream2.combineLatest(stream1).subscribe((val) => console.log(val))

// stream1.combineLatest(stream2).subscribe((val) => console.log(val))

// var newStream = Rx.Observable.timer(0,1000).take(4).concatMap((val) =>Rx.Observable.of(4,5,6))//.concatAll();

var obj = {name: '1'};
var p = new Array(7).fill(0).map((val, index) => {
    return {
        name: 'name' + (index > 3 ? 1 : 2),
        value: index
    }
})

var now = Date.now();
var prevTime = Date.now();
// var newStream = Rx.Observable.of(1, obj, obj, 2, 6, '6', 1, 7).distinctUntilChanged((pre, cur) => {
//     // console.log('compare',pre,cur);
//     return pre == cur;
// });

// var newStream=Rx.Observable.from([1,2,3,3,4,5]).distinctUntilKeyChanged('1')
// var newStream=stream2.take(3).every((val) =>val<5)
// var newStream = Rx.Observable
//     .interval(1000)
//     .take(3)
//     .map((val) => {
//         return Rx.Observable.of(1, 2, 3)
//     })
//     .combineAll((val) => {
//         console.log('combileAll', val);
//         return val
//     });

// var newStream = Rx.Observable
//     .from(p)
//     .groupBy((val) =>val.name)
//     .concatAll()
// .mergeAll()

var groups = [];
var newStream = Rx.Observable.interval(500).take(3)
    .map(val =>
        Rx.Observable.interval(1000)
            .map(childValue => val + '-' + childValue)
            .take(6))
    .mergeAll(2)

newStream = Rx.Observable.create((observer) => {
    console.log('create Observable');
    stream1.subscribe((val) => observer.next(val))
}).multicast(new Rx.Subject());

var i1 = Rx.Observable.interval(500).map(val => '1-' + val).take(5);
var i2 = Rx.Observable.interval(1000).map(val => '2-' + val).take(5);


newStream =Rx.Observable.of('a').zip(stream2)


// var newStream = stream1.map((val) =>Rx.Observable.of(1,2,3)).concatAll()

// setTimeout(() => {
//     newStream.subscribe({
//         next: (val, index) => {
//             // console.log('next',val,Date.now()-prevTime);
//             console.log('next', val, index);
//             prevTime = Date.now();
//         },
//         error: (val) => console.log('error', val),
//         complete: () => console.log('complete')
//     })
// }, 3500);
//并调用closingSelector返回一个observable,该Observable发出一个值或完成时，关闭前一个窗口，开启新的窗口

newStream.subscribe({
    next: (val, index) => {
        // console.log('next',val,Date.now()-prevTime);
        console.log('next', val);
        prevTime = Date.now();
        // val.count().subscribe((val) =>console.log('nextCount',val))
    },
    error: (val) => console.log('error', val),
    complete: () => console.log('complete')
})

// newStream.subscribe({
//     next: (val, index) => {
//         // console.log('next',val,Date.now()-prevTime);
//         console.log('next2', val);
//         prevTime = Date.now();
//         // val.count().subscribe((val) =>console.log('nextCount',val))
//     },
//     error: (val) => console.log('error', val),
//     complete: () => console.log('complete')
// })

// newStream.connect();