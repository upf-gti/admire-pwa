import * as BRA from 'lib_bra'
import toast from  'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'utils/ctx_authentication'


export const RoomsContext = createContext(); 

export default ({children, ...props}) => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [ready, setReady] = useState(false); 
    let   [rooms, setRooms] = useState({}); 
    const [current, setCurrent] = useState(null);
    
    useEffect( ()=>{ 
        if(!auth.isLogged) return;

        let onGuestJoin, onGuestLeft, onMasterLeft, onUnload, onGetRoom;
        BRA.appClient.on('get_room_response',       onGetRoom);
        BRA.appClient.on('get_rooms_response',      onGetRooms);
        BRA.appClient.on('guest_joined_room',       onGuestJoin  = () => { toast('Guest joined');   BRA.appClient.getRoom(); });  //asi no lo he de pedir cada vez.
        BRA.appClient.on('guest_left_room',         onGuestLeft  = () => { toast('Guest left');     BRA.appClient.getRoom(); });  //
        BRA.appClient.on('master_left_room',        onMasterLeft = () => { toast('Master left');    history.push('/') });  //Tal vez estos tres podrian devolver la info de la room 
        
        BRA.appClient.getRooms();
        const interval = setInterval(() => {BRA.appClient.getRooms();} , 2000);
    return ()=>{
        BRA.appClient.off('get_room_response',      onGetRoom);
        BRA.appClient.off('get_rooms_response',     onGetRooms);
        BRA.appClient.off('guest_joined_room',      onGuestJoin);
        BRA.appClient.off('guest_left_room',        onGuestLeft);
        BRA.appClient.off('master_left_room',       onMasterLeft);

        clearInterval(interval);
    }}, [auth.isLogged]);

    function createRoom(roomId){
        return new Promise((resolve, reject)=>{
            function onCreateRoom({status, description}){
                BRA.appClient.off('create_room_response', onCreateRoom); 
                switch(status){
                    case "ok":    
                        toast.success(`Created room ${roomId}`); 
                        history.push(`/rooms/${roomId}`);
                        resolve(arguments);
                        break;
                        
                    case "error": 
                        const msg = `onCreateRoom: ${description}`
                        toast.error(msg); 
                        reject(msg);
                        break;
        
                    default: break;
                }
            }
            BRA.appClient.on('create_room_response', onCreateRoom);
            BRA.appClient.createRoom(roomId);
        })
    }

    function joinRoom(roomId){
        return new Promise((resolve, reject) => {

            function onJoinRoom({status, description}){
                BRA.appClient.off('join_room_response', onJoinRoom);
                switch(status){
                    case "ok":    
                        setCurrent(rooms[roomId]);
                        toast.success(`Joined room`); 
                        resolve(arguments);
                        break;
                        
                    case "error": 
                        const msg = `onJoinRoom: ${description}`
                        toast.error(msg); 
                        reject(msg);
                        break;
        
                    default: break;
                }
            }
            BRA.appClient.on('join_room_response', onJoinRoom);
            BRA.appClient.joinRoom(roomId);
        });
    }

    function leaveRoom(){
        return new Promise((resolve, reject)=>{
            function onLeaveRoom({status, description}){
                BRA.appClient.off('leave_room_response', onLeaveRoom); 
                switch(status){
                    case "ok":    
                        setCurrent(null);
                        history.push(`/`);
                        toast.success(`Leaved room`); 
                        resolve(arguments);
                        break;
                        
                    case "error": 
                        const msg = `onLeaveRoom: ${description}`;
                        setCurrent(null);
                        history.push(`/`);
                        toast.error(msg); 
                        reject(msg);
                        break;
        
                    default: break;
                }
            }
            BRA.appClient.on('leave_room_response', onLeaveRoom);
            BRA.appClient.leaveRoom();
        })
    }

    function onGetRoom({ status, description, roomInfo }){
        if(status === 'error')
            return toast.error(`onGetRoom: ${description}`);
        setCurrent({...roomInfo});
    }

    function onGetRooms({status, description, roomInfos}){
        if(status === 'error')
            return toast.error(`onGetRooms: ${description}`);
        rooms = {...roomInfos}
        setRooms(rooms);
        setReady(true);        
    }

    const store = window.rooms = {
        joinRoom,
        leaveRoom,
        createRoom,
        getRoomInfo: (roomId) => rooms[roomId],
        setCurrent,
        ready,
        current,
        list: rooms,
    }

    return <RoomsContext.Provider value={store} children={children}/>
}