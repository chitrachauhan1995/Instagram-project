import React, {useState} from "react";
import {toast} from "react-toastify";
import {useCreatePostMutation, useGetFeedPostQuery} from "../services/posts";

const Home = () => {
    const {data, error, isLoading} = useGetFeedPostQuery();
    const [createUserPost] = useCreatePostMutation();

    const [modal, setModal] = useState(false);
    const [formValues, setFormValues] = useState();
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('')
    const [file, setFile] = useState('')
    const [base64, setBase64] = useState('')

    if (isLoading) {
        return <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">Loading...</div>;
    }
    if (!data) {
        return <div>No posts added yet!</div>;
    }
    if (error) return <div>An error has occurred!</div>;


    const toggleModal = () => {
        setModal(!modal);
    };

    const validate = (values) => {
        const errors = {};
        if (!values.title) {
            errors.firstname = "Title is required!";
        }
        return errors;
    };

    const createPost = async (e) => {
        e.preventDefault();
        const errors = validate(formValues)
        setFormErrors(errors);
        if (!Object.keys(errors)?.length) {
            let payload = formValues;
            if (file) {
                payload.filePath = base64;
            }
            const response = await createUserPost(payload);
            if (response.data.status === 'success') {
                setModal(!modal);
                toast.success('successfully posted!');
                setFormValues(null);
            }

        }
    }

    const convertFileToBase64 = (file, callBack) => {
        const reader = new FileReader();
        reader.onload = () => {
            callBack(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const photoUpload = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        if (file) {
            setFile(file);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
            try {
                await convertFileToBase64(file, (base64String) => {
                    setBase64(base64String)
                });
            } catch (error) {
                console.error('Error converting file to base64:', error);
            }
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    return (
        <div className="w-100 h-100 d-flex flex-column">
            <div className="my-2">
                <button onClick={toggleModal} className="btn btn-primary btn-modal float-end">Add New Feed</button>
            </div>
            <div className="feed-container">
                {
                    data?.data?.data?.map((post, index) => (
                        <form className="login-form" key={index}>
                            <div className="login-form-content">
                                <div className="card-body text-center">
                                    <img src={post.filePath}
                                         alt="avatar"
                                         className="rounded-circle img-fluid img-size"/>
                                    <div className="my-3">Post
                                        By: {post.userData.firstname + ' ' + post.userData.lastname}</div>
                                    <p className="text-muted mb-1">Title: {post.title}</p>
                                    {post.description &&
                                    <p className="text-muted mb-4">Description: {post.description}</p>}
                                </div>
                            </div>
                        </form>
                    ))
                }
            </div>
            {modal && (
                <div className="modal" role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header  d-flex align-items-center justify-content-between">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="close" onClick={toggleModal} data-dismiss="modal"
                                        aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => createPost(e)}>
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
                                        <small className="text-danger">{formErrors?.title}</small>
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
                                                type='file'
                                                name='avatar'
                                                id='file'
                                                accept='image/*'
                                                onChange={photoUpload}
                                                src={imagePreview}
                                            />
                                            {imagePreview &&
                                            <img alt="img" src={imagePreview} width='100' height='100'/>}
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Private</label>
                                        <div className="radio">
                                            <label>
                                                <input type="radio"
                                                       name="isPrivate"
                                                       value={true}
                                                       checked={formValues?.isPrivate === true || formValues?.isPrivate === "true"}
                                                       onChange={(e) => handleChange(e)}/>
                                                Yes
                                            </label>
                                        </div>
                                        <div className="radio">
                                            <label>
                                                <input type="radio" name="isPrivate" value={false}
                                                       checked={formValues?.isPrivate === false || formValues?.isPrivate === "false"}
                                                       onChange={(e) => handleChange(e)}/>
                                                No
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                                onClick={toggleModal}>Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home;
