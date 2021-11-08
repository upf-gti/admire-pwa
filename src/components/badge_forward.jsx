import {useState, useContext} from 'react'
import Modal from 'partials/modal'
import {Badge} from 'react-bootstrap'

import { RoomsContext } from 'utils/ctx_rooms'
import { StreamContext } from 'utils/ctx_streaming'
import { MediaContext } from 'utils/ctx_mediadevices'
import { AuthContext } from 'utils/ctx_authentication'


export default ({callId, isForwardCall})=>{
    const [show, setShow] = useState(null);
    const wrtc     = useContext(StreamContext);

    let [mediaHubCallId, forwardedCallId] = wrtc.getLiveCall(callId);

    return <>
        {isForwardCall ? <Badge style={{padding:".44em .45em"}} pill bg="danger" onClick={() => wrtc.callHangup( mediaHubCallId )}><i className="bi bi-x"></i></Badge>
        :                <Badge style={{padding:".44em .45em"}} pill bg="danger" onClick={() => setShow( callId )} className="cursor-pointer"><i className="bi bi-cast"></i></Badge>}
        <Modal {...{show,setShow}} closeButton title="Ready to forward?">
            Enter the destination ID you want to forward to
        </Modal>
    </>;
}

//{ imMaster && (!isForwardCall && id !== roomInfo?.master && id !== user.id) && <Badge pill bg="danger" onClick={() => setShowModal( callId )}><i class="bi bi-cast"></i></Badge> }