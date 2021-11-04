import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default ({title, children, show, setShow = ()=>{}, callback, button_tittle, closeButton, ...props}) => {
    return <>
        <Modal
            centered
            show={show}
            keyboard={true}
            backdrop="static"
            onHide={() => setShow(false)}
            dialogClassName="modal-partial modal-shadow-lg"
            {...props}
        >
            <Modal.Header closeButton={closeButton} >
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {children}
            </Modal.Body>

            { (button_tittle || closeButton) && <Modal.Footer>
                {button_tittle && <Button variant="primary" onClick={callback}>{button_tittle}</Button>}
                {closeButton && <Button variant="outline-secondary" onClick={() => setShow(false)}> Close</Button>}
            </Modal.Footer>} 
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
            

            /* -----------------------------------------
                Wearables
            ----------------------------------------- */

            /* ----------- Moto 360 Watch ----------- */
            @media (max-device-width: 218px)and (max-device-height: 281px) { 

            }

            /* ----------- Non-Retina Screens ----------- */
            @media screen 
            and (min-device-width: 1200px) 
            and (max-device-width: 1600px) 
            and (-webkit-min-device-pixel-ratio: 1) { 
            }

            /* ----------- Retina Screens ----------- */
            @media screen 
            and (min-device-width: 1200px) 
            and (max-device-width: 1600px) 
            and (-webkit-min-device-pixel-ratio: 2)
            and (min-resolution: 192dpi) { 
            }

            /* Smartphones (landscape) ———– */
            @media only screen
            and (min-width : 321px) {
            /* Styles */
            }

            /* Large Desktop and Laptop Screens (devices and browsers) */
            @media only screen and (min-width: 1824px) {}

            /* Tablet Devices, Desktop and Laptop Screens */
            @media only screen and (max-width: 768px) {}

            /* iPads (portrait and landscape) */
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {}

            /* Smartphones (portrait and landscape) */
            @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {}

            /* iPhone 4 */
            @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-device-pixel-ratio: 1.5) {}


            @media only screen and (orientation: landscape) and (max-height: 671px) {
                .modal-dialog{
                    max-width: 38rem !important;
                }
            }
            @media only screen and (orientation: portrait){

            }      
        `}</style>
    </>;
}