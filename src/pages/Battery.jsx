import { useState, useRef, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import MD from 'utils/md'
import { default as BatteryIcon } from 'components/battery'

export default function Battery() {
    const [state, setState] = useState(0);
    const battery = useRef({level:0,charging:false, chargingTime:0, dischargingTime:0});
    
    useEffect(() => {
        const id = setInterval(async () => {
            navigator.getBattery().then(b => { //charging:true/false //chargingTime //dischargingTime //level 
                battery.current = b;
                setState(s => ++s);
            })
        }, 500);
        return () => {
            clearInterval(id);
        }
    }, []);

    //message explaining the importance of having enough battery charge for the streaming
    //The battery level is ${(battery.current.level*100).toFixed(0)}%. If you want to stream this video, you need at least 25% of the battery charge.
    const message = `
    While streaming, the battery charge will drop fast. If the battery is low, the performance will be affected and the stream may stop.
    * ${battery.level < 0.25 ? '❌ You need at least 25% of the battery charge to stream video.' : '✔️ You can stream video.'}
    `;

    return <div id="battery">
        <h3 className="pt-2"><b>Battery Level</b></h3>
        <Row>
            <Col md={4}>
                <BatteryIcon />
            </Col>
            <Col md={8}>
                <MD className="pt-3 user-select-none">{message}</MD>
            </Col>
        </Row>
        <style global jsx>{`
            @media only screen and (orientation: landscape) and (max-height: 671px) {           
                #battery .row{
                    flex-direction: row !important;
                    .col{
                        align-self: start;
                    }
                }
            }  
        `}</style>
        
    </div>
}