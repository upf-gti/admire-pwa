import * as BRA from "lib_bra";
import cookies from '@h3r/cookies'
import toast from 'react-hot-toast'
import React, { createContext, useEffect, useState } from 'react'
import http from "utils/http"
//import { useHistory } from 'react-router-dom';

export const AuthenticationContext = createContext(); 

export default ({children, ...props}) => {
    //const [state, setState] = useState(0);
    //const history                       = useHistory();
    const [ isAdmin,     setAdmin     ] = useState(false);
    const [ isLogged,    setLogged    ] = useState(false);
    const [ isConnected, setConnected ] = useState({app:false, rtc:false});
    const [ user,        setUser      ] = useState(null);
    const [ token,       setToken     ] = useState(null);
    const [ avatar,      setAvatar    ] = useState(null);

    const store = {
         user       
        ,token      
        ,avatar     
        ,isAdmin    
        ,isConnected: isConnected.app && isConnected.rtc
        ,isLogged
        ,login
        ,logout
    }

    function login(email, password){
        return doLogIn(email.toLowerCase(), password);
    }

    async function doLogIn(email, password) {
        const toastId = toast.loading('Logging in...');
        return http.post(`${process.env.REACT_APP_API_URL}/auth/basic`, { email, password })
        .then(response => {
            switch (response.status) {
                case 404: toast.error(`Error ${response.error}: ${response.message}`, { id: toastId }); break;
                default:  toast.success('Success', { id: toastId });
                    BRA.appClient.login(response.access_token);
                    setToken(response.access_token);
                    return response.access_token;
            }
        })
        .catch(err => toast.error(`Error catch: ${err}`, { id: toastId }));
    }

    async function logout(){
        cookies.get("admire_app_email",null,-1);
        cookies.get("admire_app_token",null,0);
        return await BRA.appClient.logout();
    }

    function onLogin({ status, userId, userType, description }) {
        switch (status) {
            case 'ok': toast.success(`Logged in as '${userId}'`);
                BRA.rtcClient.register(userId);
                window.userId = userId;

                setLogged(true);
                setUser(userId);
                setAdmin(userType);
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
            BRA.rtcClient.disconnect();
            BRA.appClient.disconnect(); 
            window.removeEventListener('unload', onUnload);
        }
        window.addEventListener('unload', onUnload);

        let onAppConnect, onAppDisconnect, onRtcConnect, onRtcDisconnect;
        BRA.appClient.on('client_connected',      onAppConnect      = () => { toast("App Connected",    {icon:'⚡'}); setConnected( v => ({...v, app:true })); });
        BRA.appClient.on('client_disconnected',   onAppDisconnect   = () => { toast("App Disconnected", {icon:'⚠️'}); setConnected( v => ({...v, app:false})); });
        BRA.rtcClient.on('client_connected',      onRtcConnect      = () => { toast("RTC Connected",    {icon:'⚡'}); setConnected( v => ({...v, rtc:true })); });
        BRA.rtcClient.on('client_disconnected',   onRtcDisconnect   = () => { toast("RTC Disconnected", {icon:'⚠️'}); setConnected( v => ({...v, rtc:false})); });
        BRA.appClient.on("login_response",        onLogin);
        BRA.appClient.on("logout_response",       onLogOut);


        BRA.appClient.connect(process.env.REACT_APP_APP_URL);
        BRA.rtcClient.connect(process.env.REACT_APP_RTC_URL);

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
        const {app, rtc} = isConnected;
        if(app && rtc)
        {
            const access_token = cookies.get("admire_app_token")
            if(access_token)BRA.appClient.login(access_token);
        }
        
    }, [isConnected.app, isConnected.rtc]);


    return <AuthenticationContext.Provider value={store} children={children}/>
}