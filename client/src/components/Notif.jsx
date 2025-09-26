import React, { useState } from "react";
import {useNotifs} from "../data/notifs";
import "./Notif.css";

function Notif({notif, onRead}) {
    return(
        <div className={'notif ${notif.read ? "read" : "unread"} ${compact ? "compact" : "full"}'} onClick={() => onRead(notif.id)}>
            <h4>{notif.message}</h4>
            <p>{notif.details}</p>
            <a href={`/events/${notif.eventID}`}>View Event</a>
        </div>
    )
}

export default Notif;