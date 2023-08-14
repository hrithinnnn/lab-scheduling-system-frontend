import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './loginsignup.css'
import TestSnackbar from './TestSnackbar';
import { roles } from './Options';
export default function Login({ setIsLogin }) {
    const API_URL = "http://localhost:5000";
    const [user, setUser] = useState({ username: '', email: '', password: '', role: 'HOD', instituition: '', phone: '', newpassword: '' })
    const [err, setErr] = useState('')
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')
    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
        console.log(user)
        setErr('')
    }
    const registerSubmit = async e => {
        e.preventDefault()
        let res;
        if (user.password !== user.newpassword) {
            setErr("passwords do not match");
            return;
        }
        try {
            res = await axios.post(API_URL + '/users/register', {
                username: user.username,
                email: user.email,
                password: user.password,
                phone: user.phone,
                instituition: user.instituition,
                role: user.role
            })
            setSnackbarMessage(res.data.message);
            console.log(snackBarMessage);
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
                setSnackbarMessage('')
            }, 1000);
            setTimeout(() => { window.location.reload() }, 1000)
            setUser({ username: '', email: '', password: '', role: '', instituition: '', phone: '' })
        } catch (err) {
            err.response.data.message && setErr(err.response.data.message)
        }
    }

    const loginSubmit = async e => {
        e.preventDefault()

        try {
            console.log(user)
            const res = await axios.post(API_URL + '/users/login', {
                email: user.email,
                password: user.password
            });
            console.log(res);
            localStorage.setItem("token", res.data.token)
            setUser({ name: '', email: '', password: '' })
            setIsLogin(true)
        } catch (err) {
            setErr(err.response.data.message)
        }
    }

    const [onLogin, setOnLogin] = useState(false)


    return (
        <section className="login-page" id="login-page" >
            <h1>Lab Scheduler</h1>
            {(!onLogin) ?
                <div className="login create-note">
                    <form class="login form" autoComplete='off' onSubmit={loginSubmit}>
                        <p class="form-title">Sign in to your account</p>
                        <div class="input-container">
                            <input type="email" name="email" onChange={onChangeInput} placeholder="Enter email" value={user.email} />
                            <span>
                            </span>
                        </div>
                        <div class="input-container">
                            <input type="password" name="password" onChange={onChangeInput} placeholder="Enter password" value={user.password} />
                        </div>
                        <h3 style={{ color: 'red' }}>{err}</h3>
                        <button type="submit" class="submit">
                            Sign in
                        </button>

                        <p class="signup-link">
                            No account?
                            <a onClick={() => setOnLogin(true)}>Sign up</a>
                        </p>
                    </form>

                </div> :
                <div className="register create-note">
                    <TestSnackbar message={snackBarMessage} bool={openSnackbar} />

                    <form autocomplete="off" class="register form" onSubmit={registerSubmit}>
                        <p class="form-title">Make a new account</p>
                        <div class="input-container">
                            <input type="text" name="username" id="register-name"
                                placeholder="User Name" required value={user.username}
                                onChange={onChangeInput} />
                        </div>
                        <div class="input-container">
                            <input autocomplete="off" type="email" name="email" onChange={onChangeInput} placeholder="Enter email" value={user.email} />
                            <span>
                            </span>
                        </div>
                        <div class="input-container">
                            <input autocomplete="off" type="password" name="password" onChange={onChangeInput} placeholder="Enter password" value={user.password} />
                        </div>
                        <div class="input-container">
                            <input type="password" name="newpassword" id="register-password"
                                placeholder="enter password again" required value={user.newpassword}
                                autoComplete="true" onChange={onChangeInput} />
                        </div>
                        <div class="input -container">
                            <select onChange={onChangeInput} name="role" value={user.role}>
                                {roles.map((role) => <option value={role.value}>{role.label}</option>)}
                            </select> <br></br>
                        </div>
                        <div class="input-container">
                            <input type="text" name="instituition" id="register-name"
                                placeholder="instituition" required value={user.instituition}
                                onChange={onChangeInput} />
                        </div>
                        <div class="input-container">

                            <input type="number" name="phone" id="register-name"
                                placeholder="phone" required value={user.phone}
                                onChange={onChangeInput} />
                        </div>
                        <h3 style={{ color: 'red' }}>{err}</h3>
                        <button type="submit" class="submit">
                            Sign up
                        </button>

                        <p class="signup-link">
                            already have an account?
                            <a onClick={() => setOnLogin(false)}>Log in</a>
                        </p>
                    </form>
                </div>

            }
        </section>
    )
}
