import data from "../data/notifData.js"

export function getNotifs(req,res){
    const {cursor, limit = 5} = req.query;
    const index = cursor? data.findIndex(n => n.id === parseInt(cursor)) : -1;
    const start = index >=0? index + 1: 0;
    const items = data.slice(start, start+parseInt(limit));
    const hasMore = start+items.length < data.length;
    const next = hasMore? items[items.length-1].id : null;

    res.json({ items, hasMore, next});
}