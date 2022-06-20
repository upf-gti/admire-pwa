import { Button, Image } from 'react-bootstrap'
import { useContext, useEffect, useState, useRef } from 'react'
import { MediaContext } from 'utils/ctx_mediadevices'

import face_mask from 'assets/img/face-mask.png'
import torso_mask from 'assets/img/torso-mask.png'
import body_mask from 'assets/img/body-mask.png'

export default ({id, stream, onClick, isLocal = false, ...props})=>{
    let ref = useRef(null);

    const [status, setStatus]   = useState({audio:true});
    const [mask, setMask]       = useState('None');
    const media                 = useContext(MediaContext);

    useEffect(()=>{
        if(stream && ref.current){
            ref.current.srcObject = stream;
        }

    },[stream]);

    function handleAudioClick() {
        setStatus({...status, audio:!status.audio});
    }

    function handleMask(value) {
        switch(value){
            case 'Face':
                return face_mask;
            case 'Torso':
                return torso_mask;
            case 'Body':
                return body_mask;
            default:
                return null;
        }
    }

    function handleMediaClick() {
        if(onClick !== undefined) onClick();
        else setMask(media.settings.mask);
    }

    function isValidMask() {
        // console.log("Mask is: " + media.settings.mask );
        return media.settings.mask && media.settings.mask !== 'None';
    }
    
    return <>
    <div className={`Video ${props.className??""}`} >
        <div className="stream-status position-absolute bottom-0 start-0">
            <span   className="status-user"> {id} </span>
            <Button className="status-audio" variant="link" disabled={isLocal} onClick={handleAudioClick}>
                {isLocal? <i className={`bi bi-mic${!(isLocal||!status?.audio) ? "" : "-mute"}`} />
                :<i className={`fs-4 bi bi-volume${!(isLocal||!status?.audio) ? "-down" : "-mute"}`} />}
            </Button>
        </div>
        {isValidMask() && !onClick ? <Image className="mask-image" onClick={handleMediaClick} src={handleMask(media.settings.mask)} width={media.settings.width} height={media.settings.height} /> : <></>}
        <video autoPlay playsInline muted={isLocal || !status?.audio} ref={ref} onClick={handleMediaClick} />
    </div>
    <style global jsx>{`
        @import 'src/variables.scss';

        #carousel-col .Video{

            background-clip: text;

            &:hover, .selected{
                opacity: 0.55;
                -webkit-opacity: 0.55;
                cursor: pointer;
            }
        }

        .Video{

            position: relative;
            margin:1px;
            padding:0;
            transition:all .2s ease-in-out;
            background-color: #333;

            .stream-status{ 
                color:white !important;
                z-index:1000;
                .status-user{
                    padding: 0rem 0.5rem;
                    padding-right:0;
                }
                .status-audio{
                    color:white !important;
                    cursor:pointer;
                    padding:0;
                    margin-bottom: -1.2rem;
                    margin-top: -1.4rem;
                    margin-left: -0.2rem;                    
                }
            }

            video {
                width: calc(100%);
                height:100%;
                object-fit: cover;
                margin-bottom: -9px;

                transform: rotateY(180deg);
                -webkit-transform:rotateY(180deg); /* Safari and Chrome */
                -moz-transform:rotateY(180deg); /* Firefox */
            }

            .mask-image {
                position: absolute;
                z-index: 1;
                width: auto;
                height: 100%;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
            }
        }

        .Video.stream {
            border: 3px inset #F33;
        }

    `}</style>
    </>;
}