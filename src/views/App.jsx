import { useContext, useRef, useEffect } from 'react'
import { Container } from "react-bootstrap"
import { useHistory, Redirect } from "react-router-dom"
import { AuthContext } from 'utils/ctx_authentication';
import { RoomsContext } from 'utils/ctx_rooms'


import Nav from "partials/nav"
import Room  from 'views/room'
import Login  from 'views/login'
import Lobby  from 'views/lobby'
import Wizard from 'views/wizard'
import CreateRoomModal from 'components/modal_create_room'
import LeaveRoomModal from 'components/modal_leave_room'
import WizardModal from 'components/modal_wizard'
import UsersModal from 'components/modal_users'
import ChatModal from 'components/modal_chat'
import StreamButtons from 'components/btngrp_stream';


function App({...props}) {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const rooms = useContext(RoomsContext);
  let {current: view} = useRef();

  if((/^\/room\/[a-zA-Z0-9]+/).test(history.location.pathname)) view = <Room container/>
  if(history.location.pathname === '/'        ) view = <Lobby container/> 
  if(history.location.pathname === '/settings') view = <Wizard show={true} container/>
  if((/^\/room\/[a-zA-Z0-9]+\/chat$/).test(history.location.pathname)  ) view = <Redirect to="/"/>
  if((/^\/room\/[a-zA-Z0-9]+\/users$/).test(history.location.pathname) ) view = <Redirect to="/"/>

  if(!auth?.isLogged)
    return <div className="App" children={<Login />}/>
  else
    return <>
    <div className="App">
        
      <Container fluid={view?.props?.container} id="content-wrapper" > 
      {view}
      </Container>

      <Nav buttons={rooms.current?<StreamButtons/>:<CreateRoomModal/>}>
          {rooms.current? <LeaveRoomModal/>
                        : <Nav.Item><i className="bi bi-house"/>Lobby</Nav.Item>}
          <WizardModal/>
          <UsersModal/>
          <ChatModal/>
      </Nav>
 
    </div>
    <style global jsx>{`
      
      html, body, .App{
        overflow: hidden;
        min-height:330px;
      }

      #content-wrapper{
        height: 100%;
        margin-bottom: 6rem;
        margin-top: 3.5rem;
        overflow-y: scroll;
        overflow-x: hidden;
        & .container-fluid{
          margin:0 !important;
        }
      }

      @media only screen and (orientation: landscape) and (max-height: 671px) {           
          #content-wrapper{
            margin-bottom: 1rem;
            margin-top: 1rem;
            margin-right:3rem;
          }
      }
      @media only screen and (orientation: portrait){

      }    
    `}</style>
  </>
}

export default App;
