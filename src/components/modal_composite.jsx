import { useState, useContext, useEffect, useRef } from 'react'
import { Row, Col, Button, FloatingLabel, Form, Spinner } from 'react-bootstrap'

import http from 'utils/http'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'
import { StreamContext } from 'utils/ctx_streaming'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'

let lutResponse = null;

const F_NONE = 0;
const F_PROCESS = 1;
const F_SUCCESS = 2;
const F_ERROR = 3;

export default () => {
    const videoARef = useRef(null);
    const videoBRef = useRef(null);
    const auth        = useContext(AuthContext);
    const rooms       = useContext(RoomsContext);
    const media       = useContext(MediaContext);
    const wrtc        = useContext(StreamContext);
    const [show, setShow] = useState(false);
    const [A, setA] = useState('local');
    const [B, setB] = useState('local');
    const [fetching, setFetching] = useState(0);//0: not fetching, 1: fetching, 2: sucess, 3: failed

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
    
    function refreshStreams() {
        if(A && videoARef.current)
            videoARef.current.srcObject = wrtc.streams[A];
        if(B && videoBRef.current)
            videoBRef.current.srcObject = wrtc.streams[B];
    }

    function byteSize(str) {
        if(str.constructor !== String)
            str = JSON.stringify( str );
        return new Blob([str]).size;
    }

    function onOpen() {
        setShow(s => !s);
        setTimeout( refreshStreams, 100 );
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
        const base64Studio = snapshot( videoARef.current );
        const base64Actor = snapshot( videoBRef.current );

        let body = {
            studio: base64Studio,
            actor: base64Actor
        }

        console.log("Request body size (bytes) " + byteSize( body ));
        setFetching(F_PROCESS);

        http.post("https://admire-dev-iq.brainstorm3d.com/image/lut", {data: body})
        .then(response =>  { 
          
            setFetching(F_SUCCESS);
            setTimeout( () => { setFetching(F_NONE); } , 1500);
            lutResponse = response;
        }).catch(err => {
            setFetching(F_ERROR);
            console.error(err);
        })
    }

    function downloadLUT()
	{
		if(!lutResponse)
            throw("No LUT");

        let filename = A + "_" + B + ".lut";
		let file = new Blob( [lutResponse.lut], {type : 'text/plain'});
		var url = URL.createObjectURL( file );
		var element = document.createElement("a");
		element.setAttribute('href', url);
		element.setAttribute('download', filename );
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		setTimeout( () => URL.revokeObjectURL( url ) , 1000 * 60 ); //wait one minute to revoke url
	}

    let buttons = [];
    let submitButton;

    switch(fetching){
        case F_PROCESS: submitButton = <Button variant="outline-primary"><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button>; break;
        case F_SUCCESS: submitButton = <Button variant="outline-success">Done</Button>; break;
        case F_ERROR: submitButton = <Button variant="outline-danger">Error</Button>; break;
        default: submitButton = <Button onClick={submit} >Submit</Button>;
    }

    if(lutResponse) {
        buttons.push( <Button variant="link" onClick={downloadLUT}>Download LUT <i className="bi bi-download"/></Button> );
    }


    // buttons.push( <Button variant="outline-info" className="my-float-left" onClick={refreshStreams} >Refresh</Button> );
    buttons.push( submitButton );

    return <>
        <Button className="lutButton" onClick={onOpen} ><i className="bi bi-magic"/> Color Calibration</Button>
        <Modal buttons={buttons} id='configure' tabIndex="0" closeButton size="lg" {...{show, setShow}} _title={<span>Settings: Wizard</span>}>
            <Row id='devices-row'>
                <Col md={6}>
                    <h4>Studio</h4>
                    <video autoPlay muted className="lutVideo mirrored mx-auto d-block" ref={videoARef} style={{width:"100%", marginBottom: "6px"}}/>
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
                    <h4>Actor</h4>
                    <video autoPlay muted className="lutVideo mirrored mx-auto d-block" ref={videoBRef} style={{width:"100%", marginBottom: "6px"}}/>
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

            .my-float-left {
                margin: 0 auto !important;
                margin-left: 0px !important;
            }

            .mirrored {
                transform: rotateY(180deg);
                -webkit-transform:rotateY(180deg); /* Safari and Chrome */
                -moz-transform:rotateY(180deg); /* Firefox */
            }
            
            @media only screen and (orientation: portrait){

                .lutButton {
                    margin-bottom: 6px;
                }

                .lutVideo{
                    width: 70% !important;
                }
            }

        `}</style>
    </>;
}