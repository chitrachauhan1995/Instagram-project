import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useUpdateUserProfileMutation } from '../services/users';
import { userValidation } from '../utils/validation';
import { uploadPhoto } from '../utils/file-upload';
import { useAuth } from '../contexts/AuthContext';

export default function EditProfile({ toggleModal, user }) {
    const { setCurrentLoggedInUser } = useAuth();
    const [updateUserProfile] = useUpdateUserProfileMutation();

    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [file, setFile] = useState('');
    const [base64, setBase64] = useState('');

    useEffect(() => {
        setFormValues(user);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const photoUpload = async (e) => {
        if (e.target.files[0]) {
            const { file, imagePreview, base64 } = await uploadPhoto(e);
            setFile(file);
            setImagePreview(imagePreview);
            setBase64(base64);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const errors = userValidation(formValues);
        setFormErrors(errors);
        if (!Object.keys(errors)?.length) {
            const payload = Object.assign({}, formValues);
            if (file) {
                payload.profilePhoto = base64;
            }
            const response = await updateUserProfile(payload);
            if (response.data.status === 'success') {
                setCurrentLoggedInUser(payload);
                toast.success('Profile updated!');
                setFormValues(null);
                toggleModal();
            }
        }
    };

    return (
        <div
            className="modal"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header  d-flex align-items-center justify-content-between">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Edit Profile
                        </h5>
                        <FontAwesomeIcon
                            icon={faTimesCircle}
                            onClick={() => toggleModal()}
                            size="2xl"
                            color="#6c757d"
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => updateProfile(e)}>
                            <div>
                                <div className="form-group mt-3">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        className="form-control mt-1"
                                        placeholder="Enter First Name"
                                        value={formValues?.firstname}
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <small className="text-danger">
                                        {formErrors?.firstname}
                                    </small>
                                </div>
                                <div className="form-group mt-3">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className="form-control mt-1"
                                        placeholder="Enter Last Name"
                                        value={formValues?.lastname}
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
                                        value={formValues?.username}
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
                                        value={formValues?.email}
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <small className="text-danger">
                                        {formErrors?.email}
                                    </small>
                                </div>
                                <div className="form-group mt-3">
                                    <label>Upload Profile Photo</label>
                                    <div className="form-group mt-3">
                                        <input
                                            type="file"
                                            name="avatar"
                                            id="file"
                                            accept="image/*"
                                            onChange={photoUpload}
                                            src={imagePreview}
                                        />
                                        {(imagePreview ||
                                            formValues?.profilePhoto) && (
                                            <img
                                                alt="img"
                                                src={
                                                    imagePreview
                                                        ? imagePreview
                                                        : formValues?.profilePhoto
                                                }
                                                width="100"
                                                height="100"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-dismiss="modal"
                                        onClick={() => toggleModal()}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn action-button"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
