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

    useEffect(() => {
        function unload(){
            rooms.leaveRoom();
            document.body.addEventListener('unload', unload);
        }
        document.body.addEventListener('unload', unload);
        media.init();
    return ()=>{
        media.stop();
        //unload();
    }},[])

    /*const room = rooms.getRoomInfo(roomId);
    useEffect(() => {
        if(room)
        rooms.setCurrent(room);
    },[...Object.values(room??{})])//TODO: ESTO ES MU MU MU FEO
    */
   
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

    useLayoutEffect(()=>{
        if(!rooms.ready) return;

        (async ()=>{
            const room = rooms.getRoomInfo(roomId);
            if(!room){
                return history.push('/')
            }
            
            if(![ room.master, ...room.guests].includes(auth.user)){
                await rooms.joinRoom(roomId)
                .catch( ()=> {
                    history.push('/')
                })
            }

            rooms.setCurrent(room);
        })();

    },[rooms.ready, roomId]);

    useLayoutEffect(()=>{
        if(!(auth.isLogged && auth.isConnected) || !rooms.current) return;

        //By this point i can guarantee im in the room where it happens
        wrtc.callHangupAll();
        wrtc.callAllUsers(rooms.current);
    },[auth.isLogged && auth.isConnected, rooms.current]);

    useEffect(()=>{
        setState(s=>s+1);
    },[wrtc.streams])


    
    
    const dummy = BRA.dummyStream.getStream();

    return <div id="room" className="overflow-hidden m-auto" style={{zIndex:1000}}>
        <Row id="content-row" className="g-0" style={{ height:"100%" }}>
  
            <Col xs="auto" id="carousel-col" ref={carouselRef}>
                <div id="carousel" className="d-flex flex-column" >
                {  Object.entries({local:media.localStream, ...wrtc.streams}).map(([callId, stream], k)=>{

                    let id = wrtc.getUserId(callId);
                    let imMaster = auth.user === rooms.current?.master && id !== rooms.current?.master && id !== auth.user;
                    let [mediaHubCallId, forwardedCallId] = wrtc.getLiveCall(callId);
                    let isForwardCall = !!forwardedCallId;
                    let isSelected = selected === callId || (!selected && k === 0);

                    return <div>
                        <div className="stream-forward">
                            <BadgeForwardCall callId={callId} isForwardCall={isForwardCall}/>
                            { isSelected && <Badge pill bg="primary"><i className="bi bi-eye active"/></Badge> }
                        </div>
                        <Video key={callId} id={id} stream={stream} className={!isSelected?"cursor-pointer":""} onClick={()=>{setSelected(callId)}}/>
                    </div>
                })}
                </div>
            </Col>
            <Col id="main-col">
                <Video className="main-video" id={wrtc.getUserId(selected)} stream={wrtc.streams[selected]??media.localStream} />
            </Col>
        </Row>
        {/*<div className="bg-danger stream-controls position-absolute start-50 translate-middle-x bottom-0 px-2 py-1">
            HOLA
            </div>*/}
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
                    z-index:10000;
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

