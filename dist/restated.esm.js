/** 
 * undefined v0.2.0
 * Copyright 2019 Mardix mcx2082@gmail.com
 * License: MIT
 * https://github.com/mardix/restated
 * Build date: 5/2/2019, 12:44:26 AM
 * 
 */
const e=(e,t)=>e&&"function"==typeof e[t],t=(e,t)=>{let r=null,n=void 0,_=void 0;return c=>{const o=c.___target___?{...c.___target___}:{...c};r&&((e,t)=>JSON.stringify(e)===JSON.stringify(t))(r,o)||(_=t(r=o)),n!==_&&(n=_,c[e]=_)}},r=(e,t)=>{let r=!1,n=!1;const _=new WeakMap,c=()=>{r?n||(n=!0):t()},o={get(e,t,r){if("___target___"===t)return e;const n=Reflect.get(e,t,r);if((e=>null===e||!["function","object"].includes(typeof e))(n)||"constructor"===t)return n;const c=((e,t)=>{let r=_.get(e);if(r)return r;r=new Map,_.set(e,r);let n=r.get(t);return n||(n=Reflect.getOwnPropertyDescriptor(e,t),r.set(t,n)),n})(e,t);if(c&&!c.configurable){if(c.set&&!c.get)return;if(!1===c.writable)return n}return new Proxy(n,o)},set(e,t,r,n){r&&void 0!==r.___target___&&(r=r.___target___);const _=Reflect.get(e,t,n),o=Reflect.set(e,t,r);return _!==r&&c(),o},defineProperty(e,t,r){const n=Reflect.defineProperty(e,t,r);return c(),n},deleteProperty(e,t){const r=Reflect.deleteProperty(e,t);return c(),r},apply(e,_,c){if(!r){r=!0;const o=Reflect.apply(e,_,c);return n&&t(),r=n=!1,o}return Reflect.apply(e,_,c)}};return new Proxy(e,o)};export default function(n={},_={}){const c=[],o=Object.keys(n).filter(t=>!e(n,t)).reduce((e,t)=>({...e,[t]:n[t]}),{}),f=Object.keys(n).filter(t=>e(n,t)).map(e=>t(e,n[e])),l=Object.keys(_).filter(t=>e(_,t)).reduce((e,t)=>({...e,[t]:(...e)=>(_[t].call(this,i,...e),l)}),{});let i=r(o,()=>{f.forEach(e=>e(i)),c.forEach(e=>e(i.___target___))});return f.forEach(e=>e(i)),{...l,getState:()=>i.___target___,subscribe:e=>(c.push(e),()=>c.splice(c.indexOf(e),1))}}
