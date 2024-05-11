export const encodeObj = (obj) => {
    let encodedString;
    try {
        // Convert object to string
        const stringObj = JSON.stringify(obj);

        // Escape special chars (NON-UTF-8 compatible)
        const uriEncoded = encodeURIComponent(stringObj);

        // Convert string to Base-64 encoded
        encodedString = btoa(uriEncoded);
    } catch (e) {
        console.error("Error while encoding data", e.message);
    }
    return encodedString;
};

export const decodeObj = (obj) => {
    let decodedObject;
    try {
        // Decode from Base-64 encoded
        const decodedString = atob(obj);

        // Revert to original chars (NON-UTF-8)
        const uriDecodedString = decodeURIComponent(decodedString);

        // Parse string to JSON object
        decodedObject = JSON.parse(uriDecodedString);
    } catch (e) {
        console.error("Error while decoding data ", e.message);
    }
    return decodedObject;
};
