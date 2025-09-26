import {useNotifs} from "../data/notifs";
import { useEffect, useState } from "react";
import './NotifDropdown.css';
import Notif from "./Notif";

function NotifDropdown() {
    const { notifs, loading, error } = useNotifs();
    const [localNotifs, setLocalNotifs] = useState(notifs);

    useEffect(() => {
        if(notifs){
            setLocalNotifs(notifs);
        }
    }, [notifs]);

    if (loading) return <div className = "ndropdown">Loading...</div>;
    if (error) return <div className = "ndropdown">Error loading notifications style = "color:red"</div>;

    return(
        <div className="ndropdown">
            {localNotifs.slice(0,5).map((notif) => (
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