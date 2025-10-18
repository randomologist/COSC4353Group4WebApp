import { useState,useEffect, useRef } from "react";

async function fetchNotifs(cursor){
    const params = new URLSearchParams();
    if(cursor){
        params.append('cursor', cursor)
    }
    const res = await fetch(`/api/notifs?${params.toString()}`);
    if(!res.ok){
        throw new Error("Failed to fetch notifications")
    }

    return await res.json();
}

//custom hook for notifications
export function useNotifs(){
    //state for notifications display
    const [notifs, setNotifs] = useState([]);
    //state for prev selected
    const [cursor, setCursor] = useState(null);
    //state for checking if more notifs are available
    const [hasMore, setHasMore] = useState(true);
    //state for loading
    const [loading, setLoading] = useState(false);
    //state for error handling
    const [error, setError] = useState(null);
    //state for when more notifs should be fetched
    const [loadMore,setLoadMore] = useState(false);
    //ref for the loader div
    const loaderRef = useRef(null);
    
    useEffect(() => {
        if(!loadMore || !hasMore || loading){
            return
        };
        async function loadNotifs(){
            setLoading(true);
            try{
                const {items,hasMore:more,next} = await fetchNotifs(cursor);
                setNotifs(prev => [...prev,...items]);
                setHasMore(more);
                setCursor(next);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
                setLoadMore(false);
            }
        }
        loadNotifs();
    }, [loadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading){
                setLoadMore(true)
                console.log("loading next batch")
            }
        });

        if(loaderRef.current){
            observer.observe(loaderRef.current);
        }
        return () =>  observer.disconnect();
    },[hasMore, loading,cursor]);
    useEffect(() => {
        if(notifs.length === 0 && hasMore && !loading){
            setLoadMore(true);
        }
    },[])
    return { notifs, loading, error, loaderRef};

}