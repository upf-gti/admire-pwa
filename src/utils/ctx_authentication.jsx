import http from "utils/http"
import * as BRA from "lib_bra";
import cookies from '@h3r/cookies'
import toast from 'react-hot-toast'
import { createContext, useEffect, useState, useRef, } from 'react'

export const AuthContext = createContext()

export default ({children, ...props}) => {
    const [ user,        setUser      ] = useState(null);
    const [ token,       setToken     ] = useState(cookies.get("admire_app_token"));
    const [ isLogged,    setLogged    ] = useState(false);
    const [ isConnected, setConnected ] = useState({app:false, rtc:false});
    let   { current: toast_app }        = useRef(null);
    let   { current: toast_rtc }        = useRef(null);
    let   { current: toast_usr }        = useRef(null);
    const [ retries, setRetries ]       = useState(0);        


    useEffect( ()=>{ //Constructor
        function onUnload(){
            BRA.rtcClient.unregister();
            BRA.rtcClient.disconnect();
            BRA.appClient.disconnect(); 
            window.removeEventListener('unload', onUnload);
        }
        window.addEventListener('unload', onUnload);

        function onAppConnect    (){ toast("App Connected",    {id:toast_app, icon:'⚡', duration:2000}); setConnected( v => ({...v, app:true })); }
        function onRtcConnect    (){ toast("RTC Connected",    {id:toast_rtc, icon:'⚡', duration:2000}); setConnected( v => ({...v, rtc:true })); }
        function onAppDisconnect (){ toast("App Disconnected", {id:toast_app, icon:'⚠️', duration:2000}); setConnected( v => ({...v, app:false})); }
        function onRtcDisconnect (){ toast("RTC Disconnected", {id:toast_rtc, icon:'⚠️', duration:2000}); setConnected( v => ({...v, rtc:false})); }

        BRA.appClient.on(BRA.APPEvent.ClientConnected,      onAppConnect   );
        BRA.rtcClient.on(BRA.RTCEvent.ClientConnected,      onRtcConnect   );
        BRA.appClient.on(BRA.APPEvent.ClientDisconnected,   onAppDisconnect);
        BRA.rtcClient.on(BRA.RTCEvent.ClientDisconnected,   onRtcDisconnect);

    return ()=>{ //Destructor
        BRA.appClient.off(BRA.APPEvent.ClientConnected,     onAppConnect        );
        BRA.appClient.off(BRA.RTCEvent.ClientConnected,     onAppDisconnect     );
        BRA.rtcClient.off(BRA.APPEvent.ClientDisconnected,  onRtcConnect        );
        BRA.rtcClient.off(BRA.RTCEvent.ClientDisconnected,  onRtcDisconnect     );

        onUnload();
    }
    }, []);


    useEffect( ()=>{
        if(!isConnected.app && token){
            BRA.appClient.connect(process.env.REACT_APP_APP_URL, token);
        }
    }, [isConnected.app, token]);

    useEffect( ()=>{
        if(!isConnected.rtc && token){
            BRA.rtcClient.connect(process.env.REACT_APP_RTC_URL, token);
        }
    }, [isConnected.rtc, token]);

    useEffect( ()=>{
        if(isConnected.rtc && isConnected.app && token && !isLogged) //Im properly connected
        {
            toast_usr = toast.loading(`Fetching user info...`, {duration:Infinity});
            getUserInfo()
            .then( (response) => {
                toast.success(`Success`, {id:toast_usr, icon:'⚡', duration:2000});
                setUser(response);
                setLogged(true);
            })
            .catch( ({error, message}) => {
                toast.error(`onGetUserInfo(e:${error}): ${message}`, {id:toast_usr, icon:'⚠️', duration:4000});
                if(retries >= 3) logout();
                else 
                {
                    toast((t) => {
                        const [timer, setTimer] = useState(t.duration * .001);
                        useEffect( ()=>{ const interval_id = setInterval(()=>setTimer(s=>Math.max(0,s-1)), 1000);   //Toast Constructor
                            return ()=>{ clearInterval(interval_id);    setRetries(v => v+1);                       //Toast Destructor
                        }}, []);
                        return <span>{timer === 0 ? `Retrying`:`Retrying in ${timer}s...`}</span>
                    },{duration:5000});
                }
            });
        }
        if(isConnected.rtc && isConnected.app && isLogged){

            BRA.rtcClient.register(user.username, ({status, description})=>{
                if(status === 'error')
                {
                    toast.error(`onRegister error: ${description}`,{icon:<i className="bi bi-activity"/>, duration: 5000});
                    setTimeout(logout,1000);
                }
            });
        }
    },[isConnected.rtc && isConnected.app, token, isLogged, retries]);

    async function login(email, password){
        const toastId = toast.loading('Logging in...');
        email = email.toLowerCase();
        setToken(null);
        return http.post(`${process.env.REACT_APP_API_URL}/auth/basic`, {data:{ email, password }})
        .then(response => {
            if(response?.error || !response?.access_token)
            {
                for(let msg of [response.message].flat()) 
                    toast.error(`onLogin error: ${msg}`);
                toast.dismiss(toastId);
                setTimeout(logout,2000)
                return null;
            }
            toast.success('Success login', { id: toastId });
            setToken(response.access_token);
            return response.access_token;
        })
        .catch(err => toast.error(`Error catch: ${err}`, { id: toastId }));
    }

    async function logout(){
        cookies.set("admire_app_email",null,-1);
        cookies.set("admire_app_token",null,-1);
        setToken(null);
        setLogged(false);
        toast('Logged out');
        
        BRA.rtcClient.unregister();
        BRA.rtcClient.disconnect();
        BRA.appClient.disconnect(); 
        setRetries(0);
    }

    async function getUserInfo(){
        return new Promise((resolve, reject) => {
            http.get(`${process.env.REACT_APP_API_URL}/users/me`, {headers:{Authorization:`Bearer ${token}`}})
            .then( response => {
                if(response?.error) reject(response);
                else resolve(response);
            })
            .catch(err => reject(err));
        });
    }
    
    const store = window.auth = {
        user       
        ,isLogged
       ,isConnected: isConnected.app && isConnected.rtc
       ,login
       ,logout
   }
 
    return <AuthContext.Provider value={store}> 
        {children}
    </AuthContext.Provider>
}