function Nav({children}){

    return <>

        <div className="nav-partial px-3 mb-1 d-flex justify-content-evenly align-items-center position-absolute start-50 translate-middle-x shadow rounded-5 bg-light" style={{ zIndex: 1000}}>
            { children.map( (v,k) => v && <div key={'nav-i-'+k}>{v}</div>) }
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
                min-height: 1rem;
                transition: all .2s ease-in-out;
                bottom: 15px !important;
            }
            .nav-button, .nav-item{
                color: $secondary;
                cursor: pointer;
                height: 100%;
                width: auto;
                user-select: none;
                transition: all .2s ease-in-out;

                & i{
                    transform: scale(1.5);
                    width: 50px;
                    overflow: hidden;
                    padding:0;
                    margin:0;
                    user-select: none;
                    text-transform: capitalize;

                }
                &:hover{
                    color:  lighten($danger,15%);
                }
            }

            .nav-item{
                height: 44px;
            }

            .nav-item-active{
                color: red !important;
            }

            .nav-item-disabled{
                opacity: .35;
                user-select: none !important;
                pointer-events:none;
                cursor: not-allowed;
                &:hover{
                    opacity: .35;
                }
            }


            .nav-button{
                color: black !important;
                height: 3.5rem;
                width: 3.5rem;
                line-height: 3rem;
                margin-top: -1.5rem;
                margin-bottom: 1.5rem;

                &:hover{
                    color:  lighten($danger,50%) !important;
                }
            }

            .dark-mode{
                &.navpartial, .nav-partial{
                    background-color: transparent !important;
                    border: 1px solid rgba(255,255,255, .25);

                    .nav-item{
                        color: invert($secondary,50%);
                        &:hover{
                            color:  lighten($danger,15%);
                            filter: saturate(120%) drop-shadow(0 0 .1rem $danger);
                        }
                    }

                    .nav-button{
                        filter: saturate(80%);
                        background: $color1 !important;
                        line-height: 2.8rem;
                        border: 2px solid $danger;
                        color: $danger !important;

                        &:hover{
                            filter: saturate(120%) drop-shadow(0 0 .1rem $danger);
                            color:  $danger !important;
                            border: 2px solid $danger;
                        }
                    }
                }
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
        <div className={`d-flex flex-column fs-6 fw-lighter`} >{children}</div>
    </div>
}

Nav.Button = function({children,...props}){
    return <div className={`nav-button ${props.appendclass??""}`} {...props}>
        <div className=" pt-1 fs-1 fw-lighter">{children}</div>
    </div>
}

export default Nav;