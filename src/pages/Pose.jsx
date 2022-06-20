//https://github.com/google/mediapipe/issues/2346#issuecomment-888062233

import { useState, useRef, useEffect, useContext } from 'react'
import { Row, Col, ProgressBar, FloatingLabel, Form } from 'react-bootstrap'
import { MediaContext } from 'utils/ctx_mediadevices'
import { FaceDetection } from '@mediapipe/face_detection'

import MD from 'utils/md'
import Video from 'partials/video'

console.warn = ()=>{}
let faceDetection = null;
let faceDetectionIntervalId;

const UserMasks = [
    'None',
    'Face',
    'Torso',
    'Body'
];

export default function Pose() {
    let [center, setCenter] = useState({x:0, y:0, w:0, h:0});
    const videoRef = useRef(null);

    const [mask, setMask] = useState('None');
    const media = useContext(MediaContext);

    useEffect(() => {
        
        if(!media.ready) 
        return;
        
        start();

        videoRef.current = document.querySelector("#pose video");
        videoRef.current.srcObject = media.localStream;
        videoRef.current.play();

        return () => {
            clearInterval(faceDetectionIntervalId);
        };

    }, [media.ready, media.localStream]);

    function onResults({image, detections}) {
        
        console.log(detections);

        for(let detection of detections) {
            const { L, boundingBox, landmarks } = detection;
            setCenter({
                x:boundingBox.xCenter, y:boundingBox.yCenter, w:boundingBox.width, h:boundingBox.height
            });
        }
    }

    async function start(){

        faceDetection = new FaceDetection({
            locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1628005423/${file}`;
            },
        });
        window.faceDetection = faceDetection; 
        faceDetection.setOptions( {
            selfieMode: true,
            model: "short",
            minDetectionConfidence: 0.5,
        });

        faceDetection.onResults(onResults);
        await faceDetection.initialize();

        faceDetectionIntervalId = setInterval(async () => {
            if(!videoRef.current){
                return;
            }
            try{
                await faceDetection.send({
                    image: videoRef.current,
                });
            }catch(e){}
        }, 120);
    }

    let validRange = Math.max(0,Math.min(100, 100 - center.w*400)),
        warningRange = Math.max(0,Math.min(100, center.w*100)),
        dangerRange = Math.max(0,Math.min(100, 100 - validRange - warningRange));

    // Intro message for the pose detection assesment step
    let message = `
        The pose detection step is used to detect the pose of the person in the image. Position yourself centered on the image within the green valid range.
        If the conditions are not met, reposition yourself or the camera.
        ${(center.w > .3) ? '* ❌ You are in the too close to the camera.': '* ✔️ Your distance to camera looks good.'}
        ${(center.y - center.h < 0.0)
            ? '* ❌ You are too far from the camera.'
        :(center.y - center.h < 0.13)
            ? '* ⚠️ Your face is to near to the top margin.' 
            : '* ✔️ Got enough space on top.'
        }
        ${(Math.abs(center.x - .5) > validRange*.01 ) 
            ?`* ❌ You are not centered at all.` 
        :(Math.abs(center.x - .5) > warningRange*.01 )
            ?'* ⚠️ Not enough margin of movement.'
            :'* ✔️ You got enough space on the sides'
        }
    `;

    return <>
        <div id='pose'>
        <h3 className="pt-2"><b>Step 3: Positioning in frame</b></h3>
            <Row>
            <Col md={6}>
                <Video id="local-pose" stream={media.localStream}  style={{ transform: "rotateY(180deg)", width:"100%" }} isLocal={true} />
                <ProgressBar>
                    <ProgressBar variant = "danger"  key = {1} now = {dangerRange*.5} />
                    <ProgressBar variant = "warning" key = {2} now = {warningRange*.5} />
                    <ProgressBar variant = "success" key = {3} now = {validRange} />
                    <ProgressBar variant = "warning" key = {4} now = {warningRange*.5} />
                    <ProgressBar variant = "danger"  key = {5} now = {dangerRange*.5} />
                </ProgressBar>
                <Form.Range id="range" value={center.x * 100}/>
            </Col>
            <Col md={6}>

                {<FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-mask" /> Mask</span>}>
                <Form.Select onChange={({target}) => {
                    media.setMask(target.value);
                    setMask(target.value);
                }} defaultValue={ media.settings.mask }>
                {UserMasks.map((v, k) => <option key={k} value={v}>{v}</option>)}
                </Form.Select>
                </FloatingLabel>}

                <MD className="user-select-none">{message}</MD>
            </Col>

            </Row>
        </div>

    <style global jsx>{`
        @import "src/variables.scss";

        @media only screen and (orientation: landscape) and (max-height: 671px) {           
            #pose .row{
                flex-direction: row !important;
                .col{
                    align-self: start;
                }
            }
        }  
    `}</style>
    </>
}