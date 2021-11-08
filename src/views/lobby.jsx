import { useContext } from 'react'
import {useHistory} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import { RoomsContext } from 'utils/ctx_rooms'


function RoomTile({id, name, ...props}){
    return <div>
    
        <Card className="bg-dark text-light" {...props}>
            <Card.Img variant="top" src={`https://unsplash.it/seed/test/160/100`} />
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
                        font-size: 1rem;
                        white-space: nowrap;
                    }
                }
            }
        `}</style>
    </div>
}


export default ()=>{
    const history = useHistory();
    const rooms = useContext(RoomsContext);
    
    return <>
        <Row id="lobby" className="h-100 m-auto">
            <Col xs={12} sm={{span:10, offset:1}} >
        
            <h1 className="text-light">Lobby</h1>    
            <Row xs={2} sm={4} lg={4} xl={5} className="g-4">
            { Object.values(rooms.list).map((v,k) => <Col key={k}>
                    <RoomTile name={` ${v?.id || 'Room '+k}`} onClick={()=>history.push(`/room/${v?.id}`)}/>
                </Col>
            )}
            </Row>

            </Col>
        </Row>
        <style global jsx>{`
            #lobby{
                min-height: 19rem;
            }    
        `}</style>
    </>
}