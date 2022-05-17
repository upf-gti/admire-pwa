import React, {useState, useContext, useEffect, useRef  } from 'react';
import { Button, Form, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import { AuthContext } from 'utils/ctx_authentication';
import toast from 'react-hot-toast';
import http from 'utils/http'

export default () => {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const auth = useContext(AuthContext);

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



    useEffect(()=>{
        function validateForm(){
            let isValid = true;
            for( let key in formvalues ){
                if( key.indexOf('_check') !== -1 )
                    isValid &= formvalues[key];
            }
            setValidated( isValid?true:false );
        }
        validateForm();
    },[formvalues]);

    useEffect(()=>{
        setValidated( false );
    },[]);

    async function handleSubmit(e){
        e.preventDefault();
        const email = formvalues.email.toLowerCase();
        const toastId = toast.loading('Resetting password...');
        await http.post(`${process.env.REACT_APP_API_URL}/forgot-password`, { data: {email} })
        .then(({error, message}) => {
            if (error) {
                return toast.error(`onSubmitRecovery: ${message}`, { id: toastId });
            }
            setShow(false);
            toast.success('Success', { id: toastId });
        })
        .catch(err => {
            toast.error(`onSubmitRecovery: ${err}`, { id: toastId });
        });
    }

    function hasError(error){
        if(!error) return "";
        return(error.length === 0 ? '' : 'has-error');
    }

    const button =  <OverlayTrigger placement="bottom"
    overlay={
        <Tooltip className={`${validated?"d-none":""}`}  id={`tooltip-bottom`}>
            {Object.entries(formvalues.formErrors).map(([key, value]) => { return <span>{key}: {value}</span> }) }
        </Tooltip>
    }
    >
        <span style={{padding:"10px 0"}}>
            <Button type="submit" onClick={handleSubmit} disabled={!validated && auth.isConnected} > Send password reset email </Button>
        </span>
    </OverlayTrigger>

    return <>
        <Button size="sm" className="mt-4 forgot-button" variant="link" onClick={ ()=>setShow(1) }><i className="bi bi-lock"></i> Forgot password?</Button>
        <Modal size="md" closeButton {...{show, setShow}} 
        buttons={[button]} 
        title={<h2 className="user-select-none">Forgot Password</h2>} 
        >
            <MD className="user-select-none">{`Enter your email adress, on a couple of minutes you will receive an email with a link to reset your password.`}</MD>
            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control required className={ hasError(formvalues.formErrors?.email)} name="email" type="email" placeholder=" " onChange={handleUserInput} />
                </FloatingLabel>
            </Form>
        </Modal>

        <style global jsx>{`
        @import "src/variables.scss";
            
            .forgot-button {
                float: right;
            }
        `}</style>
    </>;
}