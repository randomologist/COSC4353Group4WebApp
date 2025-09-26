import {useState,useEffect, useRef} from "react";
import NotifDropdown from "./NotifDropdown";
function NotifToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

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

    return (
        <div ref={toggleRef} style ={{ position: "relative", display: "inline-block"}}>
            <button className="notif-button" onClick={toggleDropdown}>
                {isOpen ? "v" : ">"}
            </button>
            {isOpen && <NotifDropdown />}
        </div>
    );
}

export default NotifToggle;