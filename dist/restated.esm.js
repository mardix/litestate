/** 
 * undefined v1.0.1
 * Copyright 2019 Mardix mcx2082@gmail.com
 * License: MIT
 * https://github.com/mardix/restated
 * Build date: 5/23/2019, 10:52:49 AM
 * 
 */
const e="#",t=e=>Object.keys(e),r=(e,t)=>e&&"function"==typeof e[t],n=(t,r)=>{let n=null,o=void 0,c=void 0;return f=>{const l={...f[e]};n&&((e,t)=>JSON.stringify(e)===JSON.stringify(t))(n,l)||(c=r(n=l)),o!==c&&(o=c,f[t]=c)}};const o=e=>(function e(r){return t(r).forEach(function(t){const n=r[t];null!==n&&"object"==typeof n&&e(n)}),Object.freeze(r)})(function(e){if(null===e||"object"!=typeof e)return e;var t=e.constructor();for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=o(e[r]));return t}(e)),c=(t,r)=>{let n=!1,o=!1;const c=()=>{n?o||(o=!0):r()},f={get(t,r,n){if(r===e)return t;const o=Reflect.get(t,r,n);return(e=>null===e||!["function","object"].includes(typeof e))(o)||"constructor"===r?o:new Proxy(o,f)},set(t,r,n,o){n&&void 0!==n[e]&&(n=n[e]);const f=Reflect.get(t,r,o),l=Reflect.set(t,r,n);return f!==n&&c(),l},defineProperty(e,t,r){const n=Reflect.defineProperty(e,t,r);return c(),n},deleteProperty(e,t){const r=Reflect.deleteProperty(e,t);return c(),r},apply(e,t,c){if(!n){n=!0;const f=Reflect.apply(e,t,c);return o&&r(),n=o=!1,f}return Reflect.apply(e,t,c)}};return new Proxy(t,f)};export default function(f={}){const l=[],u=f.state||{},s=t(u).filter(e=>!r(u,e)).reduce((e,t)=>({...e,[t]:u[t]}),{}),i=t(u).filter(e=>r(u,e)).map(e=>n(e,u[e])),p=t(f).filter(e=>r(f,e)).reduce((e,t)=>({...e,[t]:(...e)=>(f[t].call(this,a,...e),p)}),{});let y={},a=c(s,()=>{i.forEach(e=>e(a)),l.forEach(t=>t(a[e])),y=o(a[e])});i.forEach(e=>e(a)),y=o(a[e]);const d={...p,getState:()=>y,subscribe:e=>(l.push(e),()=>l.splice(l.indexOf(e),1))};return new Proxy(d,{get:(e,t)=>t in e?e[t]:Reflect.get(y,t),set:(e,t,r)=>!1})}
