

export default {
    log: function (txt) {
        var ele=document.querySelector('#log');
        if(!ele){
            ele=document.createElement('div');
            ele.id='log';
            document.body.appendChild(ele)
        }
        ele.innerHTML=ele.innerHTML+'<br/>'+txt;
    }
}