import React, { useState } from 'react';
import axios from 'axios';

function Register() {

    // Set state variables
    const [registerFirstName, setRegisterFirstName] = useState('first name');
    const [registerLastName, setRegisterLastName] = useState('last name');
    const [registerEmail, setRegisterEmail] = useState('email');
    const [registerPassword, setRegisterPassword] = useState('password');
    const [registerVeriftyPassword, setRegisterVerifyPassword] = useState('verify password');
    const register = () => {
        axios.post('http://localhost:8080/api/users/register', {
            firstName: registerFirstName,
            lastName: registerLastName,
            username: registerEmail,
            password: registerPassword
        }).then((data) => console.log(data))
            .catch((err) => console.log(err))
    }
    return (
        <div>
            <form>
                <input placeholder={registerFirstName} onChange={(e) => setRegisterFirstName(e.target.value)} required></input>
                <input placeholder={registerLastName} onChange={(e) => setRegisterLastName(e.target.value)} required></input>
                <input placeholder={registerEmail} type='email' onChange={(e) => setRegisterEmail(e.target.value)} required ></input>
                <input placeholder={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required ></input>
                <input placeholder={registerVeriftyPassword} onChange={(e) => setRegisterVerifyPassword(e.target.value)} type='password'></input>
                <button type='submit' onClick={register}>Submit</button>
            </form>
            <a href='/login'>Login</a>
        </div>
    );
}

export default Register