import {useContext} from 'react'
import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams, useHistory, Redirect } from "react-router-dom"

import { AuthenticationContext } from 'utils/authentication';

import Nav from "partials/nav"
import Login  from 'views/login';
import Layout from 'partials/layout'
import Lobby  from 'views/lobby'
import Wizard from 'views/wizard'


function App({...props}) {
  
  const history = useHistory();
  const auth = useContext(AuthenticationContext);

  let buttons = <Nav.Button onClick={()=>alert("hey!")} label="Create room" appendclass="shadow rounded-circle bg-danger" >
            <i className="bi bi-plus-lg"></i>
        </Nav.Button>

  /*buttons = <Nav.Button label="Exit room" appendclass="shadow rounded-circle bg-danger">
      <i className="bi bi-telephone-x"></i>
  </Nav.Button>*/

  if(!auth?.isLogged)
    return <Layout className="App" children={<Login />}/>
  else
    return <>
    <Layout className="App">
      
      <Container id="content-wrapper">
      { history.location.pathname === '/'         && <Lobby/> }
      { history.location.pathname === '/settings' && <Wizard/> }
      { history.location.pathname === '/users'    && <Redirect to="/"/> }
      { history.location.pathname === '/chat'     && <Redirect to="/"/> }
      </Container>

      <Nav buttons={buttons}>
          <Nav.Item><i className="bi bi-house"/>Lobby</Nav.Item>
          <Nav.Item to="/settings"><i className="bi bi-magic"/>Settings</Nav.Item>
          <Nav.Item to="/users" disabled><i className="bi bi-people"/>Users</Nav.Item>
          <Nav.Item to="/chat" disabled><i className="bi bi-chat-dots"/>Chat</Nav.Item>
      </Nav>
 
    </Layout>
    <style global jsx>{`

      #content-wrapper{
        height: 100%;
        padding-bottom: 6rem;
        padding-top: 6rem;
        overflow-y: scroll;
        overflow-x: hidden;
      }

      @media only screen and (orientation: landscape) and (max-height: 671px) {           
          #content-wrapper{
            padding-bottom: 1rem;
            padding-top: 1rem;
            padding-right:3rem;
          }
      }
      @media only screen and (orientation: portrait){

      }    
    `}</style>
  </>
}

export default App;
