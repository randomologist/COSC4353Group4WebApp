import {useNotifs} from "../hooks/useNotifs";
import { useEffect, useState, useRef } from "react";
import './NotifDropdown.css';
import Notif from "./Notif";

function NotifDropdown() {
    const { notifs, loading, error, loaderRef } = useNotifs();
    const [localNotifs, setLocalNotifs] = useState(notifs);
    const scrollContainer = useRef(null)

    useEffect(() => {//if there are notifications, show them
        if(notifs){
            setLocalNotifs(notifs);
        }
    }, [notifs]);
    
    //show loading if notifs have not loaded yet
    if (loading) return <div className = "ndropdown">Loading...</div>;
    //if error occurs, display to user
    if (error) return <div className = "ndropdown" style = {{color:"red"}}>Error loading notifications</div>;

    return(
        //dropdown element display
        <div className="ndropdown-wrapper">
            <div className = "ndropdown-scroll" ref ={scrollContainer}>
                {localNotifs.map((notif) => (
                    //individual notification
                    <Notif 
                        key={notif.id}
                        notif={notif}
                        onRead={(id) => {
                            setLocalNotifs((prev) =>
                                prev.map((n) =>
                                    n.id === id ? { ...n, read: true } : n
                                )
                            );
                        }}
                    />
                ))}
                <div ref = {loaderRef} style={{height:"1px"}}></div>
            </div>
        </div>
    );    
}

export default NotifDropdown;