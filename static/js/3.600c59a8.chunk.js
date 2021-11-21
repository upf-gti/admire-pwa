(this["webpackJsonpadmire-pwa"]=this["webpackJsonpadmire-pwa"]||[]).push([[3],{465:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return g}));var r,a=n(14),i=n.n(a),o=n(18),c=n(34),s=n(6),u=n(20),f=n.n(u),l=n(1),d=n(487),m=n(200),h=n(491),E=n(219),v=(n(492),n(493),n(55)),x=n(494),R=n(27),b=n(0);function g(){var e=Object(l.useState)({x:0,y:0,w:0,h:0}),t=Object(s.a)(e,2),n=t[0],a=t[1],u=(Object(l.useRef)(null),Object(l.useRef)(null)),g=Object(l.useState)(null),p=Object(s.a)(g,2),A=(p[0],p[1],Object(l.useContext)(v.a));function _(e){e.image;var t,n=e.detections,r=Object(c.a)(n);try{for(r.s();!(t=r.n()).done;){var i=t.value,o=(i.L,i.boundingBox);i.landmarks;a({x:o.xCenter,y:o.yCenter,w:o.width,h:o.height})}}catch(s){r.e(s)}finally{r.f()}}function T(){return(T=Object(o.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new x.FaceDetection({locateFile:function(e){return"https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/".concat(e)}}),window.faceDetection=r,r.setOptions({selfieMode:!0,model:"short",minDetectionConfidence:.5}),r.onResults(_),e.next=6,r.initialize();case 6:return t=setInterval(Object(o.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(u.current){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,r.send({image:u.current});case 5:e.next=9;break;case 7:e.prev=7,e.t0=e.catch(2);case 9:case"end":return e.stop()}}),e,null,[[2,7]])}))),120),e.abrupt("return",(function(){cancelAnimationFrame(t),r.destroy()}));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(l.useEffect)((function(){var e;if(A.ready)return null===(e=r)||void 0===e||e.reset(),u.current.srcObject=A.localStream,u.current.play(),function(){return T.apply(this,arguments)}()}),[A.ready,A.localStream]);var w=Math.max(0,Math.min(100,100-400*n.w)),j=Math.max(0,Math.min(100,100*n.w)),F=Math.max(0,Math.min(100,100-w-j)),O="\n    The pose detection step is used to detect the pose of the person in the image. Position yourself centered on the image within the green valid range.\n    If the conditions are not met, reposition yourself or the camera.\n    ".concat(n.w>.3?"* \u274c You are in the too close to the camera.":"* \u2714\ufe0f Your distance to camera looks good.","\n    ").concat(n.y-n.h<0?"* \u274c You are too far from the camera.":n.y-n.h<.13?"* \u26a0\ufe0f Your face is to near to the top margin.":"* \u2714\ufe0f Got enough space on top.","\n    ").concat(Math.abs(n.x-.5)>.01*w?"* \u274c You are not centered at all.":Math.abs(n.x-.5)>.01*j?"* \u26a0\ufe0f You haven't enough margin of movement.":"* \u2714\ufe0f You got enough space on the sides","\n    ");return Object(b.jsxs)(b.Fragment,{children:[Object(b.jsxs)("div",{id:"pose",className:"jsx-1448417324",children:[Object(b.jsx)("h3",{className:"jsx-1448417324 pt-2",children:Object(b.jsx)("b",{className:"jsx-1448417324",children:"Step 3: Positioning in frame"})}),Object(b.jsxs)(d.a,{children:[Object(b.jsxs)(m.a,{children:[Object(b.jsx)("video",{style:{transform:"rotateY(180deg)",width:"100%"},ref:u,className:"jsx-1448417324"}),Object(b.jsxs)(h.a,{children:[Object(b.jsx)(h.a,{variant:"danger",now:.5*F},1),Object(b.jsx)(h.a,{variant:"warning",now:.5*j},2),Object(b.jsx)(h.a,{variant:"success",now:w},3),Object(b.jsx)(h.a,{variant:"warning",now:.5*j},4),Object(b.jsx)(h.a,{variant:"danger",now:.5*F},5)]}),Object(b.jsx)(E.a.Range,{id:"range",value:100*n.x})]}),Object(b.jsx)(m.a,{children:Object(b.jsx)(R.a,{className:"user-select-none",children:O})})]})]}),Object(b.jsx)(f.a,{id:"1448417324",children:["#pose .row{-webkit-flex-direction:column !important;-ms-flex-direction:column !important;flex-direction:column !important;}","@media only screen and (orientation:landscape) and (max-height:671px){#pose .row{-webkit-flex-direction:row !important;-ms-flex-direction:row !important;flex-direction:row !important;}#pose .row .col{-webkit-align-self:start;-ms-flex-item-align:start;align-self:start;}}"]})]})}console.warn=function(){}},492:function(e,t,n){"use strict";t.a=n.p+"static/media/shader.0b6fb8d4.fs"},493:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r="\nattribute vec3 a_position;\nattribute vec2 a_texcoord;\n\nvarying vec2 v_texcoord;\n\nvoid main()\n{\n    gl_Position = vec4(a_position, 1.0);\n    v_texcoord = a_texcoord;\n}\n",a="\nprecision mediump float;\n\nvarying vec2 v_texcoord;\n\nuniform sampler2D u_frame;\n\nvoid main()\n{\n    gl_FragColor = texture2D(u_frame, v_texcoord);\n}\n";function i(e){if(!(e instanceof HTMLCanvasElement))return null;var t=e.getContext("webgl"),n=null,i=null,o=null,c=null,s=null,u=null,f=null,l=null,d=null;var m=function(e,n){var r=t.createShader(n);if(t.shaderSource(r,e),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS)){var a=t.getShaderInfoLog(r);return console.error("Error while compiling  ".concat(n===t.FRAGMENT_SHADER?"fragment":"vertex"," shader: "),a),console.error(e.split("\n").map((function(e,t){return"".concat(t.toString().padStart(4,"0"),"\t").concat(e)})).join("\n")),console.error("--------------------------------------------------------------------------------------"),null}return r},h=function(e,n){f=t.createProgram();var r=m(e,t.VERTEX_SHADER);if(!r)return!1;var a=m(n,t.FRAGMENT_SHADER);return!!a&&(t.attachShader(f,r),t.attachShader(f,a),t.deleteShader(r),t.deleteShader(a),t.linkProgram(f),!0)},E=function(){t.useProgram(f)},v=function(){var e=t.getAttribLocation(f,"a_position"),n=3,r=t.FLOAT,a=!1,i=0,u=0;t.bindBuffer(t.ARRAY_BUFFER,o),t.vertexAttribPointer(e,n,r,a,i,u),t.enableVertexAttribArray(e),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,c);var l=t.getAttribLocation(f,"a_texcoord");n=2,r=t.FLOAT,a=!1,i=0,u=0,t.bindBuffer(t.ARRAY_BUFFER,s),t.vertexAttribPointer(l,n,r,a,i,u),t.enableVertexAttribArray(l)},x=function(){var e=t.getUniformLocation(f,"u_frame");t.uniform1i(e,0)},R=function r(){var a;d&&d(),(a=i)instanceof HTMLImageElement||a instanceof HTMLCanvasElement?e.width==a.width&&e.height==a.height||(e.width=a.width,e.height=a.height):a instanceof HTMLVideoElement&&(e.width==a.videoWidth&&e.height==a.videoHeight||(e.width=a.videoWidth,e.height=a.videoHeight)),function(e){var n=t.TEXTURE_2D,r=t.RGBA,a=t.RGBA,i=t.UNSIGNED_BYTE;t.texImage2D(n,0,r,a,i,e)}(i),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT|t.STENCIL_BUFFER_BIT),t.viewport(0,0,e.width,e.height),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0),n=window.requestAnimationFrame(r)};return o=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,new Float32Array([1,1,0,1,-1,0,-1,-1,0,-1,1,0]),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),c=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,c),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),s=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array([1,0,1,1,0,1,0,0]),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),function(){u=t.createTexture(),t.activeTexture(t.TEXTURE0+0),t.bindTexture(t.TEXTURE_2D,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR);var e=t.TEXTURE_2D,n=t.RGBA,r=t.RGBA,a=t.UNSIGNED_BYTE,i=new Uint8Array([0,0,0,255]);t.texImage2D(e,0,n,1,1,0,r,a,i)}(),h(r,a),E(),v(),x(),{getCanvas:function(){return e},getStream:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return l||(l=e.captureStream(t)),l},setSource:function(e){return!!function(e){return[HTMLImageElement,HTMLCanvasElement,HTMLVideoElement].some((function(t){return e instanceof t}))}(e)&&(i=e,!0)},setShader:function(e){h(r,e)?(E(),v(),x()):(h(r,a),E(),v(),x())},setUpdate:function(e){d=e},setInt:function(e,n){var r=t.getUniformLocation(f,e);t.uniform1i(r,n)},setFloat:function(e,n){var r=t.getUniformLocation(f,e);t.uniform1f(r,n)},setVector:function(e){for(var n=t.getUniformLocation(f,e),r=arguments.length,a=new Array(r>1?r-1:0),i=1;i<r;i++)a[i-1]=arguments[i];switch(a.length){case 2:t.uniform2f(n,a);break;case 3:t.uniform3f(n,a);break;case 4:t.uniform4f(n,a)}},setMatrix:function(e,n){var r=t.getUniformLocation(f,e);switch(n.length){case 4:t.uniformMatrix2fv(r,!1,n);break;case 9:t.uniformMatrix3fv(r,!1,n);break;case 16:t.uniformMatrix4fv(r,!1,n)}},start:function(){!n&&i&&R()},stop:function(){n&&(window.cancelAnimationFrame(n),n=null)}}}}}]);
//# sourceMappingURL=3.600c59a8.chunk.js.map