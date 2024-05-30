const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const uploadPhoto = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    let base64 = '';
    try {
        base64 = await convertFileToBase64(file);
    } catch (error) {
        console.error('Error converting file to base64:', error);
    }
    return {
        file,
        imagePreview: URL.createObjectURL(e.target.files[0]),
        base64,
    };
};
