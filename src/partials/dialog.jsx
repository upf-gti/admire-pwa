import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default ({show, title, children, ...props}) => {
    return <>
        <Modal show={show} {...props}>
            
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            {children}
            </Modal.Body>

        </Modal>

        <style global jsx>{`
            @import 'src/variables.scss';

            .modal-partial {
                .modal-title {
                    font-weight: lighter;
                    font-family: $header-font;

                    h1,h2,h3,h4,h5,h6 {padding:0; margin:0}
                }

                .modal-header{
                    padding-bottom: .2em;
                }
            }
            
        `}</style>
    </>;
}