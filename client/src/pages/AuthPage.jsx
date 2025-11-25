import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../auth/AuthProvider"
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

    const navigate = useNavigate();
    const {login, register} = useAuth();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    }

    async function handleSubmit(e){
        e.preventDefault();
        setError('');
        setSubmitting(true);

        // basic client validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required.');
            setSubmitting(false);
            return;
        }
        if (mode === 'sign-up' && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setSubmitting(false);
            return;
        }

        try {
            if(mode === 'sign-up'){
                await register(formData.email, formData.password);
            }
            else{
                await login(formData.email, formData.password);
            }
            navigate('/home');
        } catch (err) {
            console.error(err);
            if (err.message === "Failed to fetch") {
                setError("Network error. Is the server running on :5000?");
            } else {
                setError(err.message || "Something went wrong.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div id="formWrapper">
            <div id="formBody">
                <h2>{mode === "sign-up" ? "Sign Up" : "Log In"}</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <div className="section">
                    <span className="authLabel">Email</span>
                    <input
                    name="email"
                    type="text"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>
                <div className="section">
                    <span className="authLabel">Password</span>
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
                <div className="section">
                    <span className="authLabel">Confirm Password</span>
                    <input
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}/>
                </div>)}
                <button onClick={handleSubmit}>{mode === "sign-up" ? "Sign Up" : "Log In"}</button>
                <a href={mode === "sign-up" ? "#login" : "#sign-up"}>{mode === "sign-up" ? "Already have an account? Log In" : "Don't have an account? Sign Up"}</a>
            </div>
        </div>
    )
}

export default AuthPage