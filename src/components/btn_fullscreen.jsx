import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default () => {  
    let [state, setState] = useState(0);

    function handleClick(){
        let promise
        if (document.fullscreenElement) {
            promise = document.exitFullscreen();
        } else {
            promise = document.documentElement.requestFullscreen();
        }
        promise.then( ()=>setState(++state) );
    }
    
    return <div id="btn_fullscreen">
        { document.fullscreenEnabled && 
            <Button 
            onClick={handleClick} variant="link"> 
                {  document.fullscreen && <i className="bi bi-fullscreen-exit"/> }
                { !document.fullscreen && <i className="bi bi-fullscreen"/> }
            </Button>    
        }
    </div>;
}