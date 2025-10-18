import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

        const endpoint = mode === 'sign-up' ? '/api/auth/register' : '/api/auth/login';
        const payload = { email: formData.email, password: formData.password };

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || 'Authentication failed');
                setSubmitting(false);
                return;
            }

            // success: store token & user, then go home
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/home');
        } catch {
            setError('Network error. Is the server running on :5000?');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div id="formWrapper">
            <div id="formBody">
                <h2>{mode === "sign-up" ? "Sign Up" : "Log In"}</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
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
                <button onClick={handleSubmit}>{mode === "sign-up" ? "Sign Up" : "Log In"}</button>
                <a href={mode === "sign-up" ? "#login" : "#sign-up"}>{mode === "sign-up" ? "Already have an account? Log In" : "Don't have an account? Sign Up"}</a>
            </div>
        </div>
    )
}

export default AuthPage