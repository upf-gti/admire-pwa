import { useHistory } from 'react-router-dom'
import React, { createContext, useContext, useEffect } from 'react'
import { rtcClient, appClient, mediaAdapter, dummyStream } from 'lib_bra'


export const BraContext = createContext(); 
export default ({children, ...props}) => {
    const history = useHistory();

    const store = {

    }

    function onLoad(){

    }

    function onUnload(){

    }

    useEffect( ()=>{ 
        onLoad(); 
        return onUnload; 
    }, []);


    return <BraContext.Provider value={store}>
        {children}
    </BraContext.Provider>
}