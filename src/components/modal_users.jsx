import React, {useContext, useEffect, useState} from 'react'
import {Image} from 'react-bootstrap'
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
            <ul id="user-list">
                {rooms.current?.users?.map( (v,k,a) => v && 
                <li key={k}>
                    <span onClick={()=>rooms.kickUser(v?.username)}>❌</span>
                    <Image className="border border-light border-2 shadow" roundedCircle src={v.avatar} alt={v.username} style={{width: "1.5rem", height: "1.5rem"}}/>
                    {v?.username}
                </li> )}
            </ul>            
        </Modal>
        <style jsx>{`

            #user-list{
                list-style: none;
                padding:0;

                & span{
                    cursor:pointer;
                }
            }
        `}</style>
    </>;
}