import React, {useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'partials/modal'
import MD from 'utils/md';
import { AuthenticationContext } from 'utils/authentication';

export default () => {
    const [show, setShow] = useState(false);
    const auth = useContext(AuthenticationContext);
    const user = "h3R"

    if(!auth.isLogged) return <></>;
    return <>
        <Button variant="link" onClick={ ()=>setShow(1) }>Profile</Button>
        <Modal closeButton size="lg" {...{show, setShow}} title={<h2 className="user-select-none">{user}</h2>}>
        <MD className="user-select-none">{`
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

        <Button onClick={auth.logout}><i className="bi bi-power"></i> Log me out</Button>
        </Modal>
    </>;
}