import { useContext, useEffect, useState } from "react"
import { Row, Col, Card, Spinner } from 'react-bootstrap'
import { MediaContext } from 'utils/ctx_mediadevices'
import { VideoAnalyzer } from 'lib_bra/videoAnalyzer'

import Video from 'partials/video'

const videoAnalyzer = new VideoAnalyzer();
let analyzing = false;

export default ()=>{

    const media = useContext(MediaContext);
    const [test, setTest] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(()=>{
        
        media.init();
        const interval = beginVideoAnalysis();
        
        return () => {

            media.stop();
            setTest(false);
            clearInterval( interval );
        }
    
    }, []);

    function beginVideoAnalysis() {

        return setInterval(() => {

            setAnalyzing(true);
            const video = document.querySelector('.analysedVideo');
            const data = videoAnalyzer.analyze( video.querySelector("video") );
            document.getElementById('brightnessText').innerHTML = Math.floor(data.brightness * 100) + '%';
            document.getElementById('contrastText').innerHTML = Math.floor(data.contrast * 100) + '%';

            setTimeout(() => setAnalyzing(false), 750);

        }, 2000);
    }

    return <div id='devices'>

        <h3 className="pt-2"><b>Environment</b></h3>
        <Row id='devices-row'>

            <Col md={6}>
                <Video id="local" stream={media.localStream} isLocal={!test} className={ 'analysedVideo' }/>
            </Col>

            <Col md={6}>

                <h4 className="pt-2">Lighting conditions { analyzing ? <Spinner style={{ verticalAlign: '-0.02em', color: 'lightskyblue' }} animation="grow" size="sm" /> : <></> }</h4>
                <Card style={{ width: '18rem', marginTop: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title><i className="bi bi-sm bi-brightness-high"></i>  Brightness</Card.Title>
                        <Card.Text id='brightnessText'>
                        -
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem', marginTop: '0.25rem' }}>
                    <Card.Body>
                        <Card.Title><i className="bi bi-sm bi-diamond-half"></i>  Contrast </Card.Title>
                        <Card.Text id='contrastText'>
                        -
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        <style global jsx>{`
   
            .bi.bi-sm{
                font-size: 1rem;
                vertical-align: 0.07rem;
            }

            #page video {
                object-fit: cover !important;
                max-height: 25vh;
            }

            #devices-row{
                overflow-y: scroll;
            }

            @media only screen and (orientation: landscape) and (max-height: 671px) {           
                #devices .row{
                    flex-direction: row !important;
                    .col{
                        align-self: start;
                    }
                }
            }  
        `}</style>
    </div>
}