import { Button, Form, FloatingLabel, Spinner } from 'react-bootstrap'
import React, {useContext, useRef, useEffect, useState, useReducer} from 'react'

import MD from 'utils/md';
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'


export default () => {
    const rooms                   = useContext(RoomsContext);
    const [show, setShow]         = useState(false);

    useEffect(() => {},[rooms.current?.guests]);

    return <>
        <Nav.Item onClick={()=>setShow(s => !s)} disabled={!rooms.current}><i className="bi bi-chat-dots"/>Chat</Nav.Item>
        <Modal tabIndex="0" closeButton size="md" {...{show, setShow}} title={<span>Chat</span>}>
            <ul>
                {<li key={-1}>{rooms.current?.master}</li>}
                {rooms.current?.guests.map( (v,k,a) => <li key={k}>{v}</li>)}
            </ul>            
        </Modal>
    </>;
}