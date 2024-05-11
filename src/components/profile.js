import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useGetUserProfileQuery, useUpdateUserProfileMutation} from "../services/users";

export default function Profile() {
    const {data, error, isLoading} = useGetUserProfileQuery();
    const [updateUserProfile] = useUpdateUserProfileMutation();
    const [user, setUser] = useState();
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (data) {
            const user = localStorage.getItem('currentUser');
            if (user) {
                const currentUser = JSON.parse(user);
                setUser(data?.data?.find((user) => user.email === currentUser.email));
            }
        }
    }, [data])

    if (isLoading) {
        return <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">Loading...</div>;
    }
    if (error) return <div>An error has occurred!</div>;

    const validate = (values) => {
        const errors = {};
        const regex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g;

        if (!values.firstname) {
            errors.firstname = "First Name is required!";
        }

        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }

        return errors;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const errors = validate(user)
        setFormErrors(errors);
        if (!Object.keys(errors)?.length) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            const response = await updateUserProfile(user);
            if (response.data.status === 'success') {
                toast.success('Profile updated!')
            }
        }
    }

    return (
        <>
            {user && <div className="form-container">
                <form className="login-form" onSubmit={(e) => updateProfile(e)}>
                    <div className="login-form-content">
                        <div className="form-group mt-3">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                className="form-control mt-1"
                                placeholder="Enter First Name"
                                value={user?.firstname}
                                onChange={(e) => handleChange(e)}
                            />
                            <small className="text-danger">{formErrors?.firstname}</small>
                        </div>
                        <div className="form-group mt-3">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                className="form-control mt-1"
                                placeholder="Enter Last Name"
                                value={user?.lastname}
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
                                value={user?.username}
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
                                value={user?.email}
                                onChange={(e) => handleChange(e)}
                            />
                            <small className="text-danger">{formErrors?.email}</small>
                        </div>
                        <div className="form-group mt-3">
                            <label>Private</label>
                            <div className="radio">
                                <label>
                                    <input type="radio"
                                           name="isPrivate"
                                           value={true}
                                           checked={user?.isPrivate === true || user?.isPrivate === "true"}
                                           onChange={(e) => handleChange(e)}/>
                                    Yes
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" name="isPrivate" value={false}
                                           checked={user?.isPrivate === false || user?.isPrivate === "false"}
                                           onChange={(e) => handleChange(e)}/>
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <button type="submit" className="btn btn-primary w-100">
                                Update Profile
                            </button>
                        </div>
                    </div>
                </form>
            </div>}
        </>
    );
}
