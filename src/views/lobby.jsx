import {useHistory} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'

function RoomTile({id, name, ...props}){
    

    return <div>
    
        <Card className="bg-dark text-light" {...props}>
            <Card.Img variant="top" src={`https://unsplash.it/160/100?image=${Math.floor(Math.random() * 40)}`} />
            <Card.Body>
            <Card.Title>#{name}</Card.Title>
            {/*<Card.Text></Card.Text>*/}
            </Card.Body>
        </Card>

        <style global jsx>{`
            @import 'src/variables.scss';

            .card {
                cursor: pointer;
                user-select: none;
                transition: all 0.075s ease-in-out;

                &:hover {
                    .card-body{
                        background: lighten($dark,25%);
                    }
                        
                    box-shadow: 0 0 0px 2px rgba(255, 255, 255, .5) !important;
                }

                .card-body{
                    transition: all 0.075s ease-in-out;
                    .card-title{
                        margin:0;
                    }
                }
            }
        `}</style>
    </div>
}


export default ()=>{
    const history = useHistory();
    
    return <>
        <Row fluid id="Room" className="h-100 m-auto">
            <Col xs={12} sm={{span:10, offset:1}} >
        
            <h1 className="text-light">Lobby</h1>    
            <Row xs={2} sm={4} lg={4} xl={5} className="g-4">
            {Array.from({ length: 9 }).map((_, idx) => (
                <Col key={idx}>
                    <RoomTile name={`Room ${idx}`} onClick={()=>history.push(`/room/${idx}`)}/>
                </Col>
            ))}
            </Row>

            </Col>
        </Row>
    </>
}