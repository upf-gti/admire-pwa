import * as BRA from "lib_bra"
import toast from 'react-hot-toast'
import { useState, useContext, useEffect, createContext } from 'react'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'
import { RoomsContext } from 'utils/ctx_rooms'

let liveCalls = [];

export const StreamContext = createContext(); 
export default ({children, ...props}) => {
    const auth  = useContext(AuthContext);
    const rooms = useContext(RoomsContext);
    const media = useContext(MediaContext);

    const [state, setState]             = useState(0);
    let   [streams, setStreams]         = useState({});
    let   [localStream, setLocalStream] = useState(media.localStream);

    useEffect( ()=>{ 
        BRA.rtcClient.on(BRA.RTCEvent.IncomingCall, onIncomingCall);
        BRA.rtcClient.on(BRA.RTCEvent.CallOpened,   onCallOpened);
        BRA.rtcClient.on(BRA.RTCEvent.CallClosed,   onCallClosed);
        BRA.rtcClient.on(BRA.RTCEvent.CallHangup,   onCallHangup);
    return ()=>{
        BRA.rtcClient.off(BRA.RTCEvent.IncomingCall, onIncomingCall);
        BRA.rtcClient.off(BRA.RTCEvent.CallOpened,   onCallOpened);
        BRA.rtcClient.off(BRA.RTCEvent.CallClosed,   onCallClosed);
        BRA.rtcClient.off(BRA.RTCEvent.CallHangup,   onCallHangup);
    }}, []);

    useEffect( ()=>{
        setState(s => s+1);
        localStream = media.localStream;
        setLocalStream(localStream);
    }, [media.localStream]);

    function callUser(username, callback, fwdCallId){
        const response = callback ?? (({event, data}) => {
            const {callid, error, message} = data;
            if(error){
                toast.error(`Call error: ${message}`,{icon:<i className="bi bi-telephone-x"/>, duration: 5000});
            }
        });

        let callID = auth.user?.username + "_" + username;

        if(fwdCallId) {
            const fwd_call = BRA.rtcClient.getCall(fwdCallId);
            if(fwd_call) {
                callID = fwd_call.caller + "_" + callID;
            }
        }

        return BRA.rtcClient.call(username, {response: response, callid: callID});
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

    function onIncomingCall({event, data}){
        const { callid, caller } = data;
        BRA.rtcClient.acceptCall(callid);
    }

    function onCallOpened( request ) {

        const { call, stream } = request;
        const callid = call.callid;
        
        streams = {...streams, [callid]: stream}
        setStreams(streams);
        const forwardingCallId = liveCalls[callid];   

        // Live call

        if (forwardingCallId) {

            const forwardStream = (forwardingCallId === "local") ? window.localStream : streams[forwardingCallId];
            if (!forwardStream) {
                callHangup(callid);
                return toast.error(`Live Call Error: ${callid}, callerId: ${call.caller}, calleeId: ${call.callee} `);
            }
            toast.success(`Live Call: ${callid}, callerId: ${call.caller}, calleeId: ${call.callee} `);
            const videotrack = forwardStream.getVideoTracks()[0];
            const audiotrack = forwardStream.getAudioTracks()[0];
            call.replaceLocalVideoTrack(videotrack);
            call.replaceLocalAudioTrack(audiotrack);
            toast(`Forwarding stream`, {icon:<i className="bi bi-cast"/>});

            const forwardingCall = BRA.rtcClient.getCall( forwardingCallId );
            forwardingCall?.sendMessage(JSON.stringify( { 'live': true } ));
        }

        // Regular call

        else {

            if(!window.localStream) return;
            const videotrack = window.localStream.getVideoTracks()[0];
            const audiotrack = window.localStream.getAudioTracks()[0];
            call.replaceLocalVideoTrack(videotrack);
            call.replaceLocalAudioTrack(audiotrack);

            toast(`Call from ${call.caller} to ${call.callee}`, {icon:<i className="bi bi-telephone-inbound"/>});

            call?.onMessage(function( event )
            {
                const data = JSON.parse( event );
                
                if( data.live != undefined ) {
                    setLiveStreamBorder( data.live );
                }
            });
        }
    }

    function onCallClosed( request ){
        const { call } = request;
        if (!call)
            return console.error("No call");

        const callid = call.callid;
        manageLiveCallClosed(callid);

        delete streams[callid];
        setStreams({...streams});
        toast(`Call from ${call.caller} to ${call.callee} closed`, {icon:<i className="bi bi-telephone-x"/>});
    }

    function onCallHangup( {event, data} ){
        const { callid } = data;

        if (!callid)
            return console.error("No call");

        manageLiveCallClosed(callid);
        delete streams[callid];
        setStreams({...streams});
    }

    function manageLiveCallClosed(callid) {
        let result = null;
        for (const [mId, fId] of Object.entries(liveCalls)) {
            if (callid !== mId && fId !== callid)
                continue;

            result = [mId, fId];
            break;
        }

        // Live call

        if (result) {
            const [mediaHubCallId, forwardedCallId] = result;
            const forwardingCall = BRA.rtcClient.getCall( forwardedCallId );
            forwardingCall?.sendMessage(JSON.stringify( { 'live': false } ));
            delete liveCalls[mediaHubCallId];
        }
    }

    function setLiveStreamBorder( status ) {

        const operation = status ? 'add' : 'remove';
        document.querySelector(".main-video").classList[ operation ]( "stream" );
    }

    function getUserId(callId){
        let id = auth.user?.username;
        let call = BRA.rtcClient.getCalls()[callId];
        if (callId !== "local" && call) {
            let { callee, caller } = call;
            id = (callee === auth.user?.username) ? caller : callee;
        }
        return id;
    }

    // TODO:check this
    function forwardCall(source, target) {
        if (!target || !source)
            return console.error(`source or target callId's are undefined`);
        liveCalls[target] = source;
    }

    function getLiveCall(callid)
    {
        return Object.entries(liveCalls).find( v => v[1] === callid ) ?? [null,null];
    }

    function isLiveCall(callid)
    {
        return !!liveCalls[ callid ];
    }

    function replaceStream(stream){
        for( const callid in BRA.rtcClient.getCalls() )
        {
            let s = stream;
            const forwardingCallId = liveCalls[callid];   //Live call
            if(forwardingCallId && streams[forwardingCallId])
            {
                s = streams[forwardingCallId];
            }

            let call = BRA.rtcClient.getCall(callid);
            let audiotrack = s.getAudioTracks()[0];
            let videotrack = s.getVideoTracks()[0];
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
        isLiveCall,
        replaceStream,
        streams: {...streams, local:localStream},
    }

    return <StreamContext.Provider value={store} children={children}/>
}