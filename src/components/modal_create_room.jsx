import { Col, Card, Button, Form, FloatingLabel, Spinner } from 'react-bootstrap'
import React, {useContext, useRef, useEffect, useState, useReducer} from 'react'

import MD from 'utils/md';
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'




export default () => {
    const rooms                   = useContext(RoomsContext);
    const ref                     = useRef(null);
    const [show, setShow]         = useState(false);
    const [isValid, setValid]        = useState(false);
    const [fetching, setFetching] = useState(0);               //0: not fetching, 1: fetching, 2: sucess, 3: failed

    useEffect(()=>{
        function onKeyDown(e) {
            if (e.keyCode === 13) {
                setShow(true);
            }
        }
            window.addEventListener('keydown', onKeyDown);
        return ()=>{
            window.removeEventListener('keydown', onKeyDown);
        }
    },[])

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
        <Nav.Button onClick={()=>setShow(1)} label="Create room" appendclass="shadow rounded-circle bg-danger" >
            <i className="bi bi-plus-lg"></i> 
        </Nav.Button>
        {/*<Col >
            <Card id='new-room-card' onClick={()=>setShow(1)} className="bg-dark text-light">
            <Card.Img variant="top" src={`https://unsplash.it/seed/test/160/100`} />
            <Card.Body>
            <Card.Title className='position-absolute top-50 start-50 translate-middle'>Create room</Card.Title>
            </Card.Body>
            </Card>
        </Col>

        <Nav.Item onClick={()=>setShow(1)} label="Leave room" >
            <i className="bi bi-telephone-+"></i>New Room
        </Nav.Item>
        \*/}
        <Modal onKeyDown={ (e)=> (e.keyCode === 13) && submit() } tabIndex="0" buttons={[button]} closeButton size="md" {...{show, setShow}} title={<span>Let's create a room</span>}>
        <MD>{``}</MD>
        <FloatingLabel controlId="floatingInput" label="roomId" className="mb-3">
                <Form.Control ref={ref} onChange={handleUserInput} required name="roomId" type="text" placeholder="roomId"/>
            </FloatingLabel>
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