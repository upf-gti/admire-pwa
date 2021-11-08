import http from "utils/http"
import * as BRA from "lib_bra";
import cookies from '@h3r/cookies'
import toast from 'react-hot-toast'
import { useHistory, useParams  } from 'react-router-dom'
import { createContext, useEffect, useState, useRef } from 'react'
import { Spinner } from 'react-bootstrap'

import Dialog from 'partials/dialog.jsx'
export const AuthContext = createContext()

export default ({children, ...props}) => {
    const history                       = useHistory();
    const { current: action }           = useParams(null);
    const [ isAdmin,     setAdmin     ] = useState(false);
    const [ isLogged,    setLogged    ] = useState(false);
    const [ isConnected, setConnected ] = useState({app:false, rtc:false});
    const [ user,        setUser      ] = useState(null);
    const [ avatar,      setAvatar    ] = useState(null);
    let   {current: toast_app}          = useRef(null);
    let   {current: toast_rtc}          = useRef(null);

    const store = window.auth = {
         user       
        ,avatar     
        ,isAdmin    
        ,isConnected: isConnected.app && isConnected.rtc
        ,isLogged
        ,login
        ,logout
    }

    async function login(email, password){
        const toastId = toast.loading('Logging in...');
        email = email.toLowerCase();
        return http.post(`${process.env.REACT_APP_API_URL}/auth/basic`, { email, password })
        .then(response => {
            switch (response.status) {
                case 404: toast.error(`Error ${response.error}: ${response.message}`, { id: toastId }); break;
                default:  toast.success('Success', { id: toastId });
                    BRA.appClient.login(response.access_token);
                    return response.access_token;
            }
        })
        .catch(err => toast.error(`Error catch: ${err}`, { id: toastId }));
    }

    async function logout(){
        cookies.set("admire_app_email",null,-1);
        cookies.set("admire_app_token",null,-1);
        return await BRA.appClient.logout();
    }

    function onLogin({ status, userId, userType, description, roomInfo }) {
        switch (status) {
            case 'ok': toast.success(`Logged in as '${userId}'`);
                setUser(userId);
                setAdmin(userType ?? true);
                setLogged(true);
                BRA.rtcClient.register(userId);
                if(roomInfo){
                    return history.push(`/room/${roomInfo.id}`);
                }
                break;

            case 'error': 
                toast.error(description); 
                cookies.set("admire_app_token",null,-1);
                break;
            default: toast.warn(description);
        }
    }

    function onLogOut(){
        setLogged(false);
        toast.success('Logged out');
        BRA.rtcClient.unregister();
    }

    useEffect( ()=>{

        function onUnload(){
            window.removeEventListener('unload', onUnload);
            BRA.rtcClient.disconnect();
            BRA.appClient.disconnect(); 
        }
        window.addEventListener('unload', onUnload);

        let onAppConnect, onAppDisconnect, onRtcConnect, onRtcDisconnect;
        BRA.appClient.on('client_connected',      onAppConnect      = () => { toast("App Connected",    {id:toast_app, icon:'⚡', duration:2000}); setConnected( v => ({...v, app:true })); });
        BRA.rtcClient.on('client_connected',      onRtcConnect      = () => { toast("RTC Connected",    {id:toast_rtc, icon:'⚡', duration:2000}); setConnected( v => ({...v, rtc:true })); });
        BRA.appClient.on('client_disconnected',   onAppDisconnect   = () => { toast("App Disconnected", {id:toast_app, icon:'⚠️', duration:2000}); setConnected( v => ({...v, app:false})); });
        BRA.rtcClient.on('client_disconnected',   onRtcDisconnect   = () => { toast("RTC Disconnected", {id:toast_rtc, icon:'⚠️', duration:2000}); setConnected( v => ({...v, rtc:false})); });
        BRA.appClient.on("login_response",        onLogin);
        BRA.appClient.on("logout_response",       onLogOut);

    return ()=>{
        BRA.appClient.off('client_connected',     onAppConnect      );
        BRA.appClient.off('client_disconnected',  onAppDisconnect   );
        BRA.rtcClient.off('client_connected',     onRtcConnect      );
        BRA.rtcClient.off('client_disconnected',  onRtcDisconnect   );
        BRA.appClient.off("login_response",       onLogin);
        BRA.appClient.off("logout_response",      onLogOut);

        onUnload();
    }
    }, []);


    useEffect( ()=>{
        if(!isConnected.app){
            toast_app = toast.loading(`Connecting lobby server`,{duration:Infinity}); //This may never disappear if no response is given from the server
            BRA.appClient.connect(process.env.REACT_APP_APP_URL);
        }
    }, [isConnected.app])

    useEffect( ()=>{
        if(!isConnected.rtc){
            toast_rtc = toast.loading(`Connecting rtc server`,{duration:Infinity}); //This may never disappear if no response is given from the server
            BRA.rtcClient.connect(process.env.REACT_APP_RTC_URL);
        }
    }, [isConnected.rtc])

    useEffect( ()=>{
        if(isConnected.app && isConnected.rtc && !isLogged)
        {
            const token = cookies.get("admire_app_token");
            if(token)
                BRA.appClient.login(token);
        }
    }, [isConnected.app && isConnected.rtc && !isLogged]);


 
    return <AuthContext.Provider value={store}> 
        {/*<Dialog show={!isConnected.app || !isConnected.rtc} {...props} title="OOPS! Connection Lost!">
            <table>
                <tr>
                    <td><b>APP:</b> </td>
                    <td>{isConnected.app?"connected 👍.":<>{"connecting... "}<Spinner variant="primary" animation="border" size="sm" /> </>}</td>
                </tr>
                <tr>
                    <td><b>RTC:</b></td>
                    <td>{isConnected.rtc?"connected 👍.":<>{"  connecting... "}<Spinner variant="primary" animation="border" size="sm" /> </>}</td>
                </tr>
            </table>
        </Dialog>*/}

        {children}
    </AuthContext.Provider>
}