import { useToast } from "@/shared/context/ToastContext"
import axiosInstance from "@/shared/services/axiosInstance"
import { useState } from "react"

export const usePaymentIntent = () => {
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast();
    const createPaymentIntent = async (url, params) => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.post(url, params)
            return data?.response?.details

        } catch (error) {
            addToast({
                message: error?.message,
                severity: 'error',
            });
        } finally {
            setLoading(false)
        }
    }
    const confirmPayment = async (url, params) => {
        setLoading(true)
        try {
            const res = await axiosInstance.post(url, params)
            addToast({
                message: res?.data?.message,
                severity: 'success',
            });
        } catch (error) {
            addToast({
                message: error?.response?.data?.message,
                severity: 'success',
            });

        } finally {
            setLoading(false)
        }
    }

    return {
        createPaymentIntent,
        confirmPayment,
        loading,
    }
}