import {useState,useEffect, useRef} from "react";
import NotifDropdown from "./NotifDropdown";
function NotifToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleRef = useRef(null);

    const toggleDropdown = () => { //intialize as hidden/unopened
        setIsOpen(!isOpen);
    };

    //if something else is clicked hide dropdown
    useEffect(() => {
        const unfocus = (event) => {
            if (toggleRef.current && !toggleRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", unfocus);
        return () => {
            document.removeEventListener("mousedown", unfocus);
        };
    }, []);

    return ( //actual toggling of dropdown
        <div ref={toggleRef} style ={{ position: "relative", display: "inline-block"}}>
            <button className="notif-button" onClick={toggleDropdown}>
                {isOpen ? "Hide Notifications" : "Show Notifications"}
            </button>
            {isOpen && <NotifDropdown />}
        </div>
    );
}

export default NotifToggle;