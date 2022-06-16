import React, {useEffect, useState, useReducer} from 'react';
import { Button, Image } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import logo from 'assets/img/logo.png';

export default () => {
    const [show, setShow] = useState(false);
    const [proposal, dispatch] = useReducer((o,n)=>n, {proposalEvent : undefined});
    useEffect(() => { 
            window.addEventListener('beforeinstallprompt',onBeforeInstallPrompt, 0);
        return () => { 
            window.removeEventListener('beforeinstallprompt',onBeforeInstallPrompt, 0);
        }
    },[]);

    function onBeforeInstallPrompt(e) 
    {
        debugger;
        e.preventDefault();
        dispatch(state => ({...state, e}));
    }

    async function promptInstall()
    {
        if(!proposal?.proposalEvent) 
            return;

        proposal.proposalEvent.prompt();
        const { outcome } = await proposal.proposalEvent.userChoice;
        if (outcome === 'accepted') {
            dispatch(state => ({ ...state, proposalEvent: undefined }));
        }
    }

    return <>
        <Button variant="link" onClick={ ()=>setShow(1) }>About</Button>
        {/* <Button variant={`${proposal.proposalEvent?"outline-primary":"outline-secondary"}`}size="sm" onClick={promptInstall} disabled={!proposal.proposalEvent}> {`${proposal.proposalEvent? "Install PWA" : "Not available"}`}</Button> */}
        <Modal closeButton size="md" {...{show, setShow}} title={<span>{process.env.REACT_APP_NAME} </span>}>
        <Image className="me-2 float-end" width={48} height={48} src={logo} />
        <MD>{`
        **AdMiRe** is an european project which goal is to develop, validate and demonstrate innovative solutions based on Mixed Reality (MR) technologies.

        The application has the following features:
        - Lobby management to create virtual productions
        - Videoconferences to communicate users and operators
        - Video streaming and routing capabilities
        `}</MD>
        </Modal>
    </>;
}