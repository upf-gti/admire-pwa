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
                const pass_re =  /^[a-zA-Z]+(.){7,20}$/;
                check = pass_re.test(value);
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
        return(error?.length? '' : 'has-error');
    }

    async function handleSubmit(e){
        e.preventDefault();
        const toastId = toast.loading('Resetting password...');
        const password = formvalues.password;
        await http.post(`${process.env.REACT_APP_API_URL}/reset-password/${token}`, {data:{password}})
        .then( ({error, message }) => {
            if (error) {
                return toast.error(`onResetPassword: ${message}`, { id: toastId });
            }
            else{
                toast.success('Success', {id: toastId});
                setTimeout( ()=>history.push(`/`), 1000);
            }
        })
        .catch(err => {
            toast.error(`Error: ${err}`, {id: toastId});
        });
    }

    return <>
        <Modal closeButton show={true} 
            setShow={()=>history.push(`/`)}
            onHide={() => history.push("/")} 
            title={<h2 className="user-select-none">Reset password</h2>}
            buttons={[
                <OverlayTrigger placement="bottom"
                overlay={
                    <Tooltip className={`${validated?"d-none":""} mt-2`}  id={`tooltip-bottom`}>
                        Check form errors
                    </Tooltip>
                }
                >
                    <Button type="submit" onClick={handleSubmit} disabled={!validated} > Proceed </Button>
                </OverlayTrigger>
            ]}
        >
            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <MD className="user-select-none">{ "Please enter your new password."}</MD>
                
                <FloatingLabel controlId="floatingPassword" label="New Password">
                    <Form.Control required name="password" type="password" placeholder=" " onChange={handleUserInput} defaultValue={formvalues.password??""}/>
                </FloatingLabel>
            </Form> 
        </Modal> 

    </>
}