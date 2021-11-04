import { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

export default ({ ...props }) => {

    return <>
        <Row fluid id="Room" className="h-100 m-auto">
            <Col xs={12} className="bg-light shadow-lg rounded-bottom" style={{zIndex:1000}}>
            
            </Col>
        </Row>
    </>;
}

