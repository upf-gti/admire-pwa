import React, {useContext, useRef, useEffect, useState} from 'react'
import { Button, Form, FloatingLabel, Spinner } from 'react-bootstrap'

import MD from 'utils/md'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'

export default ({show, setShow, onSubmit, ...props}) => {
    const rooms                   = useContext(RoomsContext);
    const ref                     = useRef(null);
    const [isValid, setValid]     = useState(true);//eslint-disable-line
    const [fetching, setFetching] = useState(0);               //0: not fetching, 1: fetching, 2: success, 3: failed

    useEffect(()=>{
       
        if ( !ref?.current || !show ) return;

        ref.current.addEventListener("submit", (e) => { 
            e.preventDefault();
        });
    },[])

    function submit(event) {

        event.preventDefault();

        if ( !ref?.current || !show ) return;
        let [password] = Array.from(ref.current.elements).map(v => v.value);

        onSubmit(password)
        .then( () => setShow(false) )
        .catch( () => setFetching(3) )
        .finally( () => {
            setTimeout( () => setFetching(0), 1000);
        })
    }

    let button = <Button disabled={!isValid} variant={isValid?"outline-primary":"outline-secondary"} onClick={submit} >Proceed!</Button>;
    switch(fetching){
        case 1: button = <Button variant="outline-primary"> <Spinner as="span"      animation="border"      size="sm"      role="status"      aria-hidden="true"/></Button>; break;
        case 2: button = <Button variant="outline-success" > ✔️ Succeed! </Button>; break;
        case 3: button = <Button variant="outline-danger"  > ❌ Error </Button>; break;
        default: break;
    }

    return <>       
        
        <Modal className="py-4" tabIndex="0" buttons={[button]} closeButton {...{show, setShow}} title="Room password" >
        <MD>{``}</MD>
        <Form ref={ref} onSubmit={submit}>
            <FloatingLabel controlId="floatingInput" label="password" className="mb-3">
                <Form.Control name="password" type="password" placeholder="password"/>
            </FloatingLabel>
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