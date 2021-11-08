//https://learnetto.com/blog/react-form-validation

import { useContext, useRef, useState, useEffect } from 'react';
import { Row, Col, Card,Form, FloatingLabel, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap"
import { AuthContext } from 'utils/ctx_authentication';
import RecoveryModal from 'components/modal_recovery'
import RegisterModal from 'components/modal_register'
import logo from 'assets/img/logo.png';
import toast from 'react-hot-toast';
import cookies from '@h3r/cookies'
import * as BRA from 'lib_bra'

export default () => {
    const auth = useContext(AuthContext);

    const formRef = useRef(null);
    const [validated, setValidated] = useState(undefined);
    const [formvalues, setFormValues] = useState({formErrors:{}, email: cookies.get("admire_app_email"), remember: !!cookies.get("admire_app_email")});
   

    async function handleSubmit(e){
        e.preventDefault();
        auth.login(formvalues.email, formvalues.password)
        .then(  app_token => {
            if(formvalues.remember){
                cookies.set('admire_app_token', app_token, process.env.REACT_APP_COOKIES_EXPIRE_TIME);
                cookies.set("admire_app_email", formvalues.email, process.env.REACT_APP_COOKIES_EXPIRE_TIME);
            }
        });
    }

    function handleUserInput (e) {
        const name  = e.target.name;
        const type  = e.target.type;
        const  value = type==="checkbox"?e.target.checked:e.target.value;

        validateField(name, value, type);
    }

    function validateField(name, value, type = "any"){
        let check = false;
        let {formErrors} = formvalues;

        switch(type){
            case 'email':
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                check = re.test(value);
                formErrors[name] = check ? '' : ' is invalid';
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
    <Card id="login" bg="light" className="flex-column text-center position-absolute start-50 top-50 translate-middle" style={{ width: '24rem' }}>

        <Col>
            <Card.Img variant="top" className="mt-4 user-select-none" src={logo}/>
            <h1 className="text-start ps-4 mb-0 mt-3 user-select-none">{process.env.REACT_APP_NAME}</h1>
            <div className="divider"><span/></div>
        </Col>

        <Col>
            <Card.Body as={Col} className="text-start px-4 pb-4">

            <Card.Text className="user-select-none">Enter your e-mail adress and your password.</Card.Text>
            
            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control required name="email" type="email" placeholder=" " onChange={handleUserInput} defaultValue={formvalues.email??" "}/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control required name="password" type="password" placeholder=" " onChange={handleUserInput} defaultValue={formvalues.password??""}/>
                </FloatingLabel>

                <Form.Switch id="remember-switch" label="Remember me" className="user-select-none" name="remember" onChange={handleUserInput} defaultChecked={formvalues.remember??false}/>


                <OverlayTrigger placement="bottom"
                    overlay={
                        <Tooltip className={`${validated?"d-none":""} mt-2`}  id={`tooltip-bottom`}>
                            Check form errors
                        </Tooltip>
                    }
                    >
                        <span style={{padding:"10px 0"}}>
                            <Button size="sm" className="mt-4" type="submit" disabled={!validated && auth.isConnected} > 
                                {auth.isConnected?
                                <><i className="bi bi-box-arrow-in-left"/> Log me in </>
                                : <><Spinner as="span"animation="grow" size="sm" role="status" aria-hidden="true"/> Connecting </>
                            }</Button>
                        </span>
                    </OverlayTrigger>
                    
                <RecoveryModal/>
            </Form>


            </Card.Body>
            <RegisterModal/>
        </Col>
    </Card>

    <style global jsx>{`
        @import "src/variables.scss";
        .divider {
                border-bottom: 1px solid #FFF;
                background-color: #DADADA;
                height: 2px;
                margin: 0.5em 0px 1.5em;

                & span{
                    position:relative;
                    display: block;
                    width: 75px;
                    height: 3px;
                    background-color: $color4;
                    transform:translatey(-25%);
                    left: 6%;
                }
        }

        #login{
            border:none;
            img {
                width: 192px;
                filter: 
                    hue-rotate(260deg)
                ;
            }

            .card-footer{
                color:$text;
                background:$color4;
                transition: all 0.1s ease-in-out; 
                &:hover{
                    background:darken($color4, 10%);
                    font-weight:bold;
                    cursor:pointer;
                }
            }
        } 

        @media only screen and (orientation: landscape) and (max-height: 671px) {           
            #login{
                width: 40rem !important;
                flex-direction: row !important;
                .col{
                    align-self: end;
                }
            }
        }
        @media only screen and (orientation: portrait){

        }    
    `}</style>
    </>;
}
