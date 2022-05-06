import {Button} from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'

export default ({id, stream, onClick, isLocal = false, ...props})=>{
    let ref = useRef(null);
    const [status, setStatus] = useState({audio:true});

    useEffect(()=>{
        if(stream && ref.current){
            ref.current.srcObject = stream;
            //ref.current.play();
        }
    },[stream]);

    function handleClick(){
        setStatus({...status, audio:!status.audio});
    }
    
    return <>
    <div className={`Video ${props.className??""}`} >
        <div className="stream-status position-absolute bottom-0 start-0">
            <span   className="status-user"> {id} </span>
            <Button className="status-audio" variant="link" disabled={isLocal} onClick={handleClick}>
                {isLocal? <i className={`bi bi-mic${!(isLocal||!status?.audio) ? "" : "-mute"}`} />
                :<i className={`fs-4 bi bi-volume${!(isLocal||!status?.audio) ? "-down" : "-mute"}`} />}
            </Button>
        </div>
        <video autoPlay playsInline muted={isLocal || !status?.audio} ref={ref} {...{onClick}}/>
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

            video{
                width: calc(100% + 2px);
                height:100%;
                object-fit: cover;
                margin-bottom: -9px;

                transform: rotateY(180deg);
                -webkit-transform:rotateY(180deg); /* Safari and Chrome */
                -moz-transform:rotateY(180deg); /* Firefox */
            }
        }

    `}</style>
    </>;
}