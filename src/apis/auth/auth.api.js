import { apiGet, apiPost } from '@/shared/services/apiService';

const authAPI = {
    login: (userData) => apiPost('auth/sign-in', userData),
    connectStripe: (userData) => apiPost('auth/connect-stripe', userData),
    forgetPass: (userData) => apiPost('auth/forget-password', userData),
    verifyOtp: (userData) => apiPost('auth/verify-otp', userData),
    resetPassword: (userData) => apiPost('auth/reset-password', userData),
    resendOtp: (userData) => apiPost('auth/resend-otp', userData),
    userInfo: (userData) => apiGet('auth/me', userData),
    checkStripeStatus: (userData) => apiPost(`auth/connect-under-review/?accountId=${userData?.accountId}`, userData),
};

export default authAPI;
