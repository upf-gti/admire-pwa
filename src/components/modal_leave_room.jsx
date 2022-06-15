import React, {useContext, useState} from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'partials/modal'
import Nav from 'partials/nav'
import MD from 'utils/md';
import { RoomsContext } from 'utils/ctx_rooms'


export default () => {
    const rooms = useContext(RoomsContext);
    const [show, setShow] = useState(false);

    return <>
        <Nav.Item onClick={()=>setShow(1)} label="Leave room" >
            <i className="bi bi-door-open-fill"></i>Leave
        </Nav.Item>
        <Modal buttons={[<Button size="lg" onClick={()=>rooms.leaveRoom()}>Confirm</Button>]} closeButton size="md" {...{show, setShow}} title={<span>Leaving {rooms.current.name}</span>}>
            
            <MD>{`
            Are you sure you want to leave this room? Any call in progress will be lost and any active stream will be stopped.
            `}</MD>
            
        </Modal>
    </>;
}