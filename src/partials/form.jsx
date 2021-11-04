import { useState, useEffect, useRef } from 'react'

export default ({handleSubmit}) => {

    const formRef = useRef(null);
    const [formvalues, setFormValues] = useState({formErrors:{}, email: cookies.get("admire_app_email")});
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

    function hasError(error){
        return(error.length === 0 ? '' : 'has-error');
    }

    return <>

    </>
}