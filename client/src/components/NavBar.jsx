import { NavLink } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-links">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/UserProfilePage" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
      </div>
    </nav>
  )
}

export default NavBar
