import { React } from 'react';
import Modal from '@/partials/modal'

export default ({show, setShow, ...props}) => {
    return <div id="modal_disconnected" {...props}>
        <Modal {...{show, setShow}}>
            <h1>This is a Modal</h1>
        </Modal>
    </div>;
}