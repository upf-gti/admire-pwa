import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Card, Badge } from 'react-bootstrap'
import { RoomsContext } from 'utils/ctx_rooms'
import lock from 'assets/img/TeenyiconsPasswordOutline.svg'
import RoomPasswordModal from 'components/modal_room_password'

function RoomTile({id, name,icon, hidden, master, users, secured : hasPassword, ...props}){
    const [show, setShow] = useState(false);
    const rooms = useContext(RoomsContext);

    function onClick(){
        
        // Password modal is open ...
        if(show)
        return;

        if(hasPassword){
            setShow(true);
        }
        else
            enterRoom();
    }
    function enterRoom(password){
        return rooms.joinRoom(name, password)
    }

    if(hidden){
        return <></>
    }

    // window.setShow = setShow;
    return <div onClick={onClick}>
    
        <Card className="bg-dark text-light" {...props}>
            <Card.Img variant="top" src={icon} />
            {hasPassword && <Badge style={{padding:".44em .25em .44em .45em", margin:".25rem"}} bg="white" className="position-absolute end-0 top-0" pill><img width="18" src={lock} style={{filter:"invert(.5)"}}/></Badge>}
            <Card.Body>
                <Card.Title>#{name}</Card.Title>
            </Card.Body>
        </Card>
        <RoomPasswordModal 
            show = { show }
            setShow = { setShow } 
            onSubmit = { enterRoom }
        />

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
                    overflow-x: hidden;
                    .card-title{
                        margin:0;
                        font-size: 0.9rem;
                        white-space: nowrap;
                       transition: 2s;
                    }

                    .card-title:hover {
                       margin-left: -25px;
                    }
                }

                .card-img-top{
                    width: 100%;
                    height: 100px;
                    object-fit: cover;
                }
            }
        `}</style>
    </div>
}

function onKeyPress(){
}

export default ()=>{
    
    const history = useHistory();
    const rooms = useContext(RoomsContext);

    useEffect( ()=>{

    }, [rooms.list])

    return <>
        <Row onKeyPress={onKeyPress} id="lobby" className="h-100 m-auto">
            <Col xs={12} sm={{span:10, offset:1}} >
        
            <h1 className="text-light lobby-title">Lobby</h1>    
            <Row xs={2} sm={3} lg={3} xl={5} className="g-3">
            { [...Object.values(rooms.list)].map((v,k) => <Col key={k}>
                    <RoomTile /*name={` ${v?.name || 'Room '+k}`}*/ {...v} />
                </Col>
            )}
            </Row>

            </Col>
        </Row>
        <style global jsx>{`
            #lobby{
                min-height: 19rem;
                height: calc(100vh - 3rem) !important;
                overflow-y: scroll !important;
                padding-bottom: 4rem !important;

                .lobby-title{
                    margin-bottom: 20px;
                }
            }    
        `}</style>
    </>
}