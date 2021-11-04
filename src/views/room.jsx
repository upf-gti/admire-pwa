import { React } from 'react';
import { Row, Col } from 'react-bootstrap';
import MD from 'utils/md'

export default ({ ...props }) => {
    return <>
        <Row id="room" className="h-100 m-auto">
            <Col xs={12} sm={{span:6, offset:3}} className="bg-light rounded-2"><MD >{`
                # Hola Caracola            
            `}</MD>
            </Col>
        </Row>
    </>;
}