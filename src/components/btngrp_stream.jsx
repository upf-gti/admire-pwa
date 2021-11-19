import { useEffect, useState, useContext, useRef } from 'react'

import Nav from "partials/nav"
import { MediaContext } from 'utils/ctx_mediadevices'


export default () => {
    const canvasRef = useRef(null);
    const media    = useContext(MediaContext);
    const [isAudioEnabled, setAudioEnabled] = useState(false);
    //const videotracks = media.localStream.getVideoTracks()??[];
    //const [isVideoEnabled, setVideoEnabled] = useState(videotracks.every( v => v.enabled ));

    function handleClick()
    {
        const audiotracks = media.localStream.getAudioTracks()??[];
        const enabled = audiotracks.every(track => { track.enabled = !isAudioEnabled; return !!track.enabled;});
        setAudioEnabled(enabled); 
    }

    useEffect(() => {
        const audiotracks = media.localStream.getAudioTracks()??[];
        setAudioEnabled(audiotracks.every( v => v.enabled ))
    } , [media.localStream, media.settings?.audio]);

    useEffect(()=>{
        const ctx = canvasRef?.current?.getContext('2d');
        ctx.globalAlpha   = 0.5;
        function draw()
        {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            const [x0, y0, r0, x1, y1, r1] = [ctx.canvas.width*.5, ctx.canvas.height * .5, 135, ctx.canvas.width*.5,ctx.canvas.height * .5,ctx.canvas.height * .5];
            let gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.0)");
            gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.5)");
            gradient.addColorStop(.5, "rgba(255, 255, 255, 0.1)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            requestAnimationFrame(draw)
        }
        const id = requestAnimationFrame(draw);
        
    return ()=>{
        cancelAnimationFrame(id);
    }
    },[])

    return <>
    <div id='pulse-wrapper'className="p-4 rounded-circle" style={{marginTop: '-4rem', marginBottom: '-4rem'}}>
        <canvas width='512' height='512' ref={canvasRef} className='position-absolute top-0 rounded-circle'/>
        <Nav.Button onClick={handleClick} label="Create room" appendclass="shadow rounded-circle bg-danger" >
            <i className={isAudioEnabled?"bi bi-mic":"bi bi-mic-mute"}></i>
        </Nav.Button>
    </div>
    
    <style global jsx>{`
        #pulse-wrapper {
            //border: 1px dashed #ccc;
            margin: -3rem -1.5rem 0rem -1.5rem !important;
            overflow:hidden !important;

            .nav-button{
                margin-top: 0;
                margin-bottom: 0;
            }

            canvas {
                pointer-events: none;
                margin-top: .35rem;
                width: 5rem;
                height:5rem;
                transform:translate(-50%,-50%) scale(1.3) !important;
            }
    
        }
        @media only screen and (orientation: landscape) and (max-height: 671px) {           
            #pulse-wrapper {
                margin: -1.5rem 1rem -1.5rem -4rem !important;
                .nav-button{
                    margin-left: 0;
                    margin-right: 0;
                }
                canvas {
                    top: 50% !important;
                    margin-top: 0rem;
                }
            }
        }
        @media only screen and (orientation: portrait){

        } 
    
    `}</style>
    {/*
    <Nav.Button>
        <ButtonToolbar>
            
            <Button onClick={()=>{ 
                const enabled = audiotracks.every(track => { track.enabled = !isAudioEnabled; return !!track.enabled;});
                setAudioEnabled(enabled); 
            }}><i className={isAudioEnabled?"bi bi-mic-mute":"bi bi-mic-mute"}></i></Button>
            
            <Button onClick={()=>{ 
                const enabled = videotracks.every(track => { track.enabled = !isVideoEnabled; return !!track.enabled;});
                setVideoEnabled(enabled); 
            }}><i className={isVideoEnabled?"bi bi-camera-video":"bi bi-camera-video-off"}></i></Button>
        
        </ButtonToolbar>
    </Nav.Button>
    */}
    </>
}
