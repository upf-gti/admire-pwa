import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import App from 'views/App'
import Verified from 'views/verified'
import ResetPass from 'views/resetpassword'

export default ({children})=> <>
    <Router basename={process.env.REACT_APP_BASE}>
    <Switch>
        <Route component={App}       exact path={["/", "/settings", "/about", "/users", "/chat", "/profile", "/room/:roomId", "/room/:roomId/chat", "/room/:roomId/guests"]} />
        <Route component={Verified}  exact path="/verified/:token"/>
        <Route component={ResetPass} exact path="/reset-password/:token"/>
        <Route> <Redirect to='/'/> </Route>
    </Switch>
    </Router>
</>