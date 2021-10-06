import React from 'react';

function Login() {
    const API_URL = process.env.REACT_APP_API;

    return (
        <div>
            <form method='POST' action={API_URL + '/users/add'}>
                <input placeholder='Email' name='email'></input>
                <input placeholder='Password' name='password'></input>
                <input placeholder='Verfiy Password' name='verify-passsword'></input>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default Login