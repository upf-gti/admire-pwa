import screenfull from 'screenfull'
import { Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'


export default () => {  
    let [state, setState] = useState(0);//eslint-disable-line

    useEffect(()=>{
        const f = () => setState(s => ++s);
        screenfull.on('change', f);
    return ()=>{
        screenfull.off('change', f);
    }},[])
    
    return <div id="btn_fullscreen">
        { screenfull.isEnabled && 
            <Button 
            onClick={screenfull.toggle} variant="link"> 
                {  document.fullscreen && <i className="bi bi-fullscreen-exit"/> }
                { !document.fullscreen && <i className="bi bi-fullscreen"/> }
            </Button>    
        }
    </div>;
}