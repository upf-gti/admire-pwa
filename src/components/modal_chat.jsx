import React, {useContext, useEffect, useState, useRef} from 'react'
import {Button, Form} from 'react-bootstrap'
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'
import * as BRA from 'lib_bra'

let messages = [];
export default () => {
    const inputRef          = useRef(null);
    const rooms             = useContext(RoomsContext);
    const [show, setShow]   = useState(false);
    const [state, setState] = useState(0);

    function onMessage({event, data})
    {
        if(!data) return;
        //const {text, timestamp, username} = data;
        messages.push(data);
        setState(s => s+1)
    }

    useEffect(() => {
        if(!rooms.current){
            BRA.appClient.off(BRA.APPEvent.ChatText, onMessage);
            return;
        }
        BRA.appClient.on(BRA.APPEvent.ChatText, onMessage);
        return ()=>{
            messages = [];
            BRA.appClient.off(BRA.APPEvent.ChatText, onMessage);
        }
    },[rooms.current]);
    
    const buttons = [
        <Form.Control ref={inputRef} className="flex-grow-1" name="message" type="text" placeholder=" " />,
        <Button variant="primary" onClick={() => {
            BRA.appClient.sendText(inputRef.current.value, ()=>{
                inputRef.current.value = "";
            });
        }}><i className="bi bi-arrow-return-left"/></Button>
    ]
    return <>
        <Nav.Item onClick={()=>setShow(s => !s)} disabled={!rooms.current}><i className="bi bi-chat-dots"/>Chat</Nav.Item>
        <Modal buttons={buttons} tabIndex="0" closeButton size="md" {...{show, setShow}} title={<span><i className="bi bi-chat-dots"/> Chat</span>}>
            <ul>
                {messages.map((message, i) => <li key={i}>{message.username}{message.text}</li>)}
                {/*
                rooms.current?.users?.map( (v,k,a) => v && <li key={k}>{v?.username}</li> )
                */}
            </ul>            
        </Modal>
    </>;
}