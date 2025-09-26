import { useState,useEffect, useRef } from "react";

//to be used for fetching stored notifications 
//will need to add pagination when we have a working backend
export async function fetchNotifs(page = 1, limit = 5){
    //placeholder notifications
    const data = [
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

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = data.slice(start, end);
    const hasMore = end < data.length;

    return { items, hasMore };
}

//custom hook for notifications
export function useNotifs(){
    //state for notifications display
    const [notifs, setNotifs] = useState([]);
    //state for current page
    const [page, setPage] = useState(1);
    //state for checking if more notifs are available
    const [hasMore, setHasMore] = useState(true);
    //state for loading
    const [loading, setLoading] = useState(true);
    //state for error handling
    const [error, setError] = useState(null);
    //ref for the loader div
    const loaderRef = useRef(null);

    useEffect(() => {
        async function loadNotifs(){
            setLoading(true);
            try{
                const {items,hasMore} = await fetchNotifs(page);
                setNotifs(items);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        loadNotifs();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading){
                setPage(prev => prev + 1);
            }
        });

        if(loaderRef.current){
            observer.observe(loaderRef.current);
        }
        return () =>  observer.disconnect();
    },[hasMore, loading]);
    return { notifs, loading, error, loaderRef};

}