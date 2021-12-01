import Gravatar from 'gravatar'
import toast from 'react-hot-toast'
import React, {useState, useEffect, useRef  } from 'react'
import { Spinner, Button, Form, FloatingLabel, OverlayTrigger, Tooltip, Card, Image as ReactImage } from 'react-bootstrap'

import MD from 'utils/md';
import http from 'utils/http'
import Modal from 'partials/modal'
import profile_img from 'assets/img/profile_light.png'


export default () => {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);

    const [fetching, setFetching]       = useState(false);
    const [validated, setValidated]     = useState(undefined);
    const [formvalues, setFormValues]   = useState({formErrors:{}});
   
    function handleUserInput (e) {
        const name  = e.target.name;
        const type  = e.target.type;
        const value = type==="checkbox"?e.target.checked:e.target.value;
        validateField(name, value, type);
    }

    function validateField(name, value, type = "any"){
        let check = false;
        let {formErrors} = formvalues;
        let values = {...formvalues};

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

        switch(type){
            case 'email':
                const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                check = email_re.test(value);
                formErrors[name] = check ? '' : ' is invalid';
                values = { ...values, [name]:value, [`${name}_check`]:check, formErrors };
                if(check){
                    const url = "https:"+Gravatar.url(value, { s: '256', r: 'pg', d: '404' });
                    testImage(url, 2000)
                    .then( (v) => { 
                        setFormValues( { ...values, gravatar:url,  [`gravatar_check`]:check, formErrors } );
                    })
                    .catch((err) => {
                        setFormValues( { ...values, gravatar:null,  [`gravatar_check`]:check, formErrors } );
                    });
                }else{
                    values = { ...values, gravatar:null,  [`gravatar_check`]:check, formErrors };
                }

                break;

            case 'password':
                const pass_re =  /^[a-zA-Z]+(.){7,20}$/;
                check = pass_re.test(value);
                formErrors[name] = check ? '': ' is too short';

                let confirm = formvalues["password"] === formvalues["password1"];
                formErrors = {...formErrors, confirm: `${!confirm?"Password and confirmation do not match":""}`};
                values = {...values, confirm, formErrors };
                break;

            default:
                check = true;
                formErrors[name] = '';
                break;
        }
        setFormValues( { ...values, [name]:value, [`${name}_check`]:check, formErrors } );
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
        let {username, email, password, avatar, gravatar, name, surname, birthdate, role} = formvalues;
        avatar = avatar?.length? avatar : gravatar??profile_img;
        const toastId = toast.loading('Registering...');
        
        await http.post(`${process.env.REACT_APP_API_URL}/register`, {data:{ username, email, password, avatar, name, surname, birthdate, role }})
        .then(({ error, message, status }) => {
            if(error){
                return toast.error(`onRegister: ${message}`, { id: toastId });
            }
            toast.success('Success', { id: toastId });
            setTimeout( () => { setFetching(0); setShow(false); } , 1000);
        })
        .catch(err => {
            toast.error(`Error: ${err}`, { id: toastId });
        });
    }

    function hasError(error){
        return(error?.length ? '' : 'has-error');
    }

    //onClick={submit}

    let button = <Button onClick={handleSubmit} type="submit" disabled={!validated} variant={validated?"outline-primary":"outline-secondary"}  >CREATE ACCOUNT!</Button>;
    switch(fetching){
        case 1: button = <Button variant="outline-primary"> <Spinner as="span"      animation="border"      size="sm"      role="status"      aria-hidden="true"/></Button>; break;
        case 2: button = <Button variant="outline-success" > ✔️ Succeed! </Button>; break;
        case 3: button = <Button variant="outline-danger"  > ❌ Error </Button>; break;
        default: break;
    }

    console.log(JSON.stringify(formvalues.formErrors));
    return <>
        <Card.Footer className="text-center user-select-none" onClick={ ()=>setShow(1) }> Create an account </Card.Footer>
        <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
        <Modal className="py-4" closeButton {...{show, setShow}} 
        title={<h2 className="user-select-none">Let's create your account</h2>}
        backdrop="static"
        buttons={[
            <OverlayTrigger placement="top"
            overlay={
                <Tooltip className={`${validated?"d-none":""}`}  id={`tooltip-top`}>
                    {Object.entries(formvalues.formErrors).map(([key, value], k) => { return value.length?<p key={k}>{key}: {value}</p>:"" }) }
                </Tooltip>
            }>
            <div>
                {button}
            </div>
            </OverlayTrigger>
        ]}
        >
            <ReactImage
                id="avatar-img"
                src={formvalues.avatar ?? formvalues.gravatar ?? profile_img}
                roundedCircle
                className='position-absolute top-0 start-50 bg-danger shadow'
                width="128" height="128"
            />

            <MD className="user-select-none">{`Create your account. It's free and only takes a minute.`}</MD>

            <Form.Group className = "mb-1" children = {<FloatingLabel label="username">     <Form.Control name='username'   className={ hasError(formvalues.formErrors?.username)}  placeholder='username'   onChange={handleUserInput} type="text"      defaultValue={formvalues['username'  ]}     />      </FloatingLabel>} />
            <Form.Group className = "mb-1" children = {<FloatingLabel label="email">        <Form.Control name='email'      className={ hasError(formvalues.formErrors?.email)}     placeholder='email'      onChange={handleUserInput} type="email"     defaultValue={formvalues['email'     ]}     />      </FloatingLabel>} />{/*value={userEmail} onChange={event => setEmail(event.target.value)} isInvalid={!isEmailValid} /> */}
            <Form.Group className = "mb-1" children = {<FloatingLabel label="password">     <Form.Control name='password'   className={ hasError(formvalues.formErrors?.password)}  placeholder='password'   onChange={handleUserInput} type="password"  defaultValue={formvalues['password'  ]}     />      </FloatingLabel>} />
            <Form.Group className = "mb-1" children = {<FloatingLabel label="confirm password"> <Form.Control name='password2'  className={ hasError(formvalues.formErrors?.password2)} placeholder='password2'  onChange={handleUserInput} type="password"  defaultValue={formvalues['password2'  ]}     />      </FloatingLabel>} />
            <Form.Group className = "mb-1" children = {<FloatingLabel label="avatar URL">   <Form.Control name='avatar'     className={ hasError(formvalues.formErrors?.avatar)}    placeholder='avatar URL' onChange={handleUserInput} type="avatar"    defaultValue={formvalues['avatar URL']}     />      </FloatingLabel>} />{/*value={image_url !== '' ? image_url : userEmail !== '' ? gravatar_url : ''} onChange={event => setImageURL(event.target.value)} */}
            <Form.Group className = "mb-1" children = {<FloatingLabel label="name">         <Form.Control name='name'       className={ hasError(formvalues.formErrors?.name)}      placeholder='name'       onChange={handleUserInput} type="text"      defaultValue={formvalues['name'      ]}     />      </FloatingLabel>} />
            <Form.Group className = "mb-1" children = {<FloatingLabel label="surname">      <Form.Control name='surname'    className={ hasError(formvalues.formErrors?.surname)}   placeholder='surname'    onChange={handleUserInput} type="text"      defaultValue={formvalues['surname'   ]}     />      </FloatingLabel>} />
            <Form.Group className = "mb-1" children = {<FloatingLabel label="birthddate">   <Form.Control name='birthdate'  className={ hasError(formvalues.formErrors?.birthdate)} placeholder='birthdate'  onChange={handleUserInput} type="date"      defaultValue={formvalues['birthdate' ]}     />      </FloatingLabel>} />
            
            <div className="form-floating">
                <select className="form-select" id="floatingSelect" aria-label="Floating label select example">
                    <option value="0">User</option>
                    <option value="1">Admin</option>
                </select>
                <label htmlFor="floatingSelect"> User role</label>
            </div>
        </Modal>
        </Form>
        <style global jsx>{`
            #avatar-img{
                transform: translate(-50%,-125%) !important;
            }
        `}</style>
    </>;
}