import { useEffect, useRef } from 'react'


export default ({stream, className, onClick, isLocal = false, ...props})=>{
    let ref = useRef(null);
    useEffect(()=>{
        if(stream && ref.current){
            ref.current.srcObject = stream;
        }
    },[stream]);

    return <div className={`Video ${className}`} {...props}>
        <video autoPlay playsInline muted={isLocal} ref={ref} {...{onClick}}/>
    </div>;
}