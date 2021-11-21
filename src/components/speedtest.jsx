import {useEffect, useState} from 'react';
import speedTest from 'speedtest-net';

export default function SpeedTest(){

    const [speed, setSpeed] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        (async () => {
            try {
              console.log(await speedTest({maxTime: 5000}));
            } catch (err) {
              console.log(err.message);
            }
        })();

        setTimeout(()=>setLoading(false), 1000);
    },[]);

    return <></>
}