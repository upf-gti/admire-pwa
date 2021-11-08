import Nav from "partials/nav"
import { useState, useContext } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { MediaContext } from 'utils/ctx_mediadevices'


export default () => {
    const media    = useContext(MediaContext);
    
    const audiotracks = media.localStream.getAudioTracks()??[];
    const [isAudioEnabled, setAudioEnabled] = useState(audiotracks.every( v => v.enabled ));
    
    const videotracks = media.localStream.getVideoTracks()??[];
    const [isVideoEnabled, setVideoEnabled] = useState(videotracks.every( v => v.enabled ));
    
    return <>
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
    </>
}

/*
        <Nav.Button onClick={()=>setShow(1)} label="Create room" appendclass="shadow rounded-circle bg-danger" >
            <i className="bi bi-plus-lg"></i> 
        </Nav.Button>
*/