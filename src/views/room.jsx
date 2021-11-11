//import { useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap'
import { useContext, useEffect,useLayoutEffect, useState, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"

import * as BRA from 'lib_bra'
import Video from 'partials/video'
import { RoomsContext } from 'utils/ctx_rooms'
import { StreamContext } from 'utils/ctx_streaming'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'
import BadgeForwardCall from 'components/badge_forward'

export default ({ ...props }) => {
    const history     = useHistory();
    const {roomId}    = useParams();
    const carouselRef = useRef();
    const auth        = useContext(AuthContext);
    const rooms       = useContext(RoomsContext);
    const media       = useContext(MediaContext);
    const wrtc        = useContext(StreamContext);

    const [state, setState]       = useState(0);
    const [selected, setSelected] = useState(null);

    useEffect(()=>{//Constructor
        if(!rooms.imInRoom(roomId) || !rooms.ready || !media.ready) 
            return;

        wrtc.callAllUsers();
    return ()=>{//Destructor
        wrtc.callHangupAll();
    }},[rooms.current, rooms.ready & media.ready]);

    useEffect( ()=>{
        wrtc.replaceStream(media.localStream);
    },[media.localStream]);

    /*useEffect(() => {
        function unload(){
            rooms.leaveRoom();
            document.body.addEventListener('unload', unload);
        }
        document.body.addEventListener('unload', unload);
        media.init();
    return ()=>{
        media.stop();
    }},[])
   
    useEffect(() => {
        function scrollHorizontal(e){
            this.scrollLeft += e.deltaY;
        }
        carouselRef.current?.removeEventListener('wheel', scrollHorizontal)
        carouselRef.current?.addEventListener('wheel', scrollHorizontal)

        return ()=>{
            carouselRef.current?.removeEventListener('wheel', scrollHorizontal)
        }
    },[carouselRef]);

    useEffect(()=>{
        if(!rooms.ready) 
            return;

        (async ()=>{
            const room = rooms.list[roomId];
            //If room does not exist, redirect to home
            if(!room){
                return history.push('/')
            }
            
            //If room is not joined, join it
            if(!room.users.find( v => v.username === auth.user.username)){
                await rooms.joinRoom(roomId)
                .catch( (err, data)=>{ 
                    history.push('/') 
                })
            }
            
            //Now that I am on the room, start it calling the rest of users.
            if(rooms.current){
                wrtc.callAllUsers();
            }
            
        })();

    },[rooms.ready, rooms.current]);

    useEffect(()=>{
        setState(s=>s+1);
    },[wrtc.streams])*/

    return <div id="room" className="overflow-hidden m-auto" style={{zIndex:1000}}>
        <Row id="content-row" className="g-0" style={{ height:"100%" }}>
  
            <Col xs="auto" id="carousel-col" ref={carouselRef}>
                <div id="carousel" className="d-flex flex-column" >
                {  Object.entries({local:media.localStream, ...wrtc.streams}).map(([callId, stream], k)=>{

                    let id = wrtc.getUserId(callId);
                    let imMaster = auth.user.username === rooms.current?.master && id !== rooms.current?.master && id !== auth.user.username;
                    let [mediaHubCallId, forwardedCallId] = wrtc.getLiveCall(callId);
                    let isForwardCall = !!forwardedCallId;
                    let isSelected = selected === callId || (!selected && k === 0);

                    return <div>
                        <div className="stream-forward">
                            <BadgeForwardCall callId={callId} isForwardCall={isForwardCall}/>
                            { isSelected && <Badge pill bg="primary"><i className="bi bi-eye active"/></Badge> }
                        </div>
                        <Video isLocal={id === auth.user.username} key={callId} id={id} stream={stream} className={!isSelected?"cursor-pointer":""} onClick={()=>{setSelected(callId)}}/>
                    </div>
                })}
                </div>
            </Col>
            <Col id="main-col">
                <Video isLocal={wrtc.getUserId(selected) === auth.user.username} className="main-video" id={wrtc.getUserId(selected)} stream={wrtc.streams[selected]??media.localStream} />
            </Col>
        </Row>

        <style global jsx>{`
            @import "src/variables.scss";

            #room{
                height:calc(100vh - 3rem - 4.5rem);
                
                #main-col {
                    height: 100%;
                    overflow: hidden;

                    .Video
                    {
                        width:100%;
                        height:100%;
                        object-fit: cover;
                    }
                }

                #carousel-col {
                    height: 100%;
                    width:166px;
                    overflow-x: hidden;
                    overflow-y: scroll;

                    #carousel{
                        height:100%;
                        .Video{
                            padding-right: 1px;
                            padding-bottom: 2px;
                        }
                    }
                }

                .stream-forward{
                    height:1.9rem;
                    position:relative;
                    margin-bottom:-1.9rem;
                    text-align:left;
                    padding:3px 6px;
                    z-index:1000;
                }

                .stream-controls{
                    margin-bottom: 5.5rem;
                }
            }

            @media only screen and (orientation: landscape) and (max-height: 671px) {           
                #room{
                    height:calc(100vh - 2rem);
                }
                
                .stream-controls{
                    margin-bottom: .5rem !important;
                }
        
            }

            @media only screen and (orientation: portrait){
                .stream-controls{
                    margin-bottom: 5.5rem !important;
                }

                #content-row{ flex-direction: column; }
                #carousel-col{
                    overflow-x: scroll;
                    overflow-y: hidden;
                    height: 126px !important;
                    width: 100% !important;
                    #carousel{
                        flex-direction: row !important;
                        border:none;
                        .Video, .Video video{ 
                            width: 166px; 
                            height:124px; 
                            object-fit: cover;
                        }
                    }
                }
            }

        `}</style>
    </div>;
}

