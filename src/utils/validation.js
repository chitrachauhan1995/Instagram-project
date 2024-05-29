export const userValidation = (values, authMode) => {
    const errors = {};
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const usernameRegex = /^[a-zA-Z0-9-_@.]+$/;

    if (authMode !== 'signin') {
        if (!values.firstname) {
            errors.firstname = 'Firstname is required.';
        } else if (values.firstname.length < 2) {
            errors.firstname = 'Firstname must be at least 2 characters';
        } else if (values.firstname.length > 30) {
            errors.firstname = 'Firstname must be at most 30 characters';
        }

        if (!values.lastname) {
            errors.lastname = 'Lastname is required.';
        } else if (values.lastname.length < 2) {
            errors.lastname = 'Lastname must be at least 2 characters';
        } else if (values.lastname.length > 30) {
            errors.lastname = 'Lastname must be at most 30 characters';
        }

        if (!values.username) {
            errors.username = 'Username is required.';
        } else if (!usernameRegex.test(values.username)) {
            errors.username = 'Username must be at least 6 characters';
        } else if (values.username.length < 6) {
            errors.username = 'Username must be at least 6 characters';
        } else if (values.username.length > 30) {
            errors.username = 'Username must be at most 30 characters';
        }
    }

    if (!values.email) {
        errors.email = 'Email is required!';
    } else if (!emailRegex.test(values.email)) {
        errors.email = 'Invalid email address.';
    }

    if (!!authMode) {
        if (!values.password) {
            errors.password = 'Password is required.';
        } else if (values.password.length < 8) {
            errors.password = 'Password must be more than 8 characters';
        } else if (values.password.length > 15) {
            errors.password = 'Password cannot be more than 15 characters';
        }
    }
    return errors;
};
