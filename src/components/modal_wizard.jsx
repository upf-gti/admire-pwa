import { Button, Form, FloatingLabel, Spinner } from 'react-bootstrap'
import React, {useContext, useRef, useEffect, useState, useReducer} from 'react'

import MD from 'utils/md';
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'
import Wizard from 'views/wizard'




export default () => {
    const rooms                   = useContext(RoomsContext);
    const ref                     = useRef(null);
    const [show, setShow]         = useState(false);
    const [isValid, setValid]        = useState(false);
    const [fetching, setFetching] = useState(0);               //0: not fetching, 1: fetching, 2: sucess, 3: failed

    function submit() {
        if ( !ref?.current || !show ) return;
            
        rooms.createRoom(ref.current.value.toLowerCase())
        .then( ()=>{
            setTimeout( () => { setFetching(0); setShow(false); } , 1000);
            setFetching(2);   
        }) 
        .catch( ()=>{
            setFetching(3);   
        }) 
        //setTimeout( () => { setFetching(0); setShow(false); } , 1000);
    }

    function onKeyDown(e) {
        if ( e.keyCode === 13 )
            submit();
    }

    function handleUserInput(e){
        setValid(ref?.current?.value.length > 3);
    }

    let button = <Button disabled={!isValid} variant={isValid?"outline-primary":"outline-secondary"} onClick={submit} >Proceed!</Button>;
    switch(fetching){
        case 1: button = <Button variant="outline-primary"> <Spinner as="span"      animation="border"      size="sm"      role="status"      aria-hidden="true"/></Button>; break;
        case 2: button = <Button variant="outline-success" > ✔️ Succeed! </Button>; break;
        case 3: button = <Button variant="outline-danger"  > ❌ Error </Button>; break;
        default: break;
    }


    return <>
        <Nav.Item onClick={()=>setShow(s => !s)} ><i className="bi bi-magic"/>Settings</Nav.Item>
        <Modal onKeyDown={onKeyDown} tabIndex="0" buttons={[button]} closeButton size="md" {...{show, setShow}} _title={<span>Settings: Wizard</span>}>
            <Wizard/>
        </Modal>
    </>;
}