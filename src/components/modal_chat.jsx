import React, { useContext, useEffect, useState, useRef } from 'react'
import { Image, Button, Form, InputGroup } from 'react-bootstrap'
import Nav from 'partials/nav'
import Modal from 'partials/modal'
import { RoomsContext } from 'utils/ctx_rooms'
import { AuthContext } from 'utils/ctx_authentication';

import * as BRA from 'lib_bra'

let messages = [];
export default () => {
    const inputRef = useRef(null);
    const rooms = useContext(RoomsContext);
    const auth = useContext(AuthContext);

    const [show, setShow] = useState(false);
    const [state, setState] = useState(0);

    function onMessage({ event, data }) {
        if (!data) return;
        //const {text, timestamp, username} = data;
        messages.push(data);
        localStorage.setItem('messages', JSON.stringify(messages));
        setState(s => s + 1)
    }

    useEffect(() => {
        if (!rooms.current) {
            BRA.appClient.off(BRA.APPEvent.ChatText, onMessage);
            return;
        }
        messages = localStorage.getItem('messages');
        if(messages) messages=JSON.parse(messages);
        else messages=[];

        BRA.appClient.on(BRA.APPEvent.ChatText, onMessage);
        return () => {
            BRA.appClient.off(BRA.APPEvent.ChatText, onMessage);
        }
    }, [rooms.current]);


    function handleSubmit(e) {
        e.preventDefault();
        BRA.appClient.sendText(inputRef.current.value, () => {
            inputRef.current.value = "";
        });
    }

    return <>
        <Nav.Item onClick={() => setShow(s => !s)} disabled={!rooms.current}><i className="bi bi-chat-dots" />Chat</Nav.Item>
        <Modal id="chat" buttons={[
            <Form className="flex-grow-1" noValidate validated={inputRef.current?.value.length} onSubmit={handleSubmit}>
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
                {messages.map((message, i) => <li key={i} className={message.username === auth.user.username ? "sent" : "replies"}>
                    <Image className="border border-light border-2 shadow" roundedCircle src="http://emilcarlsson.se/assets/mikeross.png" alt={message.username} />
                    <p className="rounded-3 shadow">
                        <span className="meta d-block">
                            <span className="fw-bold">{message.username}</span>
                         
                            <span className="float-end ps-3" style={{opacity:.5}}>   {(()=>{
                                let d = new Date(message.timestamp);
                                return `${d.getHours()}:${d.getMinutes()}`
                            })()}</span>
                        </span>
                        {message.text}
                    </p>
                </li>)}
                {/*
                rooms.current?.users?.map( (v,k,a) => v && <li key={k}>{v?.username}</li> )
                */}
            </ul>
        </Modal>
        <style global jsx>{`
            .messages {
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

            /*#chat .messages {
                height: auto;
                min-height: calc(100% - 93px);
                max-height: calc(100% - 93px);
                overflow-y: scroll;
                overflow-x: hidden;
            }
            @media screen and (max-width: 735px) {
                #chat .messages {
                    max-height: calc(100% - 105px);
                }
            }
            #chat .messages::-webkit-scrollbar {
                width: 8px;
                background: transparent;
            }
            #chat .messages::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.3);
            }
            #chat .messages ul li {
                display: inline-block;
                clear: both;
                float: left;
                margin: 15px 15px 5px 15px;
                width: calc(100% - 25px);
                font-size: 0.9em;
            }
            #chat .messages ul li:nth-last-child(1) {
                margin-bottom: 20px;
            }
            #chat .messages ul li.sent img {
                margin: 6px 8px 0 0;
            }
            #chat .messages ul li.sent p {
                background: #435f7a;
                color: #f5f5f5;
            }
            #chat .messages ul li.replies img {
                float: right;
                margin: 6px 0 0 8px;
            }
            #chat .messages ul li.replies p {
                background: #f5f5f5;
                float: right;
            }
            #chat .messages ul li img {
                width: 22px;
                border-radius: 50%;
                float: left;
            }
            #chat .messages ul li p {
                display: inline-block;
                padding: 10px 15px;
                border-radius: 20px;
                max-width: 205px;
                line-height: 130%;
            }
            @media screen and (min-width: 735px) {
                #chat .messages ul li p {
                    max-width: 300px;
                }
            }
            #chat .content .message-input {
                position: absolute;
                bottom: 0;
                width: 100%;
                z-index: 99;
            }
            #chat .content .message-input .wrap {
                position: relative;
            }
            #chat .content .message-input .wrap input {
                font-family: "proxima-nova",  "Source Sans Pro", sans-serif;
                float: left;
                border: none;
                width: calc(100% - 90px);
                padding: 11px 32px 10px 8px;
                font-size: 0.8em;
                color: #32465a;
            }
            @media screen and (max-width: 735px) {
                #chat .content .message-input .wrap input {
                    padding: 15px 32px 16px 8px;
                }
            }
            #chat .content .message-input .wrap input:focus {
                outline: none;
            }
            #chat .content .message-input .wrap .attachment {
                position: absolute;
                right: 60px;
                z-index: 4;
                margin-top: 10px;
                font-size: 1.1em;
                color: #435f7a;
                opacity: .5;
                cursor: pointer;
            }
            @media screen and (max-width: 735px) {
                #chat .content .message-input .wrap .attachment {
                    margin-top: 17px;
                    right: 65px;
                }
            }
            #chat .content .message-input .wrap .attachment:hover {
                opacity: 1;
            }
            #chat .content .message-input .wrap button {
                float: right;
                border: none;
                width: 50px;
                padding: 12px 0;
                cursor: pointer;
                background: #32465a;
                color: #f5f5f5;
            }
            @media screen and (max-width: 735px) {
                #chat .content .message-input .wrap button {
                    padding: 16px 0;
                }
            }
            #chat .content .message-input .wrap button:hover {
                background: #435f7a;
            }
            #chat .content .message-input .wrap button:focus {
                outline: none;
            }*/
        `}</style>
    </>;
}