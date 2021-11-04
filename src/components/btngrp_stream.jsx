import { ButtonToolbar, Button } from 'react-bootstrap';

export default () => {
    return <ButtonToolbar>
       <Button><i className="bi bi-mic"></i></Button>
        <Button><i className="bi bi-camera-video"></i></Button>
    </ButtonToolbar>;
}