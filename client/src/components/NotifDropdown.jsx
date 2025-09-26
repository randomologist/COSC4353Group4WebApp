import {useNotifs} from "../data/notifs";
import { useState } from "react";

function NotifDropdown() {
    const { notifs, loading, error } = useNotifs();
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    if (loading) return <div>Loading...</div>;
    //incomplete
}