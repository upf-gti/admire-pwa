import React, {useState, useContext, useEffect, useRef  } from 'react';
import { Button, Form, FloatingLabel, Spinner, OverlayTrigger, Tooltip, Card, Image as ReactImage } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import { AuthContext } from 'utils/ctx_authentication'
import http from 'utils/http'
import toast from 'react-hot-toast'
import Gravatar from 'gravatar'

export default () => {
    const formRef = useRef(null);
    const [show, setShow] = useState(false);
    const auth = useContext(AuthContext);

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

        function checkImageURL(url) {
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

        switch(type){
            case 'email':
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                check = re.test(value);
                formErrors[name] = check ? '' : ' is invalid';

                if(check && !formvalues.gravatar){
                    const url = "https:"+Gravatar.url(value, { s: '256', r: 'pg', d: '404' });
                    testImage(url, 2000)
                    .then( (v) => { 
                        setFormValues( { ...values, gravatar:url,  [`gravatar_check`]:check, formErrors } );
                    })
                    .catch((err) => {
                        setFormValues( { ...values, gravatar:null,  [`gravatar_check`]:check, formErrors } );
                    });
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


    useEffect(()=>{
        validateForm();
    },[formvalues]);

    useEffect(()=>{
        setValidated( false );
    },[]);

    async function handleSubmit(e){
        e.preventDefault();
        const {username, email, password, avatar, name, surname, birthdate, role} = formvalues;
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
        return(error.length === 0 ? '' : 'has-error');
    }



    return <>
        <Card.Footer className="text-center user-select-none" onClick={ ()=>setShow(1) }> Create an account </Card.Footer>
        <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
        <Modal className="py-4" closeButton {...{show, setShow}} 
        title={<h2 className="user-select-none">Let's create your account</h2>}
        buttons={[
            <OverlayTrigger placement="bottom"
            overlay={
                <Tooltip className={`${validated?"d-none":""}`}  id={`tooltip-bottom`}>
                    Enter your email address first.
                </Tooltip>
            }
            >
            <Button type="submit"  onClick={handleSubmit} disabled={!validated && auth.isConnected} >CREATE ACCOUNT</Button>
            </OverlayTrigger>
        ]}
        >
            <ReactImage
                id="avatar-img"
                src={formvalues.avatar ?? formvalues.gravatar ?? "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fforums.opera.com%2Fassets%2Fuploads%2Fprofile%2F192104-profileavatar.png&f=1&nofb=1"}
                roundedCircle
                className='position-absolute top-0 start-50 bg-danger shadow'
                width="128" height="128"
                
            />

            <MD className="user-select-none">{`Create your account. It's free and only takes a minute.`}</MD>

            <Form.Group className="mb-1" children={<FloatingLabel label="username">     <Form.Control name='username'   placeholder='username'   onChange={handleUserInput} type="text"      defaultValue={formvalues['username'  ]}     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="email">        <Form.Control name='email'      placeholder='email'      onChange={handleUserInput} type="email"     defaultValue={formvalues['email'     ]}     />      </FloatingLabel>} />{/*value={userEmail} onChange={event => setEmail(event.target.value)} isInvalid={!isEmailValid} /> */}
            <Form.Group className="mb-1" children={<FloatingLabel label="password">     <Form.Control name='password'   placeholder='password'   onChange={handleUserInput} type="password"  defaultValue={formvalues['password'  ]}     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="avatar URL">   <Form.Control name='avatar'     placeholder='avatar URL' onChange={handleUserInput} type="avatar"    defaultValue={formvalues['avatar URL']}     />      </FloatingLabel>} />{/*value={image_url !== '' ? image_url : userEmail !== '' ? gravatar_url : ''} onChange={event => setImageURL(event.target.value)} */}
            <Form.Group className="mb-1" children={<FloatingLabel label="name">         <Form.Control name='name'       placeholder='name'       onChange={handleUserInput} type="text"      defaultValue={formvalues['name'      ]}     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="surname">      <Form.Control name='surname'    placeholder='surname'    onChange={handleUserInput} type="text"      defaultValue={formvalues['surname'   ]}     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="birthddate">   <Form.Control name='birthdate'  placeholder='birthdate'  onChange={handleUserInput} type="date"      defaultValue={formvalues['birthdate' ]}     />      </FloatingLabel>} />
            
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