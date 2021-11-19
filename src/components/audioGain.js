import {useEffect, useRef, useState} from 'react';

let time = performance.now();
const microphone_gain_data = new Array(10);

export default function AudioGain({stream, show}) {
    const ref            = useRef();
    let   ctx            = useRef();
    let   analyser       = useRef();
    let   microphone     = useRef();
    let   javascriptNode = useRef();
    let   [vol, setVol]  = useState(0);
    
    window.ctx = ctx;
    useEffect(()=>{
        /*if(ctx){
            ctx.close();
            javascriptNode = undefined;
        }
        time = performance.now();*/
        ctx.current            = new AudioContext();
        analyser.current       = ctx.current?.createAnalyser();
        microphone.current     = ctx.current?.createMediaStreamSource(stream);
        javascriptNode.current = ctx.current?.createScriptProcessor(256, 1, 1);
      
        analyser.current.smoothingTimeConstant = 0.8;
        analyser.current.fftSize = 1024;
      
        microphone.current.connect(analyser.current);
        analyser.current.connect(javascriptNode.current);
        javascriptNode.current.connect(ctx.current?.destination);
        javascriptNode.current.onaudioprocess = onAudioProcess;
  
    }, [stream]);

    useEffect(()=>{
        if(!ctx) return;
        if(show) 
            ctx.current?.resume();
        else {
            ctx.current?.suspend();
            setVol(0);
        }

        return ()=>{
            ctx.current?.suspend();
        }
    }, [show]);

    function onAudioProcess(){
        if(performance.now() - time < 24 ) return;
        time = performance.now();

        var array = new Uint8Array(analyser.current?.frequencyBinCount);
        analyser.current?.getByteFrequencyData(array);
        const avg = array.reduce((a,b) => a + b, 0) / array.length;

        microphone_gain_data.shift();
        microphone_gain_data.push(Math.round(avg));
        window.microphone_gain_data = microphone_gain_data;

        //let v = .75;
        //console.log(avg);
        //setVol(a => Math.round(a * (1-v) + avg * v));
        setVol(avg);

    }


    return <>
        <div className="pids-wrapper" ref={ref}>{
            Array.from({length:10},(v,i)=>{
                return <div key={i} className={`pid`} style={{background:  (i*10)<vol? '#69ce2b':'#e6e7e8'}}></div>
            })
        }
        </div>
        <style global jsx>{`
            .pids-wrapper{
                width: 100%;
                line-height: 1.5rem;
            }
            .pid{
                width: calc(10% - 2px);
                height: 10px;
                display: inline-block;
                margin: 1px;
            }
        `}</style>
    </>;
}