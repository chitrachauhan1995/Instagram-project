import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
    useCreatePostMutation,
    useUpdatePostMutation,
} from '../services/posts';
import { uploadPhoto } from '../utils/file-upload';

export default function AddPost({ toggleModal, post }) {
    const [createUserPost] = useCreatePostMutation();
    const [updateUserPost] = useUpdatePostMutation();

    const [formValues, setFormValues] = useState(post ?? {});
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [file, setFile] = useState('');
    const [base64, setBase64] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const createPost = async (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        if (!Object.keys(errors)?.length) {
            const payload = Object.assign({}, formValues);
            if (file) {
                payload.filePath = base64;
            }
            if (post) {
                const response = await updateUserPost(payload);
                if (response?.data?.status === 'success') {
                    toast.success('Post successfully updated!');
                    setFormValues(null);
                    toggleModal();
                }
            } else {
                const response = await createUserPost(payload);
                if (response?.data?.status === 'success') {
                    toast.success('successfully posted!');
                    setFormValues(null);
                    toggleModal();
                }
            }
        }
    };

    const photoUpload = async (e) => {
        if (e.target.files[0]) {
            const { file, imagePreview, base64 } = await uploadPhoto(e);
            setFile(file);
            setImagePreview(imagePreview);
            setBase64(base64);
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values?.title) {
            errors.firstname = 'Post title is required';
        }
        return errors;
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
                            Add New Feed
                        </h5>
                        <FontAwesomeIcon
                            icon={faTimesCircle}
                            onClick={() => toggleModal()}
                            size="2xl"
                            color="#dee2e6"
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group mt-3">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control mt-1"
                                    placeholder="Enter Title"
                                    value={formValues?.title}
                                    onChange={(e) => handleChange(e)}
                                />
                                <small className="text-danger">
                                    {formErrors?.title}
                                </small>
                            </div>
                            <div className="form-group mt-3">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    className="form-control mt-1"
                                    placeholder="Enter Description"
                                    value={formValues?.description}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Upload Image</label>
                                <div className="form-group mt-3">
                                    <input
                                        type="file"
                                        name="avatar"
                                        id="file"
                                        accept="image/*"
                                        onChange={photoUpload}
                                        src={imagePreview}
                                    />
                                    {(imagePreview || formValues?.filePath) && (
                                        <img
                                            alt="img"
                                            src={
                                                imagePreview
                                                    ? imagePreview
                                                    : formValues?.filePath
                                            }
                                            width="100"
                                            height="100"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <label>Private</label>
                                <div className="radio">
                                    <label>
                                        <input
                                            type="radio"
                                            name="isPrivate"
                                            value={true}
                                            checked={
                                                formValues?.isPrivate ===
                                                    true ||
                                                formValues?.isPrivate === 'true'
                                            }
                                            onChange={(e) => handleChange(e)}
                                        />
                                        Yes
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input
                                            type="radio"
                                            name="isPrivate"
                                            value={false}
                                            checked={
                                                formValues?.isPrivate ===
                                                    false ||
                                                formValues?.isPrivate ===
                                                    'false'
                                            }
                                            onChange={(e) => handleChange(e)}
                                        />
                                        No
                                    </label>
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
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={(e) => createPost(e)}
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
