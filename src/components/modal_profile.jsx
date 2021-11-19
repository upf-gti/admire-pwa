import React, {useState, useContext } from 'react';
import { Form, FloatingLabel, ButtonGroup, Button, Image } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import { AuthContext } from 'utils/ctx_authentication';

import profile_img from 'assets/img/profile_light.png'
import HForm from 'utils/forms'

export default () => {
    const [show, setShow] = useState(false);
    const auth = useContext(AuthContext);
    
    //introduction message to user settings panel
    
    function onSubmit(){
        
    }


    if(!auth.isLogged) return <></>;
    return <>
        <Button variant="link" onClick={ ()=>setShow(1) }>Profile</Button>
        <HForm onSubmit={onSubmit}>

        <Modal closeButton size="lg" {...{show, setShow}} 
        title={<h2 className="user-select-none">Profile: {auth.user.username}</h2>}
        buttons={[<Button onClick={auth.logout}><i className="bi bi-power"></i> Log me out</Button>]}
        >
        <Image
            id="avatar-img"
            src={ auth.user?.avatar.length? auth.user?.avatar : profile_img }
            roundedCircle
            className='position-absolute top-0 start-50 bg-danger shadow'
            width="128" height="128"
        />

        <MD className="user-select-none">{`
            # Welcome to your settings
            Welcome to your settings.
            This panel is where you can change your profile information.
            You can also change your password.
            If you have any questions, please contact us.
        `}</MD>

        <Form.Group className="mb-1" children={<FloatingLabel label="username">     <Form.Control name='username'   placeholder='username'   /*onChange={handleUserInput}*/ type="text"      /*defaultValue={formvalues['username'  ]}*/     />      </FloatingLabel>} />
        <Form.Group className="mb-1" children={<FloatingLabel label="email">        <Form.Control name='email'      placeholder='email'      /*onChange={handleUserInput}*/ type="email"     /*defaultValue={formvalues['email'     ]}*/     />      </FloatingLabel>} />{/*value={userEmail} onChange={event => setEmail(event.target.value)} isInvalid={!isEmailValid} /> */}
        <Form.Group className="mb-1" children={<FloatingLabel label="password">     <Form.Control name='password'   placeholder='password'   /*onChange={handleUserInput}*/ type="password"  /*defaultValue={formvalues['password'  ]}*/     />      </FloatingLabel>} />
        <Form.Group className="mb-1" children={<FloatingLabel label="avatar URL">   <Form.Control name='avatar'     placeholder='avatar URL' /*onChange={handleUserInput}*/ type="avatar"    /*defaultValue={formvalues['avatar URL']}*/     />      </FloatingLabel>} />{/*value={image_url !== '' ? image_url : userEmail !== '' ? gravatar_url : ''} onChange={event => setImageURL(event.target.value)} */}
        <Form.Group className="mb-1" children={<FloatingLabel label="name">         <Form.Control name='name'       placeholder='name'       /*onChange={handleUserInput}*/ type="text"      /*defaultValue={formvalues['name'      ]}*/     />      </FloatingLabel>} />
        <Form.Group className="mb-1" children={<FloatingLabel label="surname">      <Form.Control name='surname'    placeholder='surname'    /*onChange={handleUserInput}*/ type="text"      /*defaultValue={formvalues['surname'   ]}*/     />      </FloatingLabel>} />
        <Form.Group className="mb-1" children={<FloatingLabel label="birthddate">   <Form.Control name='birthdate'  placeholder='birthdate'  /*onChange={handleUserInput}*/ type="date"      /*defaultValue={formvalues['birthdate' ]}*/     />      </FloatingLabel>} />
        

        <div align="center" className="fw-bolder">
        <ButtonGroup>
            <Button variant = "outline-primary">Save</Button>
            <Button variant = "outline-secondary">Discard</Button>
        </ButtonGroup>

        </div>
        </Modal>
        </HForm>
        <style global jsx>{`
            #avatar-img{
                transform: translate(-50%,-125%) !important;
            }
        `}</style>
    </>;
}