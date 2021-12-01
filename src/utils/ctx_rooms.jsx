import * as BRA from 'lib_bra'
import toast from  'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'utils/ctx_authentication'


export const RoomsContext = createContext(); 

export default ({children, ...props}) => {
    const auth    = useContext(AuthContext);
    const history = useHistory();
    
    let   [rooms, setRooms]     = useState({});
    const [ready, setReady]     = useState(false);
    let   [current, setCurrent] = useState(null);
    
    useEffect( ()=>{ 
        if(!auth.isLogged) return;
        
        BRA.appClient.on(BRA.APPEvent.GuestLeftRoom,     onGuestLeft);
        BRA.appClient.on(BRA.APPEvent.GuestJoinedRoom,   onGuestJoin);
        BRA.appClient.on(BRA.APPEvent.RoomCreated,       onRoomCreated);
        BRA.appClient.on(BRA.APPEvent.RoomDeleted,       onRoomDeleted);
        BRA.appClient.on(BRA.APPEvent.UserRejoined,      onUserRejoined);

        //Initial fetch of rooms
        BRA.appClient.getRooms( (m1) => { onGetRooms(m1)
            BRA.appClient.getRoom(  (m2) => { onGetRoom(m2); 
            setReady(true);
        });});

    return ()=>{
        BRA.appClient.off(BRA.APPEvent.GuestLeftRoom,    onGuestLeft);
        BRA.appClient.off(BRA.APPEvent.GuestJoinedRoom,  onGuestJoin);
        BRA.appClient.off(BRA.APPEvent.RoomCreated,      onRoomCreated);
        BRA.appClient.off(BRA.APPEvent.RoomDeleted,      onRoomDeleted);
        BRA.appClient.off(BRA.APPEvent.UserRejoined,     onUserRejoined);

    }}, [auth.isLogged]);

    function isUserInRoom(username, roomName)
    {
        const room = {...rooms,[current?.name]:current}[roomName];
        for(let user of room?.users??[]){
            if(user?.username === username) 
                return true;
        }
        return false;
    }

    function imInRoom(roomName)
    {
        return isUserInRoom(auth.user?.username, roomName);
    }

    function onRoomCreated({data:{room}}){
        BRA.appClient.getRoom(onGetRoom);
        BRA.appClient.getRooms(onGetRooms);
    }

    function onRoomDeleted({data:{room}}){
        BRA.appClient.getRoom(onGetRoom);
        BRA.appClient.getRooms(onGetRooms);
    }

    function onGuestLeft({data:{user,room}})
    {
        if(current){
            BRA.appClient.getRoom(onGetRoom);
            toast(`User '${user.username}' left`);
            setCurrent( {...current, users: current?.users??[].filter(u=>u.username!==user.username)} );
        }
    }    
    
    function onGuestJoin({data:{user,room}})
    {
        if(current){
            BRA.appClient.getRoom(onGetRoom);
            toast(`User '${user.username}' joined`);
            setCurrent( {...current, users: current?.users??[].push(user)} );
        }
    }
    
    function onGetRoom({ data: {room} }){
        setCurrent(room?.name?{...room}:null);

        if(room?.name)
        {
            if(history.location.pathname !== `/room/${room?.name}`){
                history.push(`/room/${room?.name}`);
            }
        }
        else{
            history.push(`/`);
        }
    }

    function onGetRooms({data:{rooms}}){
        let rs = {};
        for(let room of rooms??[])
            rs[room.name] = room;
        setRooms(rs);
    }

    function onUserRejoined(){
    }

    function createRoom(roomName, {password, hidden, icon}){
        return new Promise((resolve, reject)=>{
            BRA.appClient.createRoom(roomName, password??"", hidden??false, icon && icon.length? icon : `https://unsplash.it/seed/test-${roomName}/160/100`, ({event, data}) => {
                if(data.error) reject(data.message);
                else resolve(data.room);
            });
        })
        .then(  (room)=>{ BRA.appClient.getRoom(onGetRoom); return room; } )
        //.catch( (e) => toast.error(e) );
    }

    function joinRoom(roomName, password){
        return new Promise((resolve, reject) => {
            BRA.appClient.joinRoom(roomName,password??"",({event, data}) => {
                if(data.error) 
                {
                    toast.error(data.message)
                    reject(data.message);
                }
                else resolve(data.room);
            });
        })    
        .then(  (room)=>{ BRA.appClient.getRoom(onGetRoom); return room; } )
    }

    function leaveRoom(){
        return new Promise((resolve, reject)=>{
            BRA.appClient.leaveRoom(({event, data}) => {
                if(data.error) reject(data.message);
                else resolve(data.room);
            });
        })
        .finally(  (room)=>{ 
            BRA.appClient.getRoom(onGetRoom);
            BRA.appClient.getRooms(onGetRooms); 
        return room; } )
        //.catch( (e)=> toast.error(e) );
    }


    const store = window.rooms = {
        joinRoom,
        leaveRoom,
        createRoom,
        setCurrent,
        imInRoom,
        isUserInRoom,
        ready,
        current,
        list: rooms,
    }

    return <RoomsContext.Provider value={store} children={children}/>
}