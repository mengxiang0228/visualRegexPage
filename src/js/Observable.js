
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';



/**
 * @type { {fromEvent:Function , merge:Function , map:Function , from:Function  , startWith:Function ,combineAll:Function ,distinctUntilChanged:Function ,debounceTime:Function} }
 */
export default Observable;