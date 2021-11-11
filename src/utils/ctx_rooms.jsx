import * as BRA from 'lib_bra'
import toast from  'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'utils/ctx_authentication'


export const RoomsContext = createContext(); 

export default ({children, ...props}) => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    let   [rooms, setRooms] = useState({}); 
    const [current, setCurrent] = useState(null);
    
    useEffect( ()=>{ 
        if(!auth.isLogged) return;

        BRA.appClient.getRoom(onGetRoom);
        BRA.appClient.getRooms(onGetRooms);
        /* Currently not binded events
            Error:                 
            UserOnline:            
            UserOffline:           
            UserRejoined:    
        */
        BRA.appClient.on(BRA.APPEvent.GuestLeftRoom,    onGuestLeft);
        BRA.appClient.on(BRA.APPEvent.GuestJoinedRoom,  onGuestJoin);
        BRA.appClient.on(BRA.APPEvent.RoomCreated,      onRoomCreated);
        BRA.appClient.on(BRA.APPEvent.RoomDeleted,      onRoomDeleted);
    return ()=>{
        BRA.appClient.off(BRA.APPEvent.GuestLeftRoom,    onGuestLeft);
        BRA.appClient.off(BRA.APPEvent.GuestJoinedRoom,  onGuestJoin);
        BRA.appClient.off(BRA.APPEvent.RoomCreated,      onRoomCreated);
        BRA.appClient.off(BRA.APPEvent.RoomDeleted,      onRoomDeleted);
    }}, [auth.isLogged]);

    useEffect(()=>{
        if(imInRoom(current))
        {
            history.push(`/room/${current.name}`);
            toast.success(`Joined room`); 
        }
    },[current]);

    function isUserInRoom(username, roomName)
    {
        const r = rooms[roomName];
        if(!r) return false;
        
        for(let u of r.users)
        {
            if(u.username === username) return true;
        }
        return false;
    }

    function imInRoom(roomName)
    {
        return isUserInRoom(auth.user?.username, roomName);
    }

    function onRoomCreated({data:{room}}){
        setRooms({...rooms, [room.name]:room});
    }

    function onRoomDeleted({data:{room}}){
        setRooms({...rooms, [room.name]:undefined});
        if(imInRoom(room.name))
            leaveRoom();
    }

    function onGuestLeft({data:{user,room}})
    {
        BRA.appClient.getRoom(onGetRoom);
        BRA.appClient.getRooms(onGetRooms);

        if(imInRoom(room.name))
            toast(`User '${user.username}' left`);
    }    
    
    function onGuestJoin({data:{user,room}})
    {
        BRA.appClient.getRoom(onGetRoom);
        BRA.appClient.getRooms(onGetRooms);

        if(imInRoom(room.name))
            toast(`User '${user.username}' joined`);
    }
    
    function onGetRoom({ data }){
        setCurrent(Object.keys(data.room??{}).length? {...data.room} : null);
    }

    function onGetRooms({data}){
        if(!data?.rooms) return;
        let r = {};
        for(let room of data.rooms)
        {
            r[room.name] = room;
        }
        setRooms({...r});
    }

    function createRoom(roomName, {password, hidden, icon}){
        return new Promise((resolve, reject)=>{
            function onCreateRoom({event, data}){
                switch(event){
                    case "create_room_response":    
                        toast.success(`Created room ${room.name}`); 
                        const {room} = data;
                        setCurrent(Object.keys(data.room??{}).length? {...data.room} : null);
                        resolve(arguments);
                        break;
                        
                    case "error": 
                        const {error, message} = data;    
                        const msg = `onCreateRoom(e:${error}): ${message}`;
                        toast.error(msg); 
                        reject(msg);
                        break;
        
                    default: break;
                }
            }
            BRA.appClient.createRoom(roomName, password??"", hidden??false, icon??"", onCreateRoom);
        })
    }

    function joinRoom(roomName){
        return new Promise((resolve, reject) => {

            function onJoinRoom({event, data}){
                switch(event){
                    case "join_room_response": 
                        const {room} = data;
                        setCurrent({...room});
                        resolve(arguments);
                        break;
                        
                    case "error": 
                        const {error, message} = data;    
                        const msg = `onJoinRoom(e:${error}): ${message}`;
                        toast.error(msg); 
                        //TODO: puede que cambiar el path aqui, provablemente
                        reject(msg);
                        break;
        
                    default: debugger; break;
                }
            }
            BRA.appClient.joinRoom(roomName, onJoinRoom);
        });
    }

    function leaveRoom(){
        return new Promise((resolve, reject)=>{
            function onLeaveRoom({event, data}){
                switch(event){
                    case "leave_room_response":    
                        //const {room} = data;
                        BRA.appClient.getRoom(onGetRoom);
                        resolve(arguments);
                        break;
                        
                    case "error": 
                        const {error, message} = data;    
                        const msg = `onLeaveRoom(e:${error}): ${message}`;
                        toast.error(msg); 
                        reject(msg);
                        break;
        
                    default: debugger; break;
                }
                history.push(`/`);
                toast.success(`Leaved room`); 
            }
            BRA.appClient.leaveRoom(onLeaveRoom);
        })
    }


    const store = window.rooms = {
        joinRoom,
        leaveRoom,
        createRoom,
        current,
        list: rooms,
    }

    return <RoomsContext.Provider value={store} children={children}/>
}