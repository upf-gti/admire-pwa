import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default ({title, children, show, setShow, callback, buttons, closeButton, ...props}) => {
    return <>
        <Modal
            centered
            show={show}
            keyboard={true}
            //backdrop={closeButton?"":"static"}
            onHide={() => setShow(false)}
            dialogClassName="modal-partial modal-shadow-lg"
            {...props}
        >
            {(closeButton && title) && <Modal.Header closeButton={closeButton} >
                <Modal.Title className="user-select-none">{title}</Modal.Title>
            </Modal.Header>}
            
            <Modal.Body>
                {children}
            </Modal.Body>

            { (buttons || closeButton) && <Modal.Footer className="flex-nowrap">
                {buttons && buttons.map( (v,k,a) => v )}
                {closeButton && <Button variant="outline-secondary" onClick={() => setShow(false)}> Close</Button>}
            </Modal.Footer>} 
        </Modal>

        <style global jsx>{`
            @import 'src/variables.scss';

            .modal-dialog{
                max-height: calc(100vh - 1rem);
            }
            .modal-partial.modal-shadow-lg.modal-md.modal-dialog-centered:focus-visible {
                outline: none;
            }

            .modal-partial {
                .modal-title {
                    font-weight: lighter;
                    font-family: $header-font;

                    h1,h2,h3,h4,h5,h6 {padding:0; margin:0}
                }

                .modal-header{
                    padding-bottom: .2em;
                }

                .modal-footer{
                    padding: 0 0.75rem;
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
                .modal-content{
                    //max-width: 38rem !important;
                    //margin-right: 6.5rem !important;
                }
                .modal-md{
                    max-width: 800px !important;
                }
                  /* Tablet Devices, Desktop and Laptop Screens */
                @media only screen and (max-width: 674px) {
                    .modal-dialog{
                    //max-width: 38rem !important;
                    margin-right: 6.5rem !important;
                }
                }
            }
            @media only screen and (orientation: portrait){

            }      
        `}</style>
    </>;
}