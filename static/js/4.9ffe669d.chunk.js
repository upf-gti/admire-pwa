(this["webpackJsonpadmire-pwa"]=this["webpackJsonpadmire-pwa"]||[]).push([[4],{305:function(e,t,n){"use strict";n.r(t);var i=n(6),c=n(16),s=n.n(c),r=n(1),o=n(298),a=n(89),l=n(49),d=n(33),u=n(129),j=n(0),v=performance.now(),b=new Array(10);function x(e){var t=e.stream,n=e.show,c=Object(r.useRef)(),o=Object(r.useRef)(),a=Object(r.useRef)(),l=Object(r.useRef)(),d=Object(r.useRef)(),u=Object(r.useState)(0),x=Object(i.a)(u,2),f=x[0],m=x[1];function h(){var e,t;if(!(performance.now()-v<24)){v=performance.now();var n=new Uint8Array(null===(e=a.current)||void 0===e?void 0:e.frequencyBinCount);null===(t=a.current)||void 0===t||t.getByteFrequencyData(n);var i=n.reduce((function(e,t){return e+t}),0)/n.length;b.shift(),b.push(Math.round(i)),window.microphone_gain_data=b,m(i)}}return window.ctx=o,Object(r.useEffect)((function(){var e,n,i,c;o.current=new AudioContext,a.current=null===(e=o.current)||void 0===e?void 0:e.createAnalyser(),l.current=null===(n=o.current)||void 0===n?void 0:n.createMediaStreamSource(t),d.current=null===(i=o.current)||void 0===i?void 0:i.createScriptProcessor(256,1,1),a.current.smoothingTimeConstant=.8,a.current.fftSize=1024,l.current.connect(a.current),a.current.connect(d.current),d.current.connect(null===(c=o.current)||void 0===c?void 0:c.destination),d.current.onaudioprocess=h}),[t]),Object(r.useEffect)((function(){var e;if(o){var t;if(n)null===(e=o.current)||void 0===e||e.resume();else null===(t=o.current)||void 0===t||t.suspend(),m(0);return function(){var e;null===(e=o.current)||void 0===e||e.suspend()}}}),[n]),Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)("div",{ref:c,className:"jsx-445103720 pids-wrapper",children:Array.from({length:10},(function(e,t){return Object(j.jsx)("div",{style:{background:10*t<f?"#69ce2b":"#e6e7e8"},className:"jsx-445103720 pid"},t)}))}),Object(j.jsx)(s.a,{id:"445103720",children:[".pids-wrapper{width:100%;line-height:1.5rem;}",".pid{width:calc(10% - 2px);height:10px;display:inline-block;margin:1px;}"]})]})}var f=n(40);t.default=function(){var e,t,n,c,v,b,m,h,p,O,w,g,N=Object(r.useContext)(f.a),S=Object(r.useState)(!1),y=Object(i.a)(S,2),k=y[0],C=y[1];return Object(r.useEffect)((function(){return N.init(),function(){N.stop(),C(!1)}}),[]),Object(j.jsxs)("div",{id:"devices",className:"jsx-2619548114",children:[Object(j.jsx)("h3",{className:"jsx-2619548114 pt-2",children:Object(j.jsx)("b",{className:"jsx-2619548114",children:"Media Devices"})}),Object(j.jsxs)(o.a,{id:"devices-row",children:[Object(j.jsx)(a.a,{md:6,children:Object(j.jsx)(u.a,{id:"local",stream:N.localStream,isLocal:!k})}),Object(j.jsxs)(a.a,{md:6,children:[Object(j.jsx)(l.a,{className:"pb-1",controlId:"floatingSelect",label:Object(j.jsxs)("span",{className:"jsx-2619548114",children:[" ",Object(j.jsx)("i",{className:"jsx-2619548114 bi bi-camera-video"})," Video devices"]}),children:Object(j.jsxs)(d.a.Select,{value:null!==(e=null===(t=N.settings)||void 0===t?void 0:t.video)&&void 0!==e?e:"None",onChange:function(e){var t=e.target;N.setVideo(t.value)},children:[(null===(n=N.devices)||void 0===n?void 0:n.video)&&Object.keys(null===(c=N.devices)||void 0===c?void 0:c.video).map((function(e,t){return Object(j.jsx)("option",{value:e,className:"jsx-2619548114",children:e},t)})),!(null!==(v=N.devices)&&void 0!==v&&v.video)&&Object(j.jsx)("option",{className:"jsx-2619548114",children:"No video devices found"},0)]})}),Object(j.jsx)(l.a,{className:"pb-1",controlId:"floatingSelect",label:Object(j.jsxs)("span",{className:"jsx-2619548114",children:[" ",Object(j.jsx)("i",{className:"jsx-2619548114 bi bi-collection"})," Video resolutions"]}),children:Object(j.jsxs)(d.a.Select,{value:null!==(b=null===(m=N.settings)||void 0===m?void 0:m.resolution)&&void 0!==b?b:"Undefined",onChange:function(e){var t,n,i=e.target;N.setVideo(null!==(t=null===(n=N.settings)||void 0===n?void 0:n.video)&&void 0!==t?t:"None",i.value)},children:[N.resolutions&&Object.keys(N.resolutions).map((function(e,t){return Object(j.jsx)("option",{value:e,className:"jsx-2619548114",children:e},t)})),!N.resolutions&&Object(j.jsx)("option",{className:"jsx-2619548114",children:"No video resolutions found"},0)]})}),Object(j.jsx)(l.a,{className:"pb-1",controlId:"floatingSelect",label:Object(j.jsxs)("span",{className:"jsx-2619548114",children:[" ",Object(j.jsx)("i",{className:"jsx-2619548114 bi bi-mic"})," Audio devices"]}),children:Object(j.jsxs)(d.a.Select,{value:null!==(h=null===(p=N.settings)||void 0===p?void 0:p.audio)&&void 0!==h?h:"None",onChange:function(e){var t=e.target;return N.setAudio(t.value)},children:[(null===(O=N.devices)||void 0===O?void 0:O.audio)&&Object.keys(null===(w=N.devices)||void 0===w?void 0:w.audio).map((function(e,t){return Object(j.jsx)("option",{value:e,className:"jsx-2619548114",children:e},t)})),!(null!==(g=N.devices)&&void 0!==g&&g.audio)&&Object(j.jsx)("option",{className:"jsx-2619548114",children:"No audio devices found"},0)]})}),Object(j.jsxs)("div",{className:"jsx-2619548114 d-flex",children:[Object(j.jsx)(d.a.Switch,{id:"hear-switch",label:"Test",className:"me-2 user-select-none",name:"test-input",onChange:function(e){return C((function(e){return!e}))},defaultChecked:k}),Object(j.jsx)(x,{stream:N.localStream,show:k})]})]})]}),Object(j.jsx)(s.a,{id:"2619548114",children:["#page video{object-fit:cover !important;max-height:25vh;}","#devices-row{overflow-y:scroll;}","@media only screen and (orientation:landscape) and (max-height:671px){#devices .row{-webkit-flex-direction:row !important;-ms-flex-direction:row !important;flex-direction:row !important;}#devices .row .col{-webkit-align-self:start;-ms-flex-item-align:start;align-self:start;}}"]})]})}}}]);
//# sourceMappingURL=4.9ffe669d.chunk.js.map