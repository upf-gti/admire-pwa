(this["webpackJsonpadmire-pwa"]=this["webpackJsonpadmire-pwa"]||[]).push([[7],{471:function(e,t,n){"use strict";n.r(t);var r=n(12),a=n.n(r),i=n(15),o=n(6),c=n(18),u=n.n(c),f=n(1),s=n(464),l=n(90),d=n.p+"static/media/shader.0b6fb8d4.fs",E="\nattribute vec3 a_position;\nattribute vec2 a_texcoord;\n\nvarying vec2 v_texcoord;\n\nvoid main()\n{\n    gl_Position = vec4(a_position, 1.0);\n    v_texcoord = a_texcoord;\n}\n",h="\nprecision mediump float;\n\nvarying vec2 v_texcoord;\n\nuniform sampler2D u_frame;\n\nvoid main()\n{\n    gl_FragColor = texture2D(u_frame, v_texcoord);\n}\n";function m(e){if(!(e instanceof HTMLCanvasElement))return null;var t=e.getContext("webgl"),n=null,r=null,a=null,i=null,o=null,c=null,u=null,f=null,s=null;var l=function(e,n){var r=t.createShader(n);if(t.shaderSource(r,e),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS)){var a=t.getShaderInfoLog(r);return console.error("Error while compiling  ".concat(n===t.FRAGMENT_SHADER?"fragment":"vertex"," shader: "),a),console.error(e.split("\n").map((function(e,t){return"".concat(t.toString().padStart(4,"0"),"\t").concat(e)})).join("\n")),console.error("--------------------------------------------------------------------------------------"),null}return r},d=function(e,n){u=t.createProgram();var r=l(e,t.VERTEX_SHADER);if(!r)return!1;var a=l(n,t.FRAGMENT_SHADER);return!!a&&(t.attachShader(u,r),t.attachShader(u,a),t.deleteShader(r),t.deleteShader(a),t.linkProgram(u),!0)},m=function(){t.useProgram(u)},R=function(){var e=t.getAttribLocation(u,"a_position"),n=3,r=t.FLOAT,c=!1,f=0,s=0;t.bindBuffer(t.ARRAY_BUFFER,a),t.vertexAttribPointer(e,n,r,c,f,s),t.enableVertexAttribArray(e),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i);var l=t.getAttribLocation(u,"a_texcoord");n=2,r=t.FLOAT,c=!1,f=0,s=0,t.bindBuffer(t.ARRAY_BUFFER,o),t.vertexAttribPointer(l,n,r,c,f,s),t.enableVertexAttribArray(l)},v=function(){var e=t.getUniformLocation(u,"u_frame");t.uniform1i(e,0)},_=function a(){var i;s&&s(),(i=r)instanceof HTMLImageElement||i instanceof HTMLCanvasElement?e.width==i.width&&e.height==i.height||(e.width=i.width,e.height=i.height):i instanceof HTMLVideoElement&&(e.width==i.videoWidth&&e.height==i.videoHeight||(e.width=i.videoWidth,e.height=i.videoHeight)),function(e){var n=t.TEXTURE_2D,r=t.RGBA,a=t.RGBA,i=t.UNSIGNED_BYTE;t.texImage2D(n,0,r,a,i,e)}(r),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT|t.STENCIL_BUFFER_BIT),t.viewport(0,0,e.width,e.height),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0),n=window.requestAnimationFrame(a)};return a=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,new Float32Array([1,1,0,1,-1,0,-1,-1,0,-1,1,0]),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),i=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),o=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,new Float32Array([1,0,1,1,0,1,0,0]),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),function(){c=t.createTexture(),t.activeTexture(t.TEXTURE0+0),t.bindTexture(t.TEXTURE_2D,c),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR);var e=t.TEXTURE_2D,n=t.RGBA,r=t.RGBA,a=t.UNSIGNED_BYTE,i=new Uint8Array([0,0,0,255]);t.texImage2D(e,0,n,1,1,0,r,a,i)}(),d(E,h),m(),R(),v(),{getCanvas:function(){return e},getStream:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return f||(f=e.captureStream(t)),f},setSource:function(e){return!!function(e){return[HTMLImageElement,HTMLCanvasElement,HTMLVideoElement].some((function(t){return e instanceof t}))}(e)&&(r=e,!0)},setShader:function(e){d(E,e)?(m(),R(),v()):(d(E,h),m(),R(),v())},setUpdate:function(e){s=e},setInt:function(e,n){var r=t.getUniformLocation(u,e);t.uniform1i(r,n)},setFloat:function(e,n){var r=t.getUniformLocation(u,e);t.uniform1f(r,n)},setVector:function(e){for(var n=t.getUniformLocation(u,e),r=arguments.length,a=new Array(r>1?r-1:0),i=1;i<r;i++)a[i-1]=arguments[i];switch(a.length){case 2:t.uniform2f(n,a);break;case 3:t.uniform3f(n,a);break;case 4:t.uniform4f(n,a)}},setMatrix:function(e,n){var r=t.getUniformLocation(u,e);switch(n.length){case 4:t.uniformMatrix2fv(r,!1,n);break;case 9:t.uniformMatrix3fv(r,!1,n);break;case 16:t.uniformMatrix4fv(r,!1,n)}},start:function(){!n&&r&&_()},stop:function(){n&&(window.cancelAnimationFrame(n),n=null)}}}var R=n(46),v=n(0);t.default=function(){var e=Object(f.useRef)(null),t=Object(f.useState)(null),n=Object(o.a)(t,2),r=n[0],c=n[1],E=Object(f.useContext)(R.a);Object(f.useRef)([]).current;function h(){return _.apply(this,arguments)}function _(){return(_=Object(i.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r.setFloat("u_time",.001*performance.now());case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(f.useEffect)((function(){return Object(i.a)(a.a.mark((function t(){var n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(d).then((function(e){return e.text()}));case 2:n=t.sent,(r=new m(e.current)).setShader(n),r.setUpdate(h),c(r);case 7:case"end":return t.stop()}}),t)})))(),function(){r&&(r.stop(),r.setUpdate(null))}}),[]),Object(f.useEffect)((function(){var e;if(r&&E.localStream)return Object(i.a)(a.a.mark((function t(){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(e=document.createElement("video")).muted=!0,e.width=320,e.height=240,e.autoplay=!0,e.playsinline=!0,e.src=e.srcObject=E.localStream,e.addEventListener("loadeddata",(function(){e.readyState>=2&&(e.play(),r.setSource(e),r.start(),Object(i.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})))())}));case 8:case"end":return t.stop()}}),t)})))(),function(){var t;null===(t=e)||void 0===t||t.pause()}}),[r,E.localStream]),Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("div",{id:"shader",className:"jsx-2072028388",children:Object(v.jsxs)(s.a,{children:[Object(v.jsx)("h1",{className:"jsx-2072028388",children:"Shader"}),Object(v.jsx)(l.a,{xs:12,children:Object(v.jsx)("canvas",{id:"shader-canvas",ref:e,style:{objectFit:"contain",width:"100%",height:"100%",maxHeight:"calc(100vh - 14rem)"},className:"jsx-2072028388"})})]})}),Object(v.jsx)(u.a,{id:"2072028388",children:[]})]})}}}]);
//# sourceMappingURL=7.b2335745.chunk.js.map