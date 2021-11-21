import * as BRA from "lib_bra"
import toast from 'react-hot-toast'
import { useState, useContext, useEffect, createContext } from 'react'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'
import { RoomsContext } from 'utils/ctx_rooms'


export const StreamContext = createContext(); 
export default ({children, ...props}) => {
    const auth  = useContext(AuthContext);
    const rooms = useContext(RoomsContext);
    const media = useContext(MediaContext);

    const [state, setState]             = useState(0);
    let   [streams, setStreams]         = useState({});
    let   [liveCalls, setLiveCalls]     = useState({});
    let   [localStream, setLocalStream] = useState(media.localStream);

    useEffect( ()=>{ 
        BRA.rtcClient.on(BRA.RTCEvent.IncomingCall, onIncomingCall);
        BRA.rtcClient.on(BRA.RTCEvent.CallOpened,   onCallOpened);
        BRA.rtcClient.on(BRA.RTCEvent.CallClosed,   onCallClosed);
        BRA.rtcClient.on(BRA.RTCEvent.UserHangup,   onUserHangup);
    return ()=>{
        BRA.rtcClient.off(BRA.RTCEvent.IncomingCall, onIncomingCall);
        BRA.rtcClient.off(BRA.RTCEvent.CallOpened,   onCallOpened);
        BRA.rtcClient.off(BRA.RTCEvent.CallClosed,   onCallClosed);
        BRA.rtcClient.off(BRA.RTCEvent.UserHangup,   onUserHangup);
    }}, []);

    useEffect( ()=>{
        setState(s => s+1);
        localStream = media.localStream;
        setLocalStream(localStream);
    }, [media.localStream]);

    function callUser(username, callback){
        return BRA.rtcClient.call(username, callback ?? (({callId, status, description}) => {
            if(status === 'error'){
                toast.error(`Call error: ${description}`,{icon:<i className="bi bi-telephone-x"/>, duration: 5000});
            }
        }));
    }

    function callAllUsers(){
        const users = rooms.current?.users?.filter((v, k, a) => { return v && v?.username !== auth.user?.username });
        for (let user of users ?? []){
            
            if(!callUser(user?.username)){
                toast.error(`Call missed to ${user?.username}`);
            }
        }
    }

    function callHangup(callId){
        BRA.rtcClient.hangup(callId);
    }

    function callHangupAll(){
        const calls = Object.keys(BRA.rtcClient.getCalls())
        for (let callId of calls){
            callHangup(callId);
        }
    }

    function onIncomingCall({ callId, callerId }){
        BRA.rtcClient.acceptCall(callId);
    }

    function onCallOpened({ call, stream }) {
        const callId = call.callId;
        
        streams = {...streams, [callId]: stream}
        setStreams(streams);
        const forwardingCallId = liveCalls[callId];   //Live call

        if (forwardingCallId) {
            const forward_stream = streams[forwardingCallId];
            if (!forward_stream) {
                callHangup(callId);
                return toast.error(`Live Call Error: ${callId}, callerId: ${call.callerId}, calleeId: ${call.calleeId} `);;
            }
            toast.success(`Live Call: ${callId}, callerId: ${call.callerId}, calleeId: ${call.calleeId} `);
            const videotrack = forward_stream.getVideoTracks()[0];
            const audiotrack = forward_stream.getAudioTracks()[0];
            call.replaceLocalVideoTrack(videotrack);
            call.replaceLocalAudioTrack(audiotrack);
            toast(`Forwarding stream`, {icon:<i className="bi bi-cast"/>});
        }

        //Regular call
        else {
            toast.success(`Incoming Call: ${callId}, callerId: ${call.callerId}, calleeId: ${call.calleeId} `);
            //TODO:esto no deberia estar en window!!!!
            if(!window.localStream) return;
            const videotrack = window.localStream.getVideoTracks()[0];
            const audiotrack = window.localStream.getAudioTracks()[0];
            call.replaceLocalVideoTrack(videotrack);
            call.replaceLocalAudioTrack(audiotrack);
            toast(`Call from ${getUserId(callId)}`, {icon:<i className="bi bi-telephone-inbound"/>});
        }
    }

    function onCallClosed({ call }){
        if (!call)
            return console.error("No call");

        const callId = call.callId;
        manageLiveCallClosed(callId);

        delete streams[callId];
        setStreams({...streams});
        toast(`Call from ${getUserId(callId)} closed`, {icon:<i className="bi bi-telephone-x"/>});
    }

    function onUserHangup({ callId }){
        if (!callId)
            return console.error("No call");

        manageLiveCallClosed(callId);
        delete streams[callId];
        setStreams({...streams});

        toast(`User ${getUserId(callId)} hangup`, {icon:<i className="bi bi-telephone-x"/>});
    }

    function manageLiveCallClosed(callId) {
        let result = null;
        for (const [mId, fId] of Object.entries(liveCalls)) {
            if (callId !== mId && fId !== callId)
                continue;

            result = [mId, fId];
            break;
        }

        if (result) {
            const [mediaHubCallId, forwardedCallId] = result;
            delete liveCalls[mediaHubCallId];
            setLiveCalls(liveCalls);
        }
    }

    function getUserId(callId){
        let id = auth.user?.username;
        let call = BRA.rtcClient.getCalls()[callId];
        if (callId !== "local" && call) {
            let { calleeId, callerId } = call;
            id = (calleeId === auth.user?.username) ? callerId : calleeId;
        }
        return id;
    }

    //TODO:check this
    function forwardCall(source, target) {
        if (!target || !source)
            return console.error(`source or target callId's are undefined`);
        liveCalls[target] = source;
        setLiveCalls({...liveCalls});
    }

    function getLiveCall(callId)
    {
        return Object.entries(liveCalls).find( v => v[1] === callId ) ?? [null,null];
    }

    function replaceStream(stream){
        for( const callId in BRA.rtcClient.getCalls() )
        {
            let call = BRA.rtcClient.getCall(callId);
            let audiotrack = stream.getAudioTracks()[0];
            let videotrack = stream.getVideoTracks()[0];
            call.replaceLocalVideoTrack(videotrack);
            call.replaceLocalAudioTrack(audiotrack);
        }
    }

    const store = window.wrtc = {
        callUser,
        callAllUsers,
        callHangup,
        callHangupAll,
        forwardCall,
        getUserId,
        getLiveCall,
        replaceStream,
        streams: {...streams, local:localStream},
    }

    return <StreamContext.Provider value={store} children={children}/>
}