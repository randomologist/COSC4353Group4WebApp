let data = [
        {//event update notification
            id:1,
            eventID:1,
            message: "Event A has been updated.",
            details: "Event A will now be happening on 11/27/2025 at 10:00 AM.",
            read: false
        },
        {//event match notification
            id:2,
            eventID:1,
            message: "You have been matched with Event A.",
            details: "Event A will now happening on 11/26/2025 at 11:00 AM.",
            read: true
        },
        {//event reminder notification
            id:3,
            eventID:2,
            message: "Reminder: Event B is tomorrow at 10 AM.",
            details: "Don't forget to bring your ID and water bottle.",
            read:false
        },
        {
            id:4,
            eventID:2,
            message: "You have been matched with Event B.",
            details: "Event B will be happening on 9/08/2025 at 10:00 AM.",
            read:true
        },
        {
            id:5,
            eventID:2,
            message: "Event C has been canceled",
            details: "We apologize for any inconvenience.",
            read:true
        },
        {
            id:6,
            eventID:2,
            message: "You have been matched with Event C.",
            details: "Event C will be happening on 8/01/2025 at 10:00 AM.",
            read:true
        },
    ];
const mock = {
    getNotifs: () => data,
    resetNotifs: (newdata) => { data = newdata;},
    addNotifs: (notif) => data.push(notif)
}

const active = mock;
//exports
export const getEvents = active.getEvents;
export const resetEvents = active.resetEvents;
export const addEvent = active.addEvent;