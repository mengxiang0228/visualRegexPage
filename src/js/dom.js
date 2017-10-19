class Dom {
    /**
     * @param nodes {Array:HTMLElement}
     */
    constructor(nodes) {
        if (nodes === undefined) {
            nodes = [];
        }
        else if (nodes === window) {
            nodes = [window];
        }
        else if (nodes.nodeType) {
            nodes = [nodes];
        }
        else if (!Array.isArray(nodes)) {
            nodes = Array.from(nodes);
        }

        this.nodes = nodes;

        nodes.forEach((node, index) => this[index] = node);

        this.length = nodes.length;

    }

    each(fn) {
        this.nodes.forEach(fn);
        return this;
    }

    map(fn) {
        return this.nodes.map(fn);
    }

    classNames(index) {
        return this.nodes[index].className.split(' ').filter((val) => val !== '');
    }

    addClass(...names) {
        var existNames;
        var addNames;
        return this.each((node, index) => {
            existNames = this.classNames(index);
            addNames = names.filter(name => !existNames.includes(name));
            if (addNames.length > 0) {
                node.className = existNames.concat(addNames).join(' ');
            }
        })
    }

    removeClass(...names) {
        return this.each((node, index) => {
            node.className = this.classNames(index)
                .filter(name => !names.includes(name))
                .join(' ');
        })

    }

    parent() {
        return new Dom(this[0].parentNode);
    }

    find(selector) {
        return new Dom(this[0].querySelectorAll(selector));
    }

    val(val) {
        if (val === undefined) {
            return this[0].value;
        }
        else this.each(node => node.value = val);
        return this;
    }

    html(html) {
        if (html === undefined) {
            return this[0].innerHTML;
        }
        else {
            return this.each(node => node.innerHTML = html);
        }
    }

    append(newNode) {
        return this.each(node => {
            node.appendChild(newNode)
        });
    }


    on(type, fn) {
        return this.each((node, index) => {
            node.addEventListener(type, fn);
            pushEventCache(node, type, fn);
        })
    }

    off(type, fn) {
        return this.each((node, index) => {
            if (fn === undefined) {
                let fns = getEventCache(node, type);
                if (fns) {
                    fns.forEach((fn) => node.removeEventListener(type, fn));
                    clearEventCache(node, type);
                }
            }
            else {
                node.removeEventListener(type, fn);
                removeEventCache(node, type, fn);
            }

        })
    }

    onDelegate(type, selector, fn) {

        //代理的目标node
        let tarNodes = this.find(selector).nodes;

        return this.each((node) => {

            let listener = function (e) {
                if (tarNodes.includes(e.target)) {
                    fn.apply(this, arguments);
                }
            }

            listener.isDelegate = true;
            listener.selector = selector;
            listener.callback = fn;

            node.addEventListener(type, listener);

            pushEventCache(node, type, listener);
        });
    }

    //需要保证和onDelegate的type,selector,fn都相同。
    //或者
    //  缺省fn,则是取消对selector的代理监听。
    //  缺省selector和fn,则是取消在当前对type类型事件的所有代理监听。
    offDelegate(type, selector, fn) {

        return this.each((node) => {
            var data = getEventCache(node, type);
            if (!data) return;

            var listeners = data.filter((fn) => fn.isDelegate);
            if (selector) listeners = listeners.filter(fn => fn.selector === selector);
            if (fn) listeners = listeners.filter(fn => fn.callback === fn);

            listeners.forEach(listener => {
                node.removeEventListener(type, listener);
                removeEventCache(node, type, listener);
            })
        })
    }
}


//region event help
const nodeExpando = function (node) {
    var data = node._expando_event;
    if (!data) {
        data = node._expando_event = {};
    }
    return data;
};
const getEventCache = function (node, type) {
    return nodeExpando(node)[type];
}
const pushEventCache = function (node, type, fn) {
    var data = nodeExpando(node);
    if (!data[type]) {
        data[type] = [fn];
    }
    else {
        data[type].push(fn);
    }
}
const removeEventCache = function (node, type, fn) {
    var data = nodeExpando(node);
    var index;
    if (data[type]) {
        index = data[type].indexOf(fn);
    }
    if (index && index > -1) {
        data[type].splice(index, 1);
    }
    if (data[type].length === 0) {
        delete data[type]
    }
}
const clearEventCache = function (node, type) {
    delete nodeExpando(node)[type];
}


const pushDelegateMap = function (fn, delegateFn) {

}

//endregion


export default function (selector) {
    return new Dom(document.querySelectorAll(selector));
};