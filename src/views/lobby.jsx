import {Row, Col, Card} from 'react-bootstrap';


export default ()=>{
    return <>
        <h1>Lobby</h1>    
        <Row xs={2} md={3} lg={4} xl={5} className="g-4">
        {Array.from({ length: 6 }).map((_, idx) => (
            <Col key={idx}>
            <Card className="bg-dark text-light">
                <Card.Img variant="top" src={`https://unsplash.it/160/100?image=${Math.floor(Math.random() * 255)}`} />
                <Card.Body>
                <Card.Title>#Room {idx}</Card.Title>
                <Card.Text>
                   
                </Card.Text>
                </Card.Body>
            </Card>
            </Col>
        ))}
        </Row>
    </>
}