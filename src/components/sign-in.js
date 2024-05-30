import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import useToken from '../hooks/useToken';
import { loginUser, signupUser } from '../services/authSlice';
import { userValidation } from '../utils/validation';

export default function SignIn() {
    let [authMode, setAuthMode] = useState('signin');
    const intialValues = {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
    };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const { setToken } = useToken();

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const changeAuthMode = (value) => {
        setAuthMode(value);
        setFormValues(intialValues);
        setFormErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = userValidation(formValues, authMode);
        setFormErrors(errors);
        if (!Object.keys(errors)?.length) {
            setFormValues(intialValues);
            setFormErrors({});
            if (authMode === 'signin') {
                const { payload } = await dispatch(loginUser(formValues));
                if (payload?.success) {
                    toast.success('Login successful!');
                    setToken(payload.data.accessToken);
                    localStorage.setItem(
                        'currentUser',
                        JSON.stringify(payload.data)
                    );
                    navigate('/home');
                }
            } else {
                setAuthMode('signin');
                const { payload } = dispatch(
                    signupUser({ private: true, ...formValues })
                );
                if (payload?.success) {
                    toast.success('Registration successful!');
                }
            }
        }
    };

    return (
        <>
            {authMode === 'signup' ? (
                <div className="form-container">
                    <div className="d-flex flex-column w-30 text-center">
                        <h4 className="postgram">Postgram</h4>
                        <p>Connect with friends and the world around you.</p>
                    </div>
                    <form
                        className="login-form"
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <div className="login-form-content">
                            <h3 className="login-form-title">Sign Up</h3>
                            <div className="text-center">
                                Already registered?{' '}
                                <span
                                    className="link-primary"
                                    onClick={() => changeAuthMode('signin')}
                                >
                                    Sign In
                                </span>
                            </div>
                            <div className="form-group mt-3">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    className="form-control mt-1"
                                    placeholder="Enter First Name"
                                    value={formValues.firstname}
                                    onChange={(e) => handleChange(e)}
                                />
                                <small className="text-danger">
                                    {formErrors.firstname}
                                </small>
                            </div>
                            <div className="form-group mt-3">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    className="form-control mt-1"
                                    placeholder="Enter Last Name"
                                    value={formValues.lastname}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>User Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control mt-1"
                                    placeholder="Enter Last Name"
                                    value={formValues.username}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control mt-1"
                                    placeholder="Enter email"
                                    value={formValues.email}
                                    onChange={(e) => handleChange(e)}
                                />
                                <small className="text-danger">
                                    {formErrors.email}
                                </small>
                            </div>
                            <div className="form-group mt-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control mt-1"
                                    placeholder="Enter password"
                                    value={formValues.password}
                                    onChange={(e) => handleChange(e)}
                                />
                                <small className="text-danger">
                                    {formErrors.password}
                                </small>
                            </div>
                            <div className="d-flex mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <div className="form-container">
                        <div className="d-flex flex-column w-30 text-center">
                            <h4 className="postgram">Postgram</h4>
                            <p>
                                Connect with friends and the world around you.
                            </p>
                        </div>
                        <form
                            className="login-form"
                            onSubmit={(e) => handleSubmit(e)}
                        >
                            <div className="login-form-content">
                                <h3 className="login-form-title">Sign In</h3>
                                <div className="text-center">
                                    Not registered yet?{' '}
                                    <span
                                        className="link-primary"
                                        onClick={(e) =>
                                            changeAuthMode('signup')
                                        }
                                    >
                                        Sign Up
                                    </span>
                                </div>
                                <div className="form-group mt-3">
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control mt-1"
                                        placeholder="Enter email"
                                        value={formValues.email}
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <small className="text-danger">
                                        {formErrors.email}
                                    </small>
                                </div>
                                <div className="form-group mt-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control mt-1"
                                        placeholder="Enter password"
                                        value={formValues.password}
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <small className="text-danger">
                                        {formErrors.password}
                                    </small>
                                </div>
                                <div className="d-flex mt-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
