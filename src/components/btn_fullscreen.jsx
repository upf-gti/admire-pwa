import screenfull from 'screenfull'
import { Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'


export default () => {  
    let [state, setState] = useState(0);

    function handleClick(){
        /*let promise
        if (document.fullscreenElement) {
            promise = document.exitFullscreen();
        } else {
            promise = document.documentElement.requestFullscreen();
        }
        promise.then( ()=>setState(++state) );*/
        screenfull.toggle();
    }

    useEffect(()=>{
        const f = () => setState(++state);
        screenfull.on('change', f);
    return ()=>{
        screenfull.off('change', f);
    }
    },[])
    
    return <div id="btn_fullscreen">
        { screenfull.isEnabled && 
            <Button 
            onClick={handleClick} variant="link"> 
                {  document.fullscreen && <i className="bi bi-fullscreen-exit"/> }
                { !document.fullscreen && <i className="bi bi-fullscreen"/> }
            </Button>    
        }
    </div>;
}