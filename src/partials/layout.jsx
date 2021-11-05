import { Helmet } from "react-helmet"
import { Image } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'

import AboutModal from 'components/modal_about'
import ProfileModal from 'components/modal_profile'
import FullScreenBTN from 'components/btn_fullscreen'

import logo from "assets/img/logo.png"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'style.scss'

window.toast = toast;
export default ({ children, ...props }) => {
  return <div id="layout" {...props}>

    <Helmet>
      <title>{process.env.REACT_APP_NAME}</title>
      <title>{props.title}</title>
      <meta property="og:url" content={process.env.REACT_APP_OG_URL} />
      <meta property="og:type" content={process.env.REACT_APP_OG_TYPE} />
      <meta property="og:title" content={process.env.REACT_APP_OG_TITLE} />
      <meta property="og:description" content={process.env.REACT_APP_OG_DESC} />
      <meta property="og:image" content={process.envREACT_APP_OG_IMAGE} />
    </Helmet>
    <Toaster
      id="toaster"
      position="bottom-right"
      reverseOrder={true}
      toastOptions={{
        duration: 2000,
      }}
    />


    <div id="title" variant="none" className="d-flex m-3 position-absolute top-0 start-0 user-select-none">
      <Image className="me-2" width={32} height={32} src={logo} />
      <h1 className="fs-3">{process.env.REACT_APP_NAME}</h1>
    </div>

    <div className="z-top d-flex m-2 position-absolute top-0 end-0">
      <ProfileModal />
      <AboutModal />
      <FullScreenBTN />
    </div>

    {children}

    <style global jsx>{`
      @import "src/variables.scss";

      #layout {
        height:100vh;
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