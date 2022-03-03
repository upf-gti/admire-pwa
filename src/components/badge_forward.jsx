import toast from 'react-hot-toast';
import {useState, useContext, useRef} from 'react'
import {Badge, Button, Form, FloatingLabel, Spinner} from 'react-bootstrap'

import Modal from 'partials/modal'
import { StreamContext } from 'utils/ctx_streaming'


export default ({callId, isForwardCall})=>{
    const wrtc     = useContext(StreamContext);
    const ref = useRef(null);
    const [show, setShow] = useState(null);
    const [fetching, setFetching] = useState(0);//0: not fetching, 1: fetching, 2: sucess, 3: failed


    let [mediaHubCallId, forwardedCallId] = wrtc.getLiveCall(callId); //eslint-disable-line
    
function submit() {

        if ( !ref?.current || !show )
            return setShow(false);

        setFetching(true);            

        const [forwardingCallId, mediaHubtarget] = [callId, ref.current.value];

        function callback({event, data}) {
            const {callid, callee, caller, error, message}=data;
            if(error)
            {                
                setFetching(3);           
                setTimeout( () => { setFetching(0); } , 2000);
                toast.error(`Mediahub Call response error: ${message}`, {duration: 5000});
            }
            else {
                setFetching(2);   
                setTimeout( () => { setFetching(0); setShow(false); } , 1000);
                //callback(callid, forwardingCallId);
                wrtc.forwardCall(forwardingCallId, callid);
            }
        }

        if(!wrtc.callUser(mediaHubtarget, callback, forwardingCallId))
        {
            setFetching(3);   
            toast.error(`call missed to backend`);
            setTimeout( () => { setFetching(0); } , 2000);
        }
    }

    function onKeyDown(e){
        if(e.keyCode === 13)
        submit()
    }

    let button;
    switch(fetching){
        case 1:  button = <Button variant="outline-primary"> <Spinner as="span"      animation="border"      size="sm"      role="status"      aria-hidden="true"/></Button>; break;
        case 2:  button = <Button variant="outline-success" > ✔️ Succeed! </Button>; break;
        case 3:  button = <Button variant="outline-danger"  > ❌ Error </Button>; break;
        default: button = <Button variant="outline-primary" onClick={submit} >Proceed!</Button>;
    }

    return <>
        {isForwardCall ? <Badge style={{padding:".44em .45em"}} pill bg="danger" onClick={() => wrtc.callHangup( mediaHubCallId )}><i className="bi bi-x"></i></Badge>
        :                <Badge style={{padding:".44em .45em"}} pill bg="danger" onClick={() => setShow( callId )} className="cursor-pointer"><i className="bi bi-cast"></i></Badge>}
        <Modal {...{show,setShow}}  buttons={[button]}  closeButton title="Ready to forward?" onKeyDown={onKeyDown}>
            Enter the destination ID you want to forward to
            <FloatingLabel controlId="floatingInput" label="targetId" className="mb-3">
                <Form.Control ref={ref} name="targetId" type="text" placeholder="mediahub target id"/>
            </FloatingLabel>
        </Modal>
    </>;
}

//{ imMaster && (!isForwardCall && id !== roomInfo?.master && id !== user.id) && <Badge pill bg="danger" onClick={() => setShowModal( callId )}><i class="bi bi-cast"></i></Badge> }