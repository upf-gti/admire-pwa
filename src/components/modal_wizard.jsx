import { useState } from 'react'

import Nav from 'partials/nav'
import Wizard from 'views/wizard'
import Modal from 'partials/modal'


export default () => {
    const [show, setShow]         = useState(false);

    return <>
        <Nav.Item onClick={()=>setShow(s => !s)} ><i className="bi bi-magic"/>Settings</Nav.Item>
        <Modal id='wizard' tabIndex="0" closeButton size="md" {...{show, setShow}} _title={<span>Settings: Wizard</span>}>
            <Wizard/>
        </Modal>
    </>;
}