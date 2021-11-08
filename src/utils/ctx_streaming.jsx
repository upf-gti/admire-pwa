import * as BRA from "lib_bra"
import toast from 'react-hot-toast'
import { useState, useContext, useEffect, createContext } from 'react'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'


export const StreamContext = createContext(); 
export default ({children, ...props}) => {
    const auth                          = useContext(AuthContext);
    const media                         = useContext(MediaContext);
    const [streams, setStreams]         = useState({});
    const [liveCalls, setLiveCalls]     = useState({});
    const [localStream, setLocalStream] = useState(media.localStream);

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
        for( const callId in BRA.rtcClient.getCalls() )
        {
            let call = BRA.rtcClient.getCall(callId);
            let stream = media.localStream;
            {
                let track = stream.getVideoTracks()[0];
                call.replaceLocalVideoTrack(track);
            }
            {
                let track = stream.getAudioTracks()[0];
                call.replaceLocalAudioTrack(track);
            }
        }
        setLocalStream(media.localStream);
    }, [media.localStream]);

    function callUser(user){
        return BRA.rtcClient.call(user, ({callId, status, description}) => {
            if(status === 'error')
                toast.error(`Call error: ${description}`);
        });
    }

    function callAllUsers(roomInfo){
        const users = [...roomInfo?.guests??[], roomInfo?.master].filter((v, k, a) => { return v && v !== auth.user });
        for (let user of users){
            if(!callUser(user))
                toast.error(`call missed to ${user}`);
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
        setStreams({...streams, [callId]: stream});
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
        }

        //Regular call
        else {
            toast.success(`Incoming Call: ${callId}, callerId: ${call.callerId}, calleeId: ${call.calleeId} `);
            const videotrack = media.localStream.getVideoTracks()[0];
            const audiotrack = media.localStream.getAudioTracks()[0];
            call.replaceLocalVideoTrack(videotrack);
            call.replaceLocalAudioTrack(audiotrack);
            //if(!selected)setSelected(callId);
        }
    }

    function onCallClosed({ call }){
        if (!call)
            return console.error("No call");

        const callId = call.callId;
        manageLiveCallClosed(callId);

        delete streams[callId];
        setStreams({...streams});
        toast(`Call ${callId} closed`,{icon:"⚠️"});
    }

    function onUserHangup({ callId }){
        if (!callId)
            return console.error("No call");

        manageLiveCallClosed(callId);
        delete streams[callId];
        setStreams({...streams});

        toast(`Call ${callId} hangup`,{icon:"⚠️"});
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
        let id = auth.user;
        let call = BRA.rtcClient.getCalls()[callId];
        if (callId !== "local" && call) {
            let { calleeId, callerId } = call;
            id = (calleeId === auth.user) ? callerId : calleeId;
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

    const store = window.wrtc = {
        callUser,
        callAllUsers,
        callHangup,
        callHangupAll,
        forwardCall,
        getUserId,
        getLiveCall,
        streams: {...streams, local:localStream},
    }

    return <StreamContext.Provider value={store} children={children}/>
}