import {useNotifs} from "../data/notifs";
import { useEffect, useState } from "react";
import './NotifDropdown.css';
import Notif from "./Notif";

function NotifDropdown() {
    const { notifs, loading, error } = useNotifs();
    const [localNotifs, setLocalNotifs] = useState(notifs);

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
        <div className="ndropdown">
            //
            {localNotifs.slice(0,5).map((notif) => (
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
        </div>
    );    
}

export default NotifDropdown;