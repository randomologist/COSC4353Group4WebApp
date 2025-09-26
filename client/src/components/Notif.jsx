import "./Notif.css";

function Notif({notif, onRead}) {
    return(
        //onclick should trigger when notif is clicked or when link is clicked
        <div className={`notif ${notif.read ? "read" : "unread"}`} onClick={() => onRead(notif.id)}>
            <h4>{notif.message}</h4>
            <p>{notif.details}</p>
            <a href={`/events/${notif.eventID}`}>View Event</a>
        </div>
    )
}

export default Notif;