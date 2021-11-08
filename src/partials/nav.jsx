import { useState, useEffect } from 'react'
import { NavLink, useHistory } from "react-router-dom"

function Nav({buttons, children}){
    const history = useHistory()
    const [active, setActive] = useState(0);
    let i = 0;
    
    function onKeyPressed(e)
    {
        const v = e.keyCode-49;
        
        if(v >= 0 && v < children.length && !children[v].props.disabled)
        {
            history.push(children[v].props.to ?? "/");
        }
    }

    useEffect(()=>{
        document.addEventListener("keydown", onKeyPressed)
    return ()=>{
        document.removeEventListener("keydown", onKeyPressed)
    }}, [])

    return <>
        <div className="nav-partial px-3 d-flex justify-content-evenly align-items-center position-absolute bottom-0 start-50 translate-middle-x mb-3 shadow rounded-5 bg-light" style={{ zIndex: 1100}}>
            {children.filter( (v,k,a) => k < a.length/2 ).map( (v,k,a) => { 
                const ret = <div id={k} key={k} onClick={ !v.props.disabled? (() => setActive(k)) : undefined }>{v}</div>
                ++i;
                return ret;
            })}
            {buttons && buttons}
            {children.filter( (v,k,a) => k >= a.length/2 ).map( (v,k,a) => { 
                const ret = <div id={k+i} key={k+i} onClick={ !v.props.disabled? (() => setActive(k+i)) : undefined }>{v}</div>
                return ret;
            })}
        </div>
        <style global jsx>{`
            @import "node_modules/bootstrap/scss/_functions.scss";
            @import "node_modules/bootstrap/scss/_variables.scss";
            @import "src/variables.scss";

            .rounded-5{
                border-radius: .5em;
            }
            .nav-partial{
                min-width: 1rem;
                min-height: 4rem;
                transition: all .2s ease-in-out;
            }
            .nav-button, .nav-item{
                color: $secondary;
                cursor: pointer;
                height: 100%;
                width: auto;
                user-select: none;

                &:hover{
                    color:  lighten($danger,29.5%);
                }
            }

            .nav-item-active{
                color: red !important;
            }

            .nav-item-disabled{
                color: lighten($btn-link-disabled-color,27.5%);
                user-select: none !important;
                pointer-events:none;
                cursor: not-allowed;
                &:hover{
                    color:  lighten($btn-link-disabled-color,27.5%);
                }
            }

            .nav-button i, .nav-item i{
                transform: scale(1.5);
                width:100%;
                padding:0;
                margin:0;
                user-select: none;
                text-transform: capitalize;
            }
            .nav-button{
                color: black !important;
                height: 4rem;
                width: 4rem;
                line-height: 3.5rem;
                margin-top: -1.5rem;
                margin-bottom: 1.5rem;
            }

            @media only screen and (orientation: landscape) and (max-height: 671px) {           
                .nav-partial{
                    flex-direction: column;
                    //top: 50%;
                    left: 100% !important;
                    transform: translate(-100%, 0%) !important;
                    margin-left: -1.1rem;
                    padding:1.251rem 0 !important;

                    .nav-button{
                        margin:0;
                        margin-left: -1.5rem;
                        margin-right: 1.5rem;
                    }
                }
            }
            @media only screen and (orientation: portrait){

            } 
        `}</style>
    </>
}


Nav.Item = function({children, icon, disabled, to, ...props}){
    return <div to={to??"/"} className={`nav-item ${disabled?"nav-item-disabled":""} ${props.appendclass??""}`} {...props}>
        <div className={`d-flex my-0 mx-2 flex-column fs-6 fw-lighter`} >{children}</div>
    </div>
}

Nav.Button = function({children,...props}){
    return <div className={`nav-button ${props.appendclass??""}`} {...props}>
        <div className=" pt-1 fs-1 fw-lighter">{children}</div>
    </div>
}

export default Nav;