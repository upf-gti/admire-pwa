import { useState, useRef, useEffect } from 'react'

export default function Battery(){
    const battery = useRef({level:0,charging:false, chargingTime:0, dischargingTime:0});
    const [state, setState] = useState(0);
    const [percentage, setPercentage] = useState(0);

    function lerp(a, b, n){
        return (1 - n) * a + n * b;
    }

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

    useEffect(() => {
        const id = setInterval(() => {
            setPercentage(Math.ceil(lerp(percentage, battery.current.level * 100, .5 * 0.32)));
        }, 30);
        return () => {
            clearInterval(id);
        }
    })

    return <>
    <div id="battery" className="text-center">
        <div className="battery-shape">
            <div className="level">
                <div className="percentage" style={{width:`${battery.current?.level * 100}%`}}></div>
            </div>
        </div>
           <span>{percentage}%</span>{battery.current?.charging ? '⚡' : ''}
           <span>{
           (battery.current?.charging)
           ? `(full in: ${battery.current?.chargingTime})` 
           : `(empty in: ${battery.current?.dischargingTime})`
           }</span>
    </div>
    <style global jsx>{`
            @import "src/variables.scss";

            .battery-shape{
                position: relative;
                min-width: 140px;
                min-height: 65px;
                border: 3px solid #333;
                margin: 20px 0;
                border-radius:10px;
                .dark > & {
                    border-color: #fff;
                }

                &::before{
                    content: "";
                    position: absolute;
                    top: 50%;
                    right: -12px;
                    transform: translateY(-50%);
                    width: 7px;
                    height:16px;
                    background: #333;
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;

                    .dark > & {
                        background: #fff;
                    }
                }

                &::after{
                    content: "";
                    position: absolute;
                    top:0;
                    left: 0;
                    width: 100%;
                    height:50%;
                    background: rgba(255,255,255,.1);
                }

                .level{
                    position: absolute;
                    top: 4px;  
                    left: 4px;
                    right: 4px;
                    bottom: 4px;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .percentage{
                    transition: width 1s cubic-bezier(0.5, 0.28, 0, 1.04);
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 50%;
                    background: linear-gradient(90deg, $color3, lighten($color4,10%));
                    border-radius: 4px;
                    
                    .dark > & {
                        background: linear-gradient(90deg, lighten($color4,10%), $color3);
                    }
                }
            }

            .percent{
                color: $color4;
                font-size: 2em;
                font-weight: 600;
            }
            
        `}</style>
    </>
}

/*
               {battery.current && JSON.stringify({
                    charging: battery.current.charging
                    , level: battery.current.level
                    , chargingTime: battery.current.chargingTime
                    , dischargingTime: battery.current.dischargingTime
                }, 0, 2)}
*/