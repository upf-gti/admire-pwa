import toast from 'react-hot-toast'
import React, {useContext, useRef, useEffect, useState} from 'react'
import { Button, Form, FloatingLabel, Spinner } from 'react-bootstrap'

import MD from 'utils/md'
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'

export default () => {
    const rooms                   = useContext(RoomsContext);
    const ref                     = useRef(null);
    const [show, setShow]         = useState(false);
    const [isValid, setValid]     = useState(true);//eslint-disable-line
    const [fetching, setFetching] = useState(0);               //0: not fetching, 1: fetching, 2: sucess, 3: failed

    function submit() {
        if ( !ref?.current || !show ) return;
            
        let [roomname, password, size, icon, hidden] = Array.from(ref.current.elements).map(v => v.value);
        
        rooms.createRoom(roomname.toLowerCase(), {password, size, icon, hidden})
        .then( room =>{
            toast.success(`Created room ${room.name}`); 
            setTimeout( () => { setFetching(0); setShow(false); } , 1000);
            setFetching(2);   
        }) 
        .catch( err =>{
            toast.error(`onCreateRoom: ${err}`); 
            setFetching(3);   
            setTimeout( () => { setFetching(0); } , 1000);
        }) 
    }

    function handleUserInput(e){
        //setValid(ref?.current?.value.length > 3);
    }

    let button = <Button disabled={!isValid} variant={isValid?"outline-primary":"outline-secondary"} onClick={submit} >Create</Button>;
    switch(fetching){
        case 1: button = <Button variant="outline-primary"> <Spinner as="span"      animation="border"      size="sm"      role="status"      aria-hidden="true"/></Button>; break;
        case 2: button = <Button variant="outline-success" >Done</Button>; break;
        case 3: button = <Button variant="outline-danger"  >Error</Button>; break;
        default: break;
    }


    return <>
        <Nav.Button onClick={()=>setShow(1)} title="Create room" label="Create room" appendclass="shadow rounded-circle bg-danger" >
            <i className="bi bi-plus"></i> 
        </Nav.Button>
        
        <Modal size="sm" onKeyDown={ (e)=> (e.keyCode === 13) && submit() } tabIndex="0" buttons={[button]} closeButton {...{show, setShow}} title={<span>Room settings</span>}>
        <MD>{``}</MD>
        <Form ref={ref}>
            <FloatingLabel controlId="floatingInput" label="roomId" className="mb-3">
                <Form.Control onChange={handleUserInput} required name="roomId" type="text" placeholder="roomId"/>
            </FloatingLabel>

            <FloatingLabel controlId="floatingInput" label="password" className="mb-3">
                <Form.Control name="password" type="password" placeholder="password"/>
            </FloatingLabel>


            <FloatingLabel controlId="floatingInput" label="size" className="mb-3">
                <Form.Control name="size" min="1" step="1" type="number" placeholder="max users" defaultValue="8"/>
            </FloatingLabel>

            <FloatingLabel controlId="floatingInput" label="icon" className="mb-3">
                <Form.Control name="icon" type="text" placeholder="icon URL"/>
            </FloatingLabel>

            <Form.Switch id="hidden-switch" label="Hidden" name="hidden" defaultValue={false}/>
        </Form>
        </Modal>
        <style global jsx>{`
            #new-room-card {
                cursor: pointer;
                opacity: .5;
                border: 2px dashed white;

                .card-img-top{
                    display: none;
                }
                .card-body{
                    height: 155px;
                }
            }

        `}</style>
    </>;
}