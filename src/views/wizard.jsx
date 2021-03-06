import { useState, useEffect } from 'react'
import Gesture from 'rc-gesture'

export default ({show, setShow, ...props}) => {
    const pages = ["Devices","Battery", "Pose", "Environment"]; // , "Selfie"
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

    return <div>
        <Gesture
            onSwipeLeft={ () => setSelected( s => (s+1)%pages.length ) } 
            onSwipeRight={() => setSelected( s => (s-1 < 0)? pages.length-1 : s-1 ) }
            
        >

            <div>
                <ul className="nav nav-tabs justify-content-start mb-2">
                { pages.map( (v,k) => <li key={k} className="nav-item">
                        <div className={`nav-link ${selected === k?"active":""}`} onClick={()=>setSelected(k)}>{v}</div>  
                </li>)}
            </ul>

            {page}
            </div>

        </Gesture>
        <style global jsx>{`
            @import 'src/variables.scss';

            #wizard{
                .nav-tabs{
                    width: calc(100% + 24px);
                    margin-left: -12px;
                    margin-top: -3.6rem;
                    //margin-top: -1rem;

                    & .nav-item{
                        margin-right: 2px;
                    }

                    & .nav-link{
                        background-color: rgba(60, 60, 60, 0.75) !important;
                        color: white;
                        font-weight: 500;

                        &.active{
                            color: $color4 !important;
                            background-color: #fff !important;
                        }
                    }

                    
                }

                .modal-content{
                    margin-top: 1.5rem;
                    max-height: calc( 100 - 4rem );                
                }

                .modal-body {
                    padding-top: 63px;
                    overflow-y: scroll;
                }
            }    
        `}</style>
    </div>;
}