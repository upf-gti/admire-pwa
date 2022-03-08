import { useState, useContext, useEffect, useRef } from 'react'
import { Row, Col, Button,FloatingLabel, Form } from 'react-bootstrap'

import http from 'utils/http'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'
import { StreamContext } from 'utils/ctx_streaming'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'



export default () => {
    const videoARef = useRef(null);
    const videoBRef = useRef(null);
    const auth        = useContext(AuthContext);
    const rooms       = useContext(RoomsContext);
    const media       = useContext(MediaContext);
    const wrtc        = useContext(StreamContext);
    const [show, setShow] = useState(false);
    const [A, setA] = useState(Object.keys(wrtc.streams)[0] ?? null);
    const [B, setB] = useState(Object.keys(wrtc.streams)[0] ?? null);

    useEffect(()=>{//Constructor
        if(!rooms.ready || !media.ready) return;
        return ()=>{//Destructor
    }},[rooms.ready, media.ready]);

    useEffect(()=>{//Constructor
        if(!A || !videoARef.current) return;
        videoARef.current.srcObject = wrtc.streams[A];
        return ()=>{//Destructor
    }},[A, wrtc.streams]);

    useEffect(()=>{//Constructor
        if(!B || !videoBRef.current) return;
        videoBRef.current.srcObject = wrtc.streams[B];
        return ()=>{//Destructor
    }},[B, wrtc.streams]);
    

    function byteSize(str) {
        if(str.constructor !== String)
            str = JSON.stringify( str );
        return new Blob([str]).size;
    }

    function snapshot(video)
    {   
        const canvas  = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx      = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }

    function submit(){
        if(!A || !B) return;
        const base64Actor = snapshot( videoARef.current );
        const base64Studio = snapshot( videoBRef.current );

        let body = {
            actor: base64Actor, 
            studio: base64Studio
        }

        console.log("Request body size (bytes) " + byteSize( body ));

        http.post("https://admire-dev-iq.brainstorm3d.com/image/lut", {data: body})
        .then(response =>  {debugger})
        .catch(error => {debugger})
    }

    return <>
        <Button className="lutButton" onClick={()=>setShow(s => !s)} ><i className="bi bi-magic"/>Color Calibration</Button>
        <Modal buttons={[<Button onClick={submit}>Submit</Button>]} id='configure' tabIndex="0" closeButton size="lg" {...{show, setShow}} _title={<span>Settings: Wizard</span>}>
            <Row id='devices-row'>
                <Col md={6}>

                    <video autoPlay muted className="mirrored" ref={videoARef} style={{width:"100%"}}/>
                    {/*<Video muted fref={videoARef} stream={wrtc.streams[A]}/>*/}
                    <FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-camera-video" /> Video devices</span>}>
                    <Form.Select value={A} onChange={({ target }) => {
                        setA(target.value);
                    }}>
                    {Object.keys(wrtc.streams).map((v, k) => <option key={k} value={v}>{v}</option>)}
                    </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col md={6}>
                    <video autoPlay muted className="mirrored" ref={videoBRef} style={{width:"100%"}}/>
                    {/*<Video muted fref={videoBRef} stream={wrtc.streams[B]}/>*/}
                    <FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-camera-video" /> Video devices</span>}>
                    <Form.Select value={B} onChange={({ target }) => {
                        setB(target.value);
                    }}>
                   {Object.keys(wrtc.streams).map((v, k) => <option key={k} value={v}>{v}</option>)}
                    </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
        </Modal>
        <style global jsx>{`

            .mirrored {
                transform: rotateY(180deg);
                -webkit-transform:rotateY(180deg); /* Safari and Chrome */
                -moz-transform:rotateY(180deg); /* Firefox */
            }
            
            @media only screen and (orientation: portrait){

                .lutButton {
                    margin-bottom: 6px;
                }
            }

        `}</style>
    </>;
}