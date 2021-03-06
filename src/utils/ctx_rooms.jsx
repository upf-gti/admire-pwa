import * as BRA from 'lib_bra'
import toast from  'react-hot-toast'
import { useHistory, useParams, useRef } from 'react-router-dom'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'utils/ctx_authentication'
import avatar_img from 'assets/img/UilUser.svg'

export const RoomsContext = createContext(); 
let messages = []
let avatars = {}

export default ({children, ...props}) => {
    const auth    = useContext(AuthContext);
    const history = useHistory();
    
    let   [rooms, setRooms]       = useState({});
    const [ready, setReady]       = useState(false);
    let   [current, setCurrent]   = useState(null);
    const [state, setState] = useState(0);

    function setMessages(d){
        messages = d;
        setState(s => s+1);
    }
    
    useEffect( ()=>{ 
        if(!auth.isLogged) return;
        
        BRA.appClient.on(BRA.APPEvent.GuestLeftRoom,     onGuestLeft);
        BRA.appClient.on(BRA.APPEvent.GuestJoinedRoom,   onGuestJoin);
        BRA.appClient.on(BRA.APPEvent.RoomCreated,       onRoomCreated);
        BRA.appClient.on(BRA.APPEvent.RoomDeleted,       onRoomDeleted);
        BRA.appClient.on(BRA.APPEvent.UserRejoined,      onUserRejoined);
        BRA.appClient.on(BRA.APPEvent.UserKicked,        onUserKicked);
        BRA.appClient.on(BRA.APPEvent.ChatText,          onMessage);

        //Initial fetch of rooms
        BRA.appClient.getRooms( { response: (m1) => { onGetRooms(m1)
            BRA.appClient.getRoom( { response:(m2) => { onGetRoom(m2); 
                setReady(true);
            }});
        }});

    return ()=>{
        BRA.appClient.off(BRA.APPEvent.GuestLeftRoom,    onGuestLeft);
        BRA.appClient.off(BRA.APPEvent.GuestJoinedRoom,  onGuestJoin);
        BRA.appClient.off(BRA.APPEvent.RoomCreated,      onRoomCreated);
        BRA.appClient.off(BRA.APPEvent.RoomDeleted,      onRoomDeleted);
        BRA.appClient.off(BRA.APPEvent.UserRejoined,     onUserRejoined);
        BRA.appClient.off(BRA.APPEvent.ChatText,         onMessage);
    }}, [auth.isLogged]);

    useEffect(()=>{
        if(!current) return;
        localStorage.setItem('messages', JSON.stringify(messages));
    },[messages]);

    function onUserKicked(){
        BRA.appClient.getRoom({response:onGetRoom});
        BRA.appClient.getRooms({response:onGetRooms});
    }

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
        BRA.appClient.getRoom({response:onGetRoom});
        BRA.appClient.getRooms({response:onGetRooms});
    }

    function onRoomDeleted({data:{room}}){
        BRA.appClient.getRoom({response:onGetRoom});
        BRA.appClient.getRooms({response:onGetRooms});
    }

    function onGuestLeft({data:{user,room}})
    {
        BRA.appClient.getRoom({response:onGetRoom});
        if(current){
            toast(`User '${user.username}' left`);
            setCurrent( {...current, users: current?.users??[].filter(u=>u.username!==user.username)} );
            messages.push({text:`User '${user.username}' left`, timestamp: new Date().toISOString()});
        }
    }    
    
    function onGuestJoin({data:{user,room}})
    {
        BRA.appClient.getRoom({response:onGetRoom});
        if(current){
            toast(`User '${user.username}' joined`);
            setCurrent( {...current, users: current?.users??[].push(user)} );
            messages.push({text:`User '${user.username}' joined`, timestamp: new Date().toISOString()});
        }
    }

    function kickUser(username){
        if(!current) return;
        BRA.appClient.kickUser(username, {response:({event, data})=>{
            if(event==='error'){
                return toast.error(data.message);
            }
            BRA.appClient.getRoom({response:onGetRoom})
        }});
    }
    
    async function onGetRoom({ data: {room} }){
        setCurrent(room?.name?{...room}:null);

        if(room?.name)
        {
            for(let user of room.users??[]){
                if(user.avatar) continue;
                user.avatar = avatars[user.username] ?? await auth.getUserAvatar(user.username)
                user.avatar = user.avatar.length
                ? user.avatar 
                : avatar_img;
            }
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

    function onUserRejoined({event,data}){
        if(current){
            const user = data.user;
            messages.push({text:`User '${user.username}' rejoined`, timestamp: new Date().toISOString()});
        }
    }

    async function onMessage({ event, data }) {
        if (!data) return;
        //const {text, timestamp, username} = data;
        data.avatar = avatars[data.username] ?? await auth.getUserAvatar(data.username) ?? avatar_img;
        setMessages([...messages,data])
    }

    async function sendMessage(text){
        return new Promise( (resolve, reject) => {
            if(!current) reject();

            function onSendMessage(data){
                resolve();
            }
            BRA.appClient.sendText(text, {response:onSendMessage});
        })
    }

    function createRoom(roomName, {password, hidden, icon, size}){
        return new Promise((resolve, reject)=>{
            BRA.appClient.createRoom(roomName, {
                password: password??"",
                hidden: hidden??false,
                size,
                icon: icon && icon.length? icon : `https://unsplash.it/seed/test-${roomName}/160/100`,
                response:({event, data}) => {
                    if(data.error) reject(data.message);
                    else resolve(data.room);
                }
            });
        })
        .then(  (room)=>{ BRA.appClient.getRoom({response:onGetRoom}); return room; } )
        //.catch( (e) => toast.error(e) );
    }

    function joinRoom(roomName, password){
        return new Promise((resolve, reject) => {
            BRA.appClient.joinRoom(roomName,
            {
                password: password??"",
                response:({event, data}) => {
                    if(data.error) 
                    {
                        toast.error(data.message)
                        reject(data.message);
                    }
                    else resolve(data.room);
                }
            });
        })    
        .then(  (room)=>{ BRA.appClient.getRoom({response:onGetRoom}); return room; } )
        .finally( ()=>{
            let m = localStorage.getItem('messages');
            if(m) m=JSON.parse(m);
            else m=[];
            setMessages([...m]);
        })
    }

    function leaveRoom(){
        return new Promise((resolve, reject)=>{
            BRA.appClient.leaveRoom({response:({event, data}) => {
                if(data.error) reject(data.message);
                else resolve(data.room);
            }});
        })
        .finally(  (room)=>{ 
            setMessages([]);
            BRA.appClient.getRoom({response:onGetRoom});
            BRA.appClient.getRooms({response:onGetRooms}); 
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
        kickUser,
        ready,
        current,
        sendMessage,
        messages,
        list: rooms,
    }

    return <RoomsContext.Provider value={store} children={children}/>
}