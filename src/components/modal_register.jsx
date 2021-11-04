import React, {useState, useContext, useEffect, useRef  } from 'react';
import { Button, Form, FloatingLabel, Spinner, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import { AuthenticationContext } from 'utils/authentication';

export default () => {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const auth = useContext(AuthenticationContext);
    const user = "h3R"

    const [formvalues, setFormValues] = useState({formErrors:{}});
    const [validated, setValidated] = useState(undefined);
   
    function handleUserInput (e) {
        const name = e.target.name;
        const value = e.target.value;
        validateField(name, value);
    }

    function validateField(name, value){
        let check = false;
        let {formErrors} = formvalues;

        switch(name){
            case 'email':
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                check = re.test(value);
                formErrors[name] = check ? '' : ' is invalid';
                break;

            case 'password':
                check = value.length >= 6;
                formErrors[name] = check ? '': ' is too short';
                break;

            default: console.warn("Invalid field name: ", name);
        }

        setFormValues( v => ({ ...v, [name]:value, [`${name}_check`]:check, formErrors }) );
    }

    function validateForm(){
        let isValid = true;
        for( let key in formvalues ){
            if( key.indexOf('_check') !== -1 )
                isValid &= formvalues[key];
        }
        setValidated( isValid?true:false );
    }

    useEffect(()=>{
        validateForm();
    },[formvalues]);

    useEffect(()=>{
        setValidated( false );
    },[]);

    function handleSubmit(event){
        alert("NO IMPLEMENTATION")
    }

    function hasError(error){
        return(error.length === 0 ? '' : 'has-error');
    }



    return <>
        <Card.Footer className="text-center user-select-none" onClick={ ()=>setShow(1) }> Create an account </Card.Footer>
        <Modal closeButton {...{show, setShow}} title={<h2 className="user-select-none">Let's create your account</h2>}>
            <MD className="user-select-none">{`Create your account. It's free and only takes a minute.`}</MD>
            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control required name="email" type="email" placeholder=" " 
                    onChange={handleUserInput} />
                </FloatingLabel>

                <OverlayTrigger placement="bottom"
                overlay={
                    <Tooltip className={`${validated?"d-none":""}`}  id={`tooltip-bottom`}>
                        Enter your email address first.
                    </Tooltip>
                }
                >
                    <span style={{padding:"10px 0"}}>
                        <Button type="submit" disabled={!validated && auth.isConnected} > 
                        {auth.isConnected? 
                            <> CREATE ACCOUNT </>
                            : <><Spinner as="span"animation="grow" role="status" aria-hidden="true"/> Connecting </>
                        }</Button>
                    </span>
                </OverlayTrigger>

            </Form>
        </Modal>
    </>;
}