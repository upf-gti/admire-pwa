import React, {useState, useContext, useRef } from 'react';
import { Row, Col, Form, FloatingLabel, ButtonGroup, Button, Image } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import { AuthContext } from 'utils/ctx_authentication';

import profile_img from 'assets/img/profile_light.png'
import HForm from 'utils/forms'
import toast from 'react-hot-toast';

export default () => {
    const ref = useRef(null);
    const auth = useContext(AuthContext);
    const [show, setShow] = useState(false);
    
    //introduction message to user settings panel
    
    async function submit(){
        if ( !ref?.current || !show ) return;
        let [username, email, bla, avatar, name, surname, birthdate] = Array.from(ref.current.elements).map(v => v.value);
        auth.updateUserInfo({username, email, avatar, name, surname, birthdate});
    }

    async function clear(){
        Array.from(ref.current.elements).foreach(v => {
            debugger;
        });
        toast.success('User info restored');
    }


    if(!auth.isLogged) return <></>;
    return <>
        <Button variant="link" onClick={ ()=>setShow(1) }>Profile</Button>
       

        <Modal closeButton size="lg" {...{show, setShow}} 
        //title={ <h2 className="user-select-none">Profile</h2>}
        buttons={[
        <Button onClick={auth.logout}><i className="bi bi-power"></i> Log me out</Button>
        ,      
        
        <div align="center" className="fw-bolder">
        <ButtonGroup>
            <Button onClick={submit} variant = "outline-primary">Save</Button>
            <Button onClick={clear} variant = "outline-secondary">Discard</Button>
        </ButtonGroup>
        </div>
        ]}
        >
        <Row>
        <Col xs={6}>
            <Col xs="auto" className="text-center mb-2">
                <Image
                    id="avatar-img"
                    src={ auth.user?.avatar.length? auth.user?.avatar : profile_img }
                    roundedCircle
                    //className='position-absolute top-0 start-50 bg-danger shadow'
                    width="128" height="128"
                />
            </Col>
            <Col>
            <MD className="user-select-none">{`
                # Welcome ${auth.user.username}!
                This panel is where you can change your profile information. You can also change your password.
                If you have any questions, please contact us.
                `}</MD>
            </Col>
        </Col>
        <Col xs={6}>
            <Form ref={ref}>
            <Form.Group className="mb-1" children={<FloatingLabel label="username">     <Form.Control disabled name='username'   placeholder='username'   defaultValue={auth.user.username}/*onChange={handleUserInput}*/ type="text"      /*defaultValue={formvalues['username'  ]}*/     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="email">        <Form.Control disabled name='email'      placeholder='email'      defaultValue={auth.user.email}/*onChange={handleUserInput}*/ type="email"     /*defaultValue={formvalues['email'     ]}*/     />      </FloatingLabel>} />{/*value={userEmail} onChange={event => setEmail(event.target.value)} isInvalid={!isEmailValid} /> */}
            <Form.Group className="mb-1" children={<FloatingLabel label="password">     <Form.Control disabled name='password'   placeholder='password'   defaultValue={auth.user}/*onChange={handleUserInput}*/ type="password"  /*defaultValue={formvalues['password'  ]}*/     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="avatar URL">   <Form.Control disabled name='avatar'     placeholder='avatar URL' defaultValue={auth.user.avatar}/*onChange={handleUserInput}*/ type="avatar"    /*defaultValue={formvalues['avatar URL']}*/     />      </FloatingLabel>} />{/*value={image_url !== '' ? image_url : userEmail !== '' ? gravatar_url : ''} onChange={event => setImageURL(event.target.value)} */}
            <Form.Group className="mb-1" children={<FloatingLabel label="name">         <Form.Control disabled name='name'       placeholder='name'       defaultValue={auth.user.name}/*onChange={handleUserInput}*/ type="text"      /*defaultValue={formvalues['name'      ]}*/     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="surname">      <Form.Control disabled name='surname'    placeholder='surname'    defaultValue={auth.user.surname}/*onChange={handleUserInput}*/ type="text"      /*defaultValue={formvalues['surname'   ]}*/     />      </FloatingLabel>} />
            <Form.Group className="mb-1" children={<FloatingLabel label="birthddate">   <Form.Control disabled name='birthdate'  placeholder='birthdate'  defaultValue={auth.user.birthdate}/*onChange={handleUserInput}*/ type="date"      /*defaultValue={formvalues['birthdate' ]}*/     />      </FloatingLabel>} />
            </Form>
        </Col>

  
        </Row>
        </Modal>
        <style global jsx>{`

        `}</style>
    </>;
}