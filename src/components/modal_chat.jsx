import React, { useContext, useEffect, useState, useRef } from 'react'
import { Image, Button, Form, InputGroup } from 'react-bootstrap'
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'
import { AuthContext } from 'utils/ctx_authentication';

import * as BRA from 'lib_bra'
import toast from 'react-hot-toast'

let messages = [];
export default () => {
    const inputRef = useRef(null);
    const rooms = useContext(RoomsContext);
    const auth = useContext(AuthContext);

    const [show, setShow] = useState(false);
    const [state, setState] = useState(0);

    useEffect(() => { }, [rooms.messages]);

    function handleSubmit(e) {
        e.preventDefault();
        rooms.sendMessage(inputRef.current.value)
            .then(() => inputRef.current.value = "")
    }

    console.log(rooms.messages)

    return <>
        <Nav.Item onClick={() => setShow(s => !s)} disabled={!rooms.current}><i className="bi bi-chat-dots" />Chat</Nav.Item>
        <Modal id="chat" buttons={[
            <Form className="flex-grow-1" noValidate validated={inputRef.current?.value.length ? true : false} onSubmit={handleSubmit}>
                <InputGroup >
                    <Form.Control
                        ref={inputRef}
                        placeholder="Type a message to send"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        name="message" type="text"
                    />
                    <Button type="submit" variant="outline-primary" id="button-addon2">
                        <i className="bi bi-arrow-return-left" />
                    </Button>
                </InputGroup>
            </Form>
        ]} tabIndex="0" closeButton size="md" {...{ show, setShow }} title={<span><i className="bi bi-chat-dots" /> Chat</span>}>
            <ul className="messages">
                {rooms.messages.map((message, i) => <>{message.username? <li key={i} className={message.username === auth.user.username ? "sent" : "replies"}>
                    <Image className="border border-light border-2 shadow" roundedCircle src="http://emilcarlsson.se/assets/mikeross.png" alt={message.username} />
                    <p className="rounded-3 shadow">
                        <span className="meta d-block">
                            <span className="fw-bold">{message.username}</span>

                            <span className="float-end ps-3" style={{ opacity: .5 }}>   {(() => {
                                let d = new Date(message.timestamp);
                                return `${d.getHours()}:${d.getMinutes()}`
                            })()}</span>
                        </span>
                        {message.text}
                    </p>
                     </li>
                : <li key={i} className="meta"> {message.text} </li>}</>
                )}

            </ul>
        </Modal>
        <style global jsx>{`
            .messages {
                padding-left:0;
                img{
                    width: 2rem;
                    height: 2rem;
                }
                
                li{
                    margin-top: .25rem;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    align-items: top;
                    
                    & p{
                        max-width: 60%;
                        padding: .125rem .5rem;
                        margin: .125rem .5rem;
                    }
            
            
                    @media screen and (max-width: 735px) {
                        & p{
                            max-width: 75%;
                        }
                    }
                }
                .sent{
                    flex-direction: row-reverse;
                    //float: right;
                    & p{
                        background-color: #f5f5f5;
                    }
                }
                .replies{
                    
                    //float: left;
                    & p{
                        background-color: #435F7A;
                        color: white;
                    }
                }

            }
        `}</style>
    </>;
}