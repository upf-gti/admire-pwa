import toast from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Form, FloatingLabel, OverlayTrigger, Tooltip, Button} from 'react-bootstrap'

import http from 'utils/http'
import MD from 'utils/md'
import Modal from 'partials/modal'


export default ()=>{
    let { token } = useParams();
    const history = useHistory();

    const formRef = useRef(null);
    const [validated, setValidated] = useState(undefined);
    const [formvalues, setFormValues] = useState({formErrors:{}});

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

    function hasError(error){
        return(error.length === 0 ? '' : 'has-error');
    }

    async function handleSubmit(e){
        e.preventDefault();
        const toastId = toast.loading('Resetting password...');
        const password = formvalues.password;
        await http.post(`${process.env.REACT_APP_API_URL}/reset-password/${token}`, {password})
        .then( ({status, description, message }) => {
            switch (status) {
                case 'ok':
                    toast.success('Success', {id: toastId});
                    setTimeout( ()=>history.push(`/`), 1000);
                    break;
                case 400: toast.error(message, {id: toastId}); break;
                case 'error': toast.error(description, {id: toastId}); break;
                default: toast.warn(description, {id: toastId});
            }
        })
        .catch(err => {
            toast.error(`Error: ${err}`, {id: toastId});
        });
    }

    return <>
        <Modal size="md" show={true} 
            title={<h2 className="user-select-none">Reset password</h2>}
        >
            <MD className="user-select-none">{ "Please enter your new password."}</MD>
            
            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <FloatingLabel controlId="floatingPassword" label="New Password">
                    <Form.Control required name="password" type="password" placeholder=" " onChange={handleUserInput} defaultValue={formvalues.password??""}/>
                </FloatingLabel>

                <OverlayTrigger placement="bottom"
                overlay={
                    <Tooltip className={`${validated?"d-none":""} mt-2`}  id={`tooltip-bottom`}>
                        Check form errors
                    </Tooltip>
                }
                >
                    <span style={{padding:"10px 0"}}>
                        <Button className="mt-4" type="submit" disabled={!validated} > Proceed </Button>
                    </span>
                </OverlayTrigger>

            </Form>

        </Modal> 
    </>
}