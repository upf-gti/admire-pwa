import { useState, useRef, useEffect, useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import Shader from "assets/shader.fs"
import { CanvasRenderer } from 'lib_canvas_renderer'
import { MediaContext } from 'utils/ctx_mediadevices'

let video;

export default () => {
    const canvasRef = useRef(null);
    let [ctx, setCtx] = useState(null);
    const media = useContext(MediaContext);
    let {current: points} = useRef([]);

    useEffect(() => {
        (async () => {
            var shader = await fetch(Shader).then(v => v.text());
            ctx = new CanvasRenderer(canvasRef.current);
            ctx.setShader(shader);
            ctx.setUpdate(onUpdate);
            setCtx(ctx);
        })()

        return () => {
            if(ctx){
                ctx.stop();
                ctx.setUpdate(null);
            } 
        }
    }, []);

    useEffect(()=>{
        let video;
        if(!ctx || !media.localStream) return;
        (async ()=>{
            video = document.createElement("video");
     
            video.muted         = true;
            video.width         = 320;
            video.height        = 240;
            video.autoplay      = true;
            video.playsinline   = true;
            video.src = video.srcObject = media.localStream;
            
            video.addEventListener('loadeddata', () => {
                if(video.readyState >= 2) {
                    video.play();
                    ctx.setSource(video);
                    ctx.start();

                    (async ()=>{
                        // Create a detector.
                        //const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, { runtime: 'tfjs' });
                        //const poses = await detector.estimatePoses(video);
                        //console.log(poses)
                    })()
                }
            });
            
        })();

        return ()=>{
            video?.pause();
        }
    },[ctx, media.localStream]);

    async function onUpdate() {
        ctx.setFloat("u_time", performance.now() * 0.001);
    }

    return <>
        <div id='shader'>
            <Row>
            <h1>Shader</h1>
            <Col xs={12}>
                <canvas id="shader-canvas" ref={canvasRef} style={{objectFit:"contain", width:"100%", height:"100%", maxHeight:"calc(100vh - 14rem)"}}/>
            </Col>
        </Row>
        </div>
        <style global jsx>{`
            
        `}</style>
    </>
}