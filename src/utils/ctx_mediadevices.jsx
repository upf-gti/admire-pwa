import * as BRA from "lib_bra"
import toast from 'react-hot-toast'
import { useState, useContext, useReducer, useEffect, createContext, useRef } from 'react'


export const MediaContext = createContext(); 
export default ({children, ...props}) => {

    let {current:init_evts}               = useRef(0);
    const videoRef                        = useRef(null);
    const [devices , setDevices]          = useState(null);
    const [settings, setSettings ]        = useState(null);
    const [resolutions, setResolutions ]  = useState(null);
    const [localStream, setLocalStream ] = useReducer( (value, newvalue)=>{
        if( videoRef && videoRef.current )
            videoRef.current.srcObject = newvalue;
        return newvalue;
    }, BRA.dummyStream.getStream() );
    
    useEffect( ()=>{ 
        BRA.mediaAdapter.on("got_stream",         onGotStream );
        BRA.mediaAdapter.on('got_devices',        onGotDevices );
        BRA.mediaAdapter.on("error_stream",       onError);
        BRA.mediaAdapter.on("error_devices",      onError);
        BRA.mediaAdapter.on("got_resolutions",    onGotResolutions );
        BRA.mediaAdapter.start();
        getDevices();

        function onUnload(){
            BRA.mediaAdapter.off("got_stream",        onGotStream );
            BRA.mediaAdapter.off('got_devices',       onGotDevices );
            BRA.mediaAdapter.off("error_stream",      onError);
            BRA.mediaAdapter.off("error_devices",     onError);
            BRA.mediaAdapter.off("got_resolutions",   onGotResolutions );
            window.removeEventListener('unload ', onUnload);
        }
        window.addEventListener('unload ',    onUnload);
    return ()=>{
        onUnload();
    }}, []);

    function getDevices(){
        BRA.mediaAdapter.getDevices();
    }

    function onGotResolutions({resolutions, settings})
    { 
        setSettings({...settings});
        setResolutions(resolutions); 
    }
    
    function onGotDevices ({ audioDevices: audio, videoDevices: video, settings }) 
    { 
        setSettings({...settings});
        setDevices({...devices, audio, video});
    }

    function onGotStream( {stream, settings})
    { 
        setSettings({...settings});
        setLocalStream(stream);
    }

    function onError({description}){
        toast.error("Error:", description);
    }

    function init(){
        if( init_evts <= 0 ){
            //start the thing
            //BRA.mediaAdapter.start();
            getDevices();
        }
        ++init_evts;
    }

    function stop(){
        --init_evts;
        if( init_evts <= 0 ){
            //BRA.mediaAdapter.stop();
            //stop the thing
        }
    }

    function setVideo(device, resolution){
        BRA.mediaAdapter.setVideo(device, resolution);
    }
    function setAudio(device){
        BRA.mediaAdapter.setAudio(device);
    }

    const store = window.media = {
        devices,
        settings, 
        resolutions,
        localStream,
        init,
        stop,
        getDevices,
        setVideo,
        setAudio,
    }

    return <MediaContext.Provider value={store} children={children}/>
}