(this["webpackJsonpadmire-pwa"]=this["webpackJsonpadmire-pwa"]||[]).push([[5],{469:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return O}));var a,r=n(12),c=n.n(r),o=n(15),s=n(28),i=n(6),u=n(18),l=n.n(u),d=n(1),h=n(464),m=n(90),j=n(495),f=n(34),p=n(46),x=n(496),b=n(27),w=n(0);function O(){var e=Object(d.useState)({x:0,y:0,w:0,h:0}),t=Object(i.a)(e,2),n=t[0],r=t[1],u=(Object(d.useRef)(null),Object(d.useRef)(null)),O=Object(d.useState)(null),g=Object(i.a)(O,2),v=(g[0],g[1],Object(d.useContext)(p.a));function y(e){e.image;var t,n=e.detections,a=Object(s.a)(n);try{for(a.s();!(t=a.n()).done;){var c=t.value,o=(c.L,c.boundingBox);c.landmarks;r({x:o.xCenter,y:o.yCenter,w:o.width,h:o.height})}}catch(i){a.e(i)}finally{a.f()}}function k(){return(k=Object(o.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=new x.FaceDetection({locateFile:function(e){return"https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1628005423/".concat(e)}}),window.faceDetection=a,a.setOptions({selfieMode:!0,model:"short",minDetectionConfidence:.5}),a.onResults(y),e.next=6,a.initialize();case 6:return t=setInterval(Object(o.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(u.current){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,a.send({image:u.current});case 5:e.next=9;break;case 7:e.prev=7,e.t0=e.catch(2);case 9:case"end":return e.stop()}}),e,null,[[2,7]])}))),120),e.abrupt("return",(function(){cancelAnimationFrame(t),a.destroy()}));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(d.useEffect)((function(){var e;if(v.ready)return null===(e=a)||void 0===e||e.reset(),u.current.srcObject=v.localStream,u.current.play(),function(){return k.apply(this,arguments)}()}),[v.ready,v.localStream]);var M=Math.max(0,Math.min(100,100-400*n.w)),Y=Math.max(0,Math.min(100,100*n.w)),N=Math.max(0,Math.min(100,100-M-Y)),S="\n    The pose detection step is used to detect the pose of the person in the image. Position yourself centered on the image within the green valid range.\n    If the conditions are not met, reposition yourself or the camera.\n    ".concat(n.w>.3?"* \u274c You are in the too close to the camera.":"* \u2714\ufe0f Your distance to camera looks good.","\n    ").concat(n.y-n.h<0?"* \u274c You are too far from the camera.":n.y-n.h<.13?"* \u26a0\ufe0f Your face is to near to the top margin.":"* \u2714\ufe0f Got enough space on top.","\n    ").concat(Math.abs(n.x-.5)>.01*M?"* \u274c You are not centered at all.":Math.abs(n.x-.5)>.01*Y?"* \u26a0\ufe0f You haven't enough margin of movement.":"* \u2714\ufe0f You got enough space on the sides","\n    ");return Object(w.jsxs)(w.Fragment,{children:[Object(w.jsxs)("div",{id:"pose",className:"jsx-3988521993",children:[Object(w.jsx)("h3",{className:"jsx-3988521993 pt-2",children:Object(w.jsx)("b",{className:"jsx-3988521993",children:"Step 3: Positioning in frame"})}),Object(w.jsxs)(h.a,{children:[Object(w.jsxs)(m.a,{md:6,children:[Object(w.jsx)("video",{muted:!0,style:{transform:"rotateY(180deg)",width:"100%"},ref:u,className:"jsx-3988521993"}),Object(w.jsxs)(j.a,{children:[Object(w.jsx)(j.a,{variant:"danger",now:.5*N},1),Object(w.jsx)(j.a,{variant:"warning",now:.5*Y},2),Object(w.jsx)(j.a,{variant:"success",now:M},3),Object(w.jsx)(j.a,{variant:"warning",now:.5*Y},4),Object(w.jsx)(j.a,{variant:"danger",now:.5*N},5)]}),Object(w.jsx)(f.a.Range,{id:"range",value:100*n.x})]}),Object(w.jsx)(m.a,{md:6,children:Object(w.jsx)(b.a,{className:"user-select-none",children:S})})]})]}),Object(w.jsx)(l.a,{id:"3988521993",children:["@media only screen and (orientation:landscape) and (max-height:671px){#pose .row{-webkit-flex-direction:row !important;-ms-flex-direction:row !important;flex-direction:row !important;}#pose .row .col{-webkit-align-self:start;-ms-flex-item-align:start;align-self:start;}}"]})]})}console.warn=function(){}}}]);
//# sourceMappingURL=5.d9693bd6.chunk.js.map