import screenfull from 'screenfull'
import { Button } from 'react-bootstrap'

export default () => {  

    function handleClick(){
        screenfull.toggle();
        document.inFullscreen = !document.inFullscreen;

        const fsButton = document.getElementById('FS-Button');
        if(fsButton) {
            const icon = fsButton.children[0];
            icon.className = document.inFullscreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen";
        }
    }

    return <div id="btn_fullscreen">
        { screenfull.isEnabled && 
            <Button id="FS-Button"
            onClick={handleClick} variant="link"> 
            {  <i className="bi bi-fullscreen"/> }
            </Button>    
        }
    </div>;
}