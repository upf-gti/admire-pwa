(this["webpackJsonpadmire-pwa"]=this["webpackJsonpadmire-pwa"]||[]).push([[3],{467:function(e,t,i){"use strict";i.r(t);var n=i(5),c=i(20),s=i.n(c),a=(i(25),i(1)),o=i(0),l=performance.now(),r=new Array(10);function d(e){var t=e.stream,i=e.show,c=Object(a.useState)(null),d=Object(n.a)(c,2),u=d[0],j=d[1],b=Object(a.useState)(null),v=Object(n.a)(b,2),m=v[0],x=v[1],p=Object(a.useState)(null),f=Object(n.a)(p,2),h=f[0],O=f[1],w=Object(a.useState)(null),g=Object(n.a)(w,2),N=g[0],S=g[1],y=Object(a.useState)(0),k=Object(n.a)(y,2),C=k[0],A=k[1],V=Object(a.useRef)();function E(){if(!(performance.now()-l<24)){l=performance.now();var e=new Uint8Array(m.frequencyBinCount);m.getByteFrequencyData(e);var t=e.reduce((function(e,t){return e+t}),0)/e.length;r.shift(),r.push(Math.round(t)),window.microphone_gain_data=r;A(t)}}return window.ctx=u,Object(a.useEffect)((function(){u=new AudioContext,m=u.createAnalyser(),h=u.createMediaStreamSource(t),N=u.createScriptProcessor(256,1,1),m.smoothingTimeConstant=.8,m.fftSize=1024,h.connect(m),m.connect(N),N.connect(u.destination),N.onaudioprocess=E,j(u),x(m),O(h),S(N)}),[t]),Object(a.useEffect)((function(){if(u){switch(i){case!0:u.resume();break;case!1:u.suspend(),A(0)}return function(){u.suspend()}}}),[i]),Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("div",{ref:V,className:"jsx-445103720 pids-wrapper",children:Array.from({length:10},(function(e,t){return Object(o.jsx)("div",{style:{background:10*t<C?"#69ce2b":"#e6e7e8"},className:"jsx-445103720 pid"},t)}))}),Object(o.jsx)(s.a,{id:"445103720",children:[".pids-wrapper{width:100%;line-height:1.5rem;}",".pid{width:calc(10% - 2px);height:10px;display:inline-block;margin:1px;}"]})]})}var u=i(486),j=i(198),b=i(156),v=i(218),m=i(49),x=i(152);t.default=function(){var e,t,i,c,l,r,p,f,h,O,w,g,N=Object(a.useContext)(m.a),S=Object(a.useState)(!1),y=Object(n.a)(S,2),k=y[0],C=y[1];return Object(a.useEffect)((function(){return N.init(),function(){N.stop(),C(!1)}}),[]),Object(o.jsxs)("div",{id:"devices",className:"jsx-3321974121",children:[Object(o.jsxs)(u.a,{id:"devices-row",children:[Object(o.jsx)(j.a,{children:Object(o.jsx)(x.a,{id:"local",stream:N.localStream,isLocal:!k})}),Object(o.jsxs)(j.a,{children:[Object(o.jsx)(b.a,{className:"pb-1",controlId:"floatingSelect",label:Object(o.jsxs)("span",{className:"jsx-3321974121",children:[" ",Object(o.jsx)("i",{className:"jsx-3321974121 bi bi-camera-video"})," Video devices"]}),children:Object(o.jsxs)(v.a.Select,{value:null!==(e=null===(t=N.settings)||void 0===t?void 0:t.video)&&void 0!==e?e:"None",onChange:function(e){var t=e.target;N.setVideo(t.value)},children:[(null===(i=N.devices)||void 0===i?void 0:i.video)&&Object.keys(null===(c=N.devices)||void 0===c?void 0:c.video).map((function(e,t){return Object(o.jsx)("option",{value:e,className:"jsx-3321974121",children:e},t)})),!(null!==(l=N.devices)&&void 0!==l&&l.video)&&Object(o.jsx)("option",{className:"jsx-3321974121",children:"No video devices found"},0)]})}),Object(o.jsx)(b.a,{className:"pb-1",controlId:"floatingSelect",label:Object(o.jsxs)("span",{className:"jsx-3321974121",children:[" ",Object(o.jsx)("i",{className:"jsx-3321974121 bi bi-camera-video"})," Video resolutions"]}),children:Object(o.jsxs)(v.a.Select,{value:null!==(r=null===(p=N.settings)||void 0===p?void 0:p.resolution)&&void 0!==r?r:"Undefined",onChange:function(e){var t,i,n=e.target;N.setVideo(null!==(t=null===(i=N.settings)||void 0===i?void 0:i.video)&&void 0!==t?t:"None",n.value)},children:[N.resolutions&&Object.keys(N.resolutions).map((function(e,t){return Object(o.jsx)("option",{value:e,className:"jsx-3321974121",children:e},t)})),!N.resolutions&&Object(o.jsx)("option",{className:"jsx-3321974121",children:"No video resolutions found"},0)]})}),Object(o.jsx)(b.a,{className:"pb-1",controlId:"floatingSelect",label:Object(o.jsxs)("span",{className:"jsx-3321974121",children:[" ",Object(o.jsx)("i",{className:"jsx-3321974121 bi bi-mic"})," Audio devices"]}),children:Object(o.jsxs)(v.a.Select,{value:null!==(f=null===(h=N.settings)||void 0===h?void 0:h.audio)&&void 0!==f?f:"None",onChange:function(e){var t=e.target;return N.setAudio(t.value)},children:[(null===(O=N.devices)||void 0===O?void 0:O.audio)&&Object.keys(null===(w=N.devices)||void 0===w?void 0:w.audio).map((function(e,t){return Object(o.jsx)("option",{value:e,className:"jsx-3321974121",children:e},t)})),!(null!==(g=N.devices)&&void 0!==g&&g.audio)&&Object(o.jsx)("option",{className:"jsx-3321974121",children:"No audio devices found"},0)]})}),Object(o.jsxs)("div",{className:"jsx-3321974121 d-flex",children:[Object(o.jsx)(v.a.Switch,{id:"hear-switch",label:"test",className:"me-2 user-select-none",name:"test-input",onChange:function(e){return C((function(e){return!e}))},defaultChecked:k}),Object(o.jsx)(d,{stream:N.localStream,show:k})]})]})]}),Object(o.jsx)(s.a,{id:"3321974121",children:["#page video{object-fit:cover !important;max-height:25vh;}","@media (orientation:landscape){#devices #devices-row{-webkit-flex-direction:row !important;-ms-flex-direction:row !important;flex-direction:row !important;}}","@media (orientation:portrait){#devices #devices-row{-webkit-flex-direction:column !important;-ms-flex-direction:column !important;flex-direction:column !important;}}"]})]})}}}]);
//# sourceMappingURL=3.162cada6.chunk.js.map