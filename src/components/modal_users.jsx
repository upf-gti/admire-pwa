import React, {useContext, useEffect, useState} from 'react'

import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'


export default () => {
    const rooms                   = useContext(RoomsContext);
    const [show, setShow]         = useState(false);

    //useEffect(() => {},[rooms.current]);// eslint-disable-line
    
    return <>
        <Nav.Item onClick={()=>setShow(s => !s)} disabled={!rooms.current} ><i className="bi bi-people"/>Users</Nav.Item>
        <Modal tabIndex="0" closeButton size="md" {...{show, setShow}} title={<span><i className="bi bi-people"/> Users</span>}>
            <ul>
                {rooms.current?.users?.map( (v,k,a) => v && <li key={k}>{v?.username}</li> )}
            </ul>            
        </Modal>
    </>;
}