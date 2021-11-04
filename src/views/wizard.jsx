import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import MD from 'utils/md'
import Gesture from 'rc-gesture';
import { findByDisplayValue } from '.pnpm/@testing-library+dom@8.10.1/node_modules/@testing-library/dom';

export default ({ ...props }) => {
    const pages = ["p1", "p2", "p3"];
    const [selected, setSelected] = useState(0);
    const [page, setPage] = useState(null);
    const [views, setViews] = useState([]);

    //use useEffect to fetch page views dynamically
    useEffect(() => {
        (async () => {
            let vs = [];
            for (let p of pages)
                await import(`pages/${p}.jsx`).then(v => vs.push(<v.default />))
            setViews([...vs]);
            setPage(vs[selected]);
        })();
    }, []);

    useEffect(() => {
        setPage(views[selected]);
    }, [selected]);

    function onKeyPressed(e)
    {
        switch(e?.keyCode)
        {
            case 37: return setSelected( s => (s-1 < 0)? pages.length-1 : s-1 );
            case 39: return setSelected( s => (s+1)%pages.length );
        }
    }

    useEffect(()=>{
            document.addEventListener("keydown", onKeyPressed)
        return ()=>{
            document.removeEventListener("keydown", onKeyPressed)
        }
    }, [])

    return <>
    <Gesture
        onSwipeLeft={ () => setSelected( s => (s+1)%pages.length ) } 
        onSwipeRight={() => setSelected( s => (s-1 < 0)? pages.length-1 : s-1 ) }
        
    >
        <Row id="wizard" className="pt-5 h-100 m-auto">
            <Col sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }} className="pt-3 bg-light shadow-lg rounded-bottom" style={{zIndex:1000}}>
            <ul className="nav nav-tabs justify-content-start mb-2" style={{ width: "calc(100% + 24px)",marginLeft: "-12px",marginTop: "-3.6rem"}}>
                { pages.map( (v,k) => <li key={k} className="nav-item">
                        <div className={`nav-link ${selected === k?"active":""}`} onClick={()=>setSelected(k)}>{v}</div>  
                </li>)}
            </ul>

            {page}

            </Col>
        </Row>
    </Gesture>
    </>;
}

//xs={12} md={{span:6, offset:3}} lg={{span:8, offset:2}}