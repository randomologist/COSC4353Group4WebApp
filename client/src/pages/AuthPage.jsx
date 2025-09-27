import { useState } from 'react'
import './AuthPage.css'

function AuthPage(){
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    }


    return (
        <div id="formWrapper">
            <div id="formBody">
                <label>Email</label>
                <input
                name="email"
                type="text"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                />
                <label>Password</label>
                <input
                name="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                />
                <button>Log in</button>
            </div>
        </div>
    )
}

export default AuthPage