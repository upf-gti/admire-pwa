import * as BRA from "lib_bra"
import toast from 'react-hot-toast'
import { useState, useContext, useReducer, useEffect, createContext, useRef } from 'react'


export const MediaContext = createContext(); 
export default ({children, ...props}) => {

    let   {current:init_evts}            = useRef(0);
    const videoRef                       = useRef(null);
    const [ready, setReady ]             = useState(false);
    const [devices , setDevices]         = useState(null);
    const [settings, setSettings ]       = useState(null);
    const [resolutions, setResolutions ] = useState(null);
    let [localStream, setLocalStream ] = useReducer( (value, newvalue)=>{
        if( videoRef && videoRef.current )
            videoRef.current.srcObject = newvalue;
        return newvalue;
    }, BRA.dummyStream.getStream() );
    
    useEffect( ()=>{ 
      
     
        (async ()=>{
            BRA.mediaAdapter.on(BRA.MediaEvent.GotDevices,          onGotDevices );
            BRA.mediaAdapter.on(BRA.MediaEvent.ErrorStream,         onError);
            BRA.mediaAdapter.on(BRA.MediaEvent.ErrorDevices,        onError);
            BRA.mediaAdapter.on(BRA.MediaEvent.GotResolutions,      onGotResolutions );
  
            let supported = await BRA.mediaAdapter.start();
            if( !supported )
                return toast.error("Media devices are not available");
            

            let audio = window.localStorage.getItem("audio");
            let video = window.localStorage.getItem("video");               
            
            await new Promise((resolve, reject)=>{
                function onStream(d){
                    BRA.mediaAdapter.off(BRA.MediaEvent.GotStream, onStream );
                    resolve(d);
                }
                BRA.mediaAdapter.on(BRA.MediaEvent.GotStream, onStream );
                BRA.mediaAdapter.setVideo(video);
            })
            .then(onGotStream);

            await new Promise((resolve, reject)=>{
                function onStream(d){
                    BRA.mediaAdapter.off(BRA.MediaEvent.GotStream, onStream );
                    BRA.mediaAdapter.on(BRA.MediaEvent.GotStream, onGotStream );
                    resolve(d);
                }
                BRA.mediaAdapter.on(BRA.MediaEvent.GotStream, onStream );
                BRA.mediaAdapter.setAudio(audio);
            })
            .then(onGotStream)        
           
            setReady(true);
        })();
            
        function onUnload(){
            BRA.mediaAdapter.off(BRA.MediaEvent.GotStream,      onGotStream );
            BRA.mediaAdapter.off(BRA.MediaEvent.GotDevices,     onGotDevices );
            BRA.mediaAdapter.off(BRA.MediaEvent.ErrorStream,    onError);
            BRA.mediaAdapter.off(BRA.MediaEvent.ErrorDevices,   onError);
            BRA.mediaAdapter.off(BRA.MediaEvent.GotResolutions, onGotResolutions );
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

    function onGotStream({stream, settings})
    { 
        window.localStorage.setItem("audio", settings?.audio);
        window.localStorage.setItem("video", settings?.video);
        window.localStream = localStream = stream;
        setSettings({...settings});
        setLocalStream(localStream);
    }

    function onError({error, message}){
        toast.error(`${error}: ${message}`);
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
        ready,
    }

    return <MediaContext.Provider value={store} children={children}/>
}