import common from './common.less';
import index from './index.less';
import mobile from './mobile.less';



var styleEle=document.createElement('style');
styleEle.innerHTML=`
@media screen and  (min-width:1024px){
  .topBtn{
    animation:topBtnHide .1s ease-in;
    animation-fill-mode: backwards;
  }
}
`;
document.head.appendChild(styleEle);