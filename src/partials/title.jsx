import {useContext} from 'react'
import {Image} from 'react-bootstrap'
import logo from "assets/img/logo.png"
import { RoomsContext } from 'utils/ctx_rooms'

export default () => {
    const rooms    = useContext(RoomsContext);

    return <>
        <div id="title" variant="none" className="d-flex m-3 position-absolute top-0 start-0 user-select-none">
            <Image className="me-2" width={32} height={32} src={logo} />
            <h1 id="app-name" className="fs-3">{process.env.REACT_APP_NAME}</h1>
            {rooms?.current && <h1 className="fs-3"> #{rooms?.current?.name}</h1>}
        </div>

        <style global jsx>{`
            @import "src/variables.scss";

            @media only screen and (orientation: portrait) {

                #app-name {
                    display: none;
                }
            }

        `}</style>

    </>
}