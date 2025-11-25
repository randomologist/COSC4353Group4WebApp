const { getNotifs: getNotifArray } = require("../data/notifData.js");

function getNotifs(req, res) {
  try {
    const all = getNotifArray(); // <-- fetch the in-memory array
    const limitNum = Math.max(1, parseInt(req.query.limit, 10) || 5);

    // cursor is the id of the last item from previous page
    const cursorVal = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    if (Number.isNaN(cursorVal)) {
      return res.status(200).json({ items: [], hasMore: false, next: null });
    }

    const startIndex = cursorVal
      ? all.findIndex(n => n.id === cursorVal) + 1
      : 0;

    if (cursorVal && startIndex === 0) {
      // cursor id not found -> empty page, no more
      return res.status(200).json({ items: [], hasMore: false, next: null });
    }

    const items = all.slice(startIndex, startIndex + limitNum);
    const nextIndex = startIndex + items.length;
    const hasMore = nextIndex < all.length;
    const next = hasMore ? all[nextIndex - 1].id : null;

    res.status(200).json({ items, hasMore, next });
  } catch (e) {
    console.error("notif list error:", e);
    res.status(500).json({ error: "Internal error" });
  }
}
module.exports = { getNotifs };