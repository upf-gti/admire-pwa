(this["webpackJsonpadmire-pwa"]=this["webpackJsonpadmire-pwa"]||[]).push([[3],{468:function(e,t,n){"use strict";n.r(t);var i=n(6),c=n(20),s=n.n(c),o=n(1),r=n(487),a=n(200),l=n(158),d=n(219),u=n(154),j=n(0),v=performance.now(),b=new Array(10);function m(e){var t=e.stream,n=e.show,c=Object(o.useRef)(),r=Object(o.useRef)(),a=Object(o.useRef)(),l=Object(o.useRef)(),d=Object(o.useRef)(),u=Object(o.useState)(0),m=Object(i.a)(u,2),x=m[0],f=m[1];function p(){var e,t;if(!(performance.now()-v<24)){v=performance.now();var n=new Uint8Array(null===(e=a.current)||void 0===e?void 0:e.frequencyBinCount);null===(t=a.current)||void 0===t||t.getByteFrequencyData(n);var i=n.reduce((function(e,t){return e+t}),0)/n.length;b.shift(),b.push(Math.round(i)),window.microphone_gain_data=b,f(i)}}return window.ctx=r,Object(o.useEffect)((function(){var e,n,i,c;r.current=new AudioContext,a.current=null===(e=r.current)||void 0===e?void 0:e.createAnalyser(),l.current=null===(n=r.current)||void 0===n?void 0:n.createMediaStreamSource(t),d.current=null===(i=r.current)||void 0===i?void 0:i.createScriptProcessor(256,1,1),a.current.smoothingTimeConstant=.8,a.current.fftSize=1024,l.current.connect(a.current),a.current.connect(d.current),d.current.connect(null===(c=r.current)||void 0===c?void 0:c.destination),d.current.onaudioprocess=p}),[t]),Object(o.useEffect)((function(){var e;if(r){var t;if(n)null===(e=r.current)||void 0===e||e.resume();else null===(t=r.current)||void 0===t||t.suspend(),f(0);return function(){var e;null===(e=r.current)||void 0===e||e.suspend()}}}),[n]),Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)("div",{ref:c,className:"jsx-445103720 pids-wrapper",children:Array.from({length:10},(function(e,t){return Object(j.jsx)("div",{style:{background:10*t<x?"#69ce2b":"#e6e7e8"},className:"jsx-445103720 pid"},t)}))}),Object(j.jsx)(s.a,{id:"445103720",children:[".pids-wrapper{width:100%;line-height:1.5rem;}",".pid{width:calc(10% - 2px);height:10px;display:inline-block;margin:1px;}"]})]})}var x=n(56);t.default=function(){var e,t,n,c,v,b,f,p,h,O,w,g,N=Object(o.useContext)(x.a),S=Object(o.useState)(!1),y=Object(i.a)(S,2),k=y[0],C=y[1];return Object(o.useEffect)((function(){return N.init(),function(){N.stop(),C(!1)}}),[]),Object(j.jsxs)("div",{id:"devices",className:"jsx-3321974121",children:[Object(j.jsxs)(r.a,{id:"devices-row",children:[Object(j.jsx)(a.a,{children:Object(j.jsx)(u.a,{id:"local",stream:N.localStream,isLocal:!k})}),Object(j.jsxs)(a.a,{children:[Object(j.jsx)(l.a,{className:"pb-1",controlId:"floatingSelect",label:Object(j.jsxs)("span",{className:"jsx-3321974121",children:[" ",Object(j.jsx)("i",{className:"jsx-3321974121 bi bi-camera-video"})," Video devices"]}),children:Object(j.jsxs)(d.a.Select,{value:null!==(e=null===(t=N.settings)||void 0===t?void 0:t.video)&&void 0!==e?e:"None",onChange:function(e){var t=e.target;N.setVideo(t.value)},children:[(null===(n=N.devices)||void 0===n?void 0:n.video)&&Object.keys(null===(c=N.devices)||void 0===c?void 0:c.video).map((function(e,t){return Object(j.jsx)("option",{value:e,className:"jsx-3321974121",children:e},t)})),!(null!==(v=N.devices)&&void 0!==v&&v.video)&&Object(j.jsx)("option",{className:"jsx-3321974121",children:"No video devices found"},0)]})}),Object(j.jsx)(l.a,{className:"pb-1",controlId:"floatingSelect",label:Object(j.jsxs)("span",{className:"jsx-3321974121",children:[" ",Object(j.jsx)("i",{className:"jsx-3321974121 bi bi-camera-video"})," Video resolutions"]}),children:Object(j.jsxs)(d.a.Select,{value:null!==(b=null===(f=N.settings)||void 0===f?void 0:f.resolution)&&void 0!==b?b:"Undefined",onChange:function(e){var t,n,i=e.target;N.setVideo(null!==(t=null===(n=N.settings)||void 0===n?void 0:n.video)&&void 0!==t?t:"None",i.value)},children:[N.resolutions&&Object.keys(N.resolutions).map((function(e,t){return Object(j.jsx)("option",{value:e,className:"jsx-3321974121",children:e},t)})),!N.resolutions&&Object(j.jsx)("option",{className:"jsx-3321974121",children:"No video resolutions found"},0)]})}),Object(j.jsx)(l.a,{className:"pb-1",controlId:"floatingSelect",label:Object(j.jsxs)("span",{className:"jsx-3321974121",children:[" ",Object(j.jsx)("i",{className:"jsx-3321974121 bi bi-mic"})," Audio devices"]}),children:Object(j.jsxs)(d.a.Select,{value:null!==(p=null===(h=N.settings)||void 0===h?void 0:h.audio)&&void 0!==p?p:"None",onChange:function(e){var t=e.target;return N.setAudio(t.value)},children:[(null===(O=N.devices)||void 0===O?void 0:O.audio)&&Object.keys(null===(w=N.devices)||void 0===w?void 0:w.audio).map((function(e,t){return Object(j.jsx)("option",{value:e,className:"jsx-3321974121",children:e},t)})),!(null!==(g=N.devices)&&void 0!==g&&g.audio)&&Object(j.jsx)("option",{className:"jsx-3321974121",children:"No audio devices found"},0)]})}),Object(j.jsxs)("div",{className:"jsx-3321974121 d-flex",children:[Object(j.jsx)(d.a.Switch,{id:"hear-switch",label:"test",className:"me-2 user-select-none",name:"test-input",onChange:function(e){return C((function(e){return!e}))},defaultChecked:k}),Object(j.jsx)(m,{stream:N.localStream,show:k})]})]})]}),Object(j.jsx)(s.a,{id:"3321974121",children:["#page video{object-fit:cover !important;max-height:25vh;}","@media (orientation:landscape){#devices #devices-row{-webkit-flex-direction:row !important;-ms-flex-direction:row !important;flex-direction:row !important;}}","@media (orientation:portrait){#devices #devices-row{-webkit-flex-direction:column !important;-ms-flex-direction:column !important;flex-direction:column !important;}}"]})]})}}}]);
//# sourceMappingURL=3.61494a98.chunk.js.map