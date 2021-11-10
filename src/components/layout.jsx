import { Helmet } from "react-helmet"
import { Image } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"

import App from 'views/App'
import Verified from 'views/verified'
import ResetPass from 'views/resetpassword'
import AboutModal from 'components/modal_about'
import ProfileModal from 'components/modal_profile'
import FullScreenBTN from 'components/btn_fullscreen'
import Title from 'partials/title'

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'style.scss'

import RoomsContext  from 'utils/ctx_rooms'
import StreamContext from 'utils/ctx_streaming'
import MediaContext from 'utils/ctx_mediadevices'
import AuthContext  from 'utils/ctx_authentication'

window.toast = toast;
export default ({ children, ...props }) => {
  return <div id="layout" className="dark-mode" {...props}>
    <Toaster
      id="toaster"
      position="bottom-right"
      reverseOrder={true}
      toastOptions={{
        duration: 2000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
    <Router basename={process.env.REACT_APP_BASE}>
    <AuthContext>
    <RoomsContext>
    <MediaContext>
    <StreamContext>
    
    <Helmet>
      <title>{process.env.REACT_APP_NAME}</title>
      <title>{props.title}</title>
      <meta property="og:url" content={process.env.REACT_APP_OG_URL} />
      <meta property="og:type" content={process.env.REACT_APP_OG_TYPE} />
      <meta property="og:title" content={process.env.REACT_APP_OG_TITLE} />
      <meta property="og:description" content={process.env.REACT_APP_OG_DESC} />
      <meta property="og:image" content={process.envREACT_APP_OG_IMAGE} />
    </Helmet>

    <Title/>

    <div className="z-top d-flex m-2 position-absolute top-0 end-0">
      <ProfileModal />
      <AboutModal />
      <FullScreenBTN />
    </div>

    <Switch>
        <Route component={App}       exact path={["/", "/settings", "/about", "/users", "/chat", "/profile", "/room/:roomId", "/room/:roomId/chat", "/room/:roomId/guests"]} />
        <Route component={Verified}  exact path="/verified/:token"/>
        <Route component={ResetPass} exact path="/reset-password/:token"/>
        <Route> <Redirect to='/'/> </Route>
    </Switch>
    
    </StreamContext>
    </MediaContext>
    </RoomsContext>
    </AuthContext>
    </Router>

    <style global jsx>{`
      @import "src/variables.scss";

      #layout {
        text-align:center;
        background:$background;
      }  

      #title {
        color:$text;
        filter: invert(.5) brightness(0.5);
        mix-blend-mode: luminosity;
      }

      .z-top{
        z-index:1000;
      }
      
    `}</style>
  </div>
}