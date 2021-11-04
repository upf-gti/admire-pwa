import React, {useEffect, useState, useReducer} from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';

export default () => {
    const [show, setShow] = useState(false);
    const [proposal, dispatch] = useReducer((o,n)=>n, {proposalEvent : undefined});
    useEffect(() => { 
            window.addEventListener('beforeinstallprompt',onBeforeInstallPrompt);
        return () => { 
            window.removeEventListener('beforeinstallprompt',onBeforeInstallPrompt);
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
        <Modal closeButton size="md" {...{show, setShow}} title={<span>{process.env.REACT_APP_NAME} - Offline capable <Button variant={`${proposal.proposalEvent?"outline-primary":"outline-secondary"}`}size="sm" onClick={promptInstall} disabled={!proposal.proposalEvent}> {`${proposal.proposalEvent? "Install PWA" : "Not available"}`}</Button></span>}>
        <MD>{`
        An offline-capable AdMiRe version is available, wich is a [Progressive Web App](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/).

        The app serves the following features:
        - Offline-capable (with [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/))
        - "Add to Home Screen" feature on Android and iOS supported devices to launch the app from the home screen.
        - Dark Mode.
        - Privacy-focused - We don't collect any personal data.
        - Lightweight - The app is only ~5MB.

        Hope you liked using this app 😉

        <div align="center" className="fw-bolder">Made with ❤️ by <a href="https://www.upf.edu/web/gti"> UPF-GTI</a> </div>
        `}</MD>
        </Modal>
    </>;
}
//<Button onClick={handleClick}>Install {import.meta.env.NAME}</Button>