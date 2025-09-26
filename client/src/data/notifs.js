import { useState,useEffect } from "react";

//to be used for fetching stored notifications
export async function fetchNotifs() {
    //placeholder notifications
    return [
        {//matched event notification
            id:1,
            eventID:1,
            message: "You have been matched with Event A.",
            details: "Event A will be happening on 11/26/2025 at 10:00 AM.",
            read: false
        },
        {//event update notification
            id:2,
            eventID:1,
            message: "Event A has been updated.",
            details: "Event A will now be happening on 11/27/2025 at 11:00 AM.",
            read: false
        },
        {
            id:3,
            eventID:2,
            message: "Reminder: Event B is tomorrow at 10 AM.",
            details: "Don't forget to bring your ID and water bottle.",
            read:true
        },
    ];
}

//custom hook for notifications
export function useNotifs() {
    //state for notifications display
    const [notifs, setNotifs] = useState([]);
    //state for loading
    const [loading, setLoading] = useState(true);
    //state for error handling
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadNotifs() {
            try {
                const data = await fetchNotifs();
                setNotifs(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        loadNotifs();
    }, []);
    return { notifs, loading, error };

}