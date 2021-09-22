// 和css media query保持一致， >1024展示pc屏样式。
// js中根据isPc会有一些逻辑调整，但是不会增删样式类，所有样式css中指定
const isPc = window.innerWidth >= 1024;

export {
    isPc
};