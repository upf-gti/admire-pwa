import Gravatar from 'gravatar'
import {Form} from 'react-bootstrap'
import {useRef, useState, useEffect} from 'react'

function testImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function testImage(url, timeoutT) {
    return new Promise(function (resolve, reject) {
        var timeout = timeoutT || 5000;
        var timer, img = new Image();
        img.onerror = img.onabort = function () {
            clearTimeout(timer);
            reject("Error: the url provided is not an image");
        };
        img.onload = function () {
            clearTimeout(timer);
            resolve("success");
        };
        timer = setTimeout(function () {
            // reset .src to invalid URL so it stops previous
            // loading, but doesn't trigger new load
            img.src = "//!!!!/test.jpg";
            reject("timeout");
        }, timeout);
        img.src = url;
    });
}

function testEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default function ({children, onSubmit, ...props}){
    const formRef = useRef(null);
    const [validated, setValidated]     = useState(undefined);
    const [formvalues, setFormValues]   = useState({formErrors:{}});

    function validateField(name, value, type = "any"){
        let check = false;
        let {formErrors} = formvalues;
        let values = {...formvalues};

        switch(type){
            case 'email':
                check = testEmail(value);
                formErrors[name] = check ? '' : ' is invalid';

                if(check){
                    const url = "https:"+Gravatar.url(value, { s: '256', r: 'pg', d: '404' });
                    testImage(url, 2000)
                    .then( (v) =>   { setFormValues( { ...values, gravatar:url,   [`gravatar_check`]:check, formErrors } ); })
                    .catch((err) => { setFormValues( { ...values, gravatar:null,  [`gravatar_check`]:check, formErrors } ); });
                }else{
                    values = { ...values, gravatar:null,  [`gravatar_check`]:check, formErrors };
                }

                break;

            case 'password':
                check = value.length >= 6;
                formErrors[name] = check ? '': ' is too short';
                break;

            default:
                check = true;
                formErrors[name] = '';
                break;
        }
        setFormValues( { ...values, [name]:value, [`${name}_check`]:check, formErrors } );
    }

    function validateForm(){
        let isValid = true;
        for( let key in formvalues ){
            if( key.indexOf('_check') !== -1 )
                isValid &= formvalues[key];
        }
        setValidated( isValid?true:false );
    }

    async function handleSubmit(e){
        e.preventDefault();
        if(onSubmit) 
            onSubmit();
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

    return <Form validated={validated} ref={formRef} {...props}>
        {children}
    </Form>
}