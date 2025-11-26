import './Home.css'
import { useAuth } from '../auth/AuthProvider'
function Home(){
    const { user } = useAuth();
    return (
        <div>
            <h1>Volunteer Site</h1>
            {!user && (<div className="colored-text">A site to register for/set up a volunteer event<br/>Register for an account to continue</div>)}
            {user && (<div className="colored-text">Welcome, Thank you for your time</div>)}
        </div>
    )
}

export default Home