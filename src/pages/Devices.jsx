import MD from "utils/md"
import {useContext, useEffect} from "react"
import AudioGain from 'components/audioGain'
import {Row, Col, FloatingLabel, Form} from 'react-bootstrap'
import { MediaContext } from 'utils/ctx_mediadevices'
import Video from 'partials/video'

export default ()=>{

    const media = useContext(MediaContext);
    useEffect(()=>{
        media.init();
    return ()=>{
        media.stop();
    }
    })
    return <>
        <MD>{`
        # P1        
        `}</MD>

        <Row>
            <Col xs={12} sm={5} className="pb-2">
                <Video id="local" stream={media.localStream} local={true} />
            </Col>

            <Col xs={12} sm={7}>
                <FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-camera-video" /> Video devices</span>}>
                <Form.Select value={media.settings?.video ?? "None"} onChange={({ target }) => {
                    media.setVideo(target.value);
                }}>
                {media.devices?.video && Object.keys(media.devices?.video).map((v, k) => <option key={k} value={v}>{v}</option>)}
                {!media.devices?.video && <option key={0}>No video devices found</option>}
                </Form.Select>
                </FloatingLabel>

                {<FloatingLabel className="pb-1" controlId="floatingSelect" label={<span> <i className="bi bi-camera-video" /> Video resolutions</span>}>
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
                
                <AudioGain stream={media.localStream} show={true} />
            </Col>
        </Row>

        <style global jsx>{`
            @media (orientation: landscape){}
            @media (orientation: portrait){
                
            }
            #page video {
                object-fit: contain !important;
                max-height: 25vh;
            }
        `}</style>
    </>
}