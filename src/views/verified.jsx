import {Button} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import MD from 'utils/md';
import Modal from 'partials/modal'


export default ()=>{
    const history = useHistory();
    function onHide(){
        history.push('/') 
    }
    return <>
        <Modal size="md" show={true} 
            title={<h2 className="user-select-none">User verified!🎉</h2>}
            closeButton
            backdrop="static"
            onHide={ onHide }
            buttons={[<Button onClick={onHide} >Return to Login</Button>]}
        >
            <MD className="user-select-none">{`Account verified successfully in the system. You can now login on the application.`}</MD>
        </Modal> 
    </>
}