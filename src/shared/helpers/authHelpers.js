// Retrieve the access token from localStorage or cookies
export const getLocalAccessToken = () => {
    if (typeof window !== 'undefined') {
        // The code is running on the client-side, so it's safe to access localStorage
        return localStorage.getItem(process.env.NEXT_PUBLIC_APP_TOKEN) || null;
    }

    // Return null if we're on the server-side
    return null;
};

export const storeLocalAccessToken = (payload) => {


    return localStorage.setItem(process.env.NEXT_PUBLIC_APP_TOKEN, payload);
};

export const removeLocalAccessToken = () => {
    // The code is running on the client-side, so it's safe to access localStorage
    return localStorage.removeItem(process.env.NEXT_PUBLIC_APP_TOKEN);

    // Return null if we're on the server-side
};



// Example function to handle token refresh
export const handleTokenRefresh = async () => {
    try {
        // Call your API endpoint to refresh the token
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            refreshToken: localStorage.getItem('refreshToken'),
        });

        const { accessToken } = response.data;
        // Store the new access token
        localStorage.setItem(process.env.NEXT_PUBLIC_APP_TOKEN, accessToken);
        return accessToken;
    } catch (error) {
        console.error('Failed to refresh token', error);
        return null;
    }
};
