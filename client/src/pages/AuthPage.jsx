import { useEffect, useState } from 'react'
import './AuthPage.css'

function AuthPage(){
    const [mode, setMode] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash === "sign-up" ? "sign-up" : "login";

    });
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setMode(hash === "sign-up" ? "sign-up" : "login");
            setFormData({
                email: '',
                password: '',
                confirmPassword: ''
            });
        }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    }


    return (
        <div id="formWrapper">
            <div id="formBody">
                <h2>{mode === "sign-up" ? "Sign Up" : "Log In"}</h2>
                <div class="section">
                    <span class="authLabel">Email</span>
                    <input
                    name="email"
                    type="text"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>
                <div class="section">
                    <span class="authLabel">Password</span>
                    <input
                    name="password"
                    type="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    />
                    {mode === "login" && ( <a id="forgot-pass">Forgot Password</a>)}
                </div>
                {mode === "sign-up" && (
                <div class="section">
                    <span class="authLabel">Confirm Password</span>
                    <input
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}/>
                </div>)}
                <button >{mode === "sign-up" ? "Sign Up" : "Log In"}</button>
                <a href={mode === "sign-up" ? "#login" : "#sign-up"}>{mode === "sign-up" ? "Already have an account? Log In" : "Don't have an account? Sign Up"}</a>
            </div>
        </div>
    )
}

export default AuthPage