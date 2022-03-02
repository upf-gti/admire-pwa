//https://github.com/google/mediapipe/issues/2346#issuecomment-888062233

import { useState, useRef, useEffect, useContext, useCallback  } from 'react'
import { Row, Col, ProgressBar, Form, Image as ReactImage, Button, Badge } from 'react-bootstrap'
import { MediaContext } from 'utils/ctx_mediadevices'
import MD from 'utils/md'
import selfie from 'assets/img/selfie.png'
import img1 from 'assets/img/snipping.png'
import img2 from 'assets/img/score.png'
import http from 'utils/http'

console.warn = ()=>{}
let images = new Array(3).fill(<img style={{width:"100%"}}src={selfie} alt="0"/>);

export default function Pose() {
    const videoRef = useRef(null);
    const media = useContext(MediaContext);
    const [state, setState] = useState(0);

    function DataURIToBlob(dataURI) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
      }

    function makeSelfie(event) {
        if(!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        event.target.src = img.src;
        event.target.alt = '1';
        images[event.target.id] = <img src={img.src} score={Math.random().toFixed(2)} style={{transform:'scaleX(-1)'}}/>
        setState(s => s+1);

        http.post("https://admire-dev-iq.brainstorm3d.com/image/analyze", {});

        http.post("https://admire-dev-iq.brainstorm3d.com/image/analyze", {data:{ actor: img.src, studio: img.src }})
        // .then(response =>  {debugger})
        // .catch(error => {debugger})
    
        //send to server
    }

    useEffect(() => {
        if(!media.ready) return;
        videoRef.current.srcObject = media.localStream;
        videoRef.current.play();
    }, [media.ready, media.localStream]);

    //intro message for the selfie for image quality assesment step
    let message = `
    The image quality assessment step will score if the image <b>has enough light</b> and <b>enough contrast</b>.
    Take <b>3 selfies</b> with your face facing towards the camera. 
    The highlighted number shows the <b>best scored</b> capture.
    `;
    const [min,med,max] = images.map( v => parseFloat(v.props.score ?? 0)).sort()

    return <>
    <div id='selfie'>
        <h3 className="pt-2"><b>Step 4: Lighting Quality</b></h3>
        <Row>
        <Col md={6}>
            <video muted style={{ transform: "rotateY(180deg)", width:"100%" }} ref={videoRef}></video>

        </Col>
        <Col md={6}>
            <MD className="user-select-none">{message}</MD>
            <div id="carousel" className="d-flex flex-horizontal">
            { images.map( (v,k) => <div style={{position:'relative', width: "calc( 100% / 3)"}} key={k} onClick={makeSelfie}>
                <img className={v.props.score ? "mirrored" : ""} src={v.src ?? v.props.src} alt={`Selfie ${k}`} style={v.style} id={k}/>
                <Badge bg={parseFloat(v.props.score ?? 0) === max?"success":"secondary"}>{v.score ?? v.props.score}</Badge>
            </div> )}
            </div>
        </Col>
        </Row>
    </div>

    <style global jsx>{`
        @import "src/variables.scss";
        #selfie {
            #carousel{
                height: 100px; 
                &:nth-child(1) 
                {
                    margin-left: 0px;
                }

                img.mirrored {
                    transform: rotateY(180deg);
                    -webkit-transform:rotateY(180deg); /* Safari and Chrome */
                    -moz-transform:rotateY(180deg); /* Firefox */
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border: 1px solid rgba(0,0,0,0.1);
                    margin-left: 1px;
                    filter: opacity(80%);
                    transition: all .25s ease-in-out;
                    &:hover {
                        filter: opacity(100%);
                    }
                }

                .badge{
                    position: absolute;
                    top: .24rem;
                    margin-left: .25rem;
                }
            }
            
        }

        @media only screen and (orientation: landscape) and (max-height: 671px) {           
   
            #selfie {


                .row{
                    flex-direction: row !important;
                    .col{
                        align-self: start;
                    }
                }
            }
        }  
    `}</style>
    </>
}