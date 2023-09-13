import React,{useEffect} from 'react'
import {useParams,useHistory} from 'react-router-dom'
const Offline = () => {
    const history = useHistory()
    const status = () => {
        const on =  window.navigator.onLine;
        if(on)
           history.goBack()
         }

    useEffect(()=>{
        setInterval(() => {
            status()
        }, 2000);
    },[])
    return (
       <div className="mt-5" align="center">
       <h3>No internet</h3>
Try:<br/>

Checking the network cables, modem, and router <br/>
Reconnecting to Wi-Fi<br/>
       </div>
    )
}

export default Offline
