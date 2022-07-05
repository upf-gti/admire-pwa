import {useContext, useEffect, useState} from "react"
import {Row, Col, FloatingLabel, Form} from 'react-bootstrap'

import Video from 'partials/video'
import AudioGain from 'components/audioGain'
import { MediaContext } from 'utils/ctx_mediadevices'

export default ()=>{

    const media = useContext(MediaContext);
    const [test, setTest] = useState(false);

    useEffect(()=>{
        media.init();
    return ()=>{
        media.stop();
        setTest(false);
    }}, []);

    return <div id='devices'>

        <h3 className="pt-2"><b>Media Devices</b></h3>
        <Row id='devices-row'>

            <Col md={6}>
                <Video id="local" stream={media.localStream} isLocal={!test} />
            </Col>

            <Col md={6}>

                <FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-camera-video" /> Video devices</span>}>
                <Form.Select value={media.settings?.video ?? "None"} onChange={({ target }) => {
                    media.setVideo(target.value);
                }}>
                {media.devices?.video && Object.keys(media.devices?.video).map((v, k) => <option key={k} value={v}>{v}</option>)}
                {!media.devices?.video && <option key={0}>No video devices found</option>}
                </Form.Select>
                </FloatingLabel>

                {<FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-collection" /> Video resolutions</span>}>
                <Form.Select value={media.settings?.resolution ?? "Undefined"} onChange={({target}) => {
                    media.setVideo(media.settings?.video ?? "None", target.value);
                }}>
                {media.resolutions && Object.keys(media.resolutions).map((v, k) => <option key={k} value={v}>{v}</option>)}
                {!media.resolutions && <option key={0}>No video resolutions found</option>}
                </Form.Select>
                </FloatingLabel>}

                <FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-mic" /> Audio devices</span>}>
                <Form.Select value={media.settings?.audio ?? "None"} onChange={({ target }) => media.setAudio(target.value)}>
                {media.devices?.audio && Object.keys(media.devices?.audio).map((v, k) => <option key={k} value={v}>{v}</option>)}
                {!media.devices?.audio && <option key={0}>No audio devices found</option>}
                </Form.Select>
                </FloatingLabel>
                
                <div className='d-flex'>
                <Form.Switch id="hear-switch" label="Test" className="me-2 user-select-none" name="test-input" onChange={(e)=>setTest(t => !t)} defaultChecked={test}/>
                <AudioGain stream={media.localStream} show={test} />
                </div>
            </Col>
        </Row>

        <style global jsx>{`
   
            #page video {
                object-fit: cover !important;
                max-height: 25vh;
            }

            #devices-row{
                overflow-y: scroll;
            }

            @media only screen and (orientation: landscape) and (max-height: 671px) {           
                #devices .row{
                    flex-direction: row !important;
                    .col{
                        align-self: start;
                    }
                }
            }  
        `}</style>
    </div>
}