"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Send } from "@mui/icons-material";
import { Box, Link as MuiLink, Stack, Typography, } from "@mui/material";
import { useForm } from "react-hook-form";


import { UIButton, UIOTPInput } from "@components";
// import { useApiDispatcher, useToast } from "@/hooks";
// import { loginAction } from "@/redux/slices/auth/controller";
import { useApiRequest } from "@/hooks/useApiRequest";
import { UIButtonWithTimer } from "@/shared/components/ui/button";
import { useToast } from "@/shared/context/ToastContext";
import { resendOtp, verifyOtp } from "@/store/auth/auth.thunks";
import Link from "next/link";
import { verifyOtpSchema } from "../schema";

export default function VerifyOtp({ onRequestChangeStep, email, setOtpId }) {
    const { addToast } = useToast();
    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues
    } = useForm({
        resolver: yupResolver(verifyOtpSchema),
        defaultValues: {
            otp: "",
        },
    });


    const [execute, loading,] = useApiRequest(verifyOtp, {
        initLoading: false,
        initFetch: false,
    });

    const [callResendOtp, resendOtpLoading] = useApiRequest(resendOtp, {
        initLoading: false,
        initFetch: false,
    });


    const verifyOtpSubmitHandler = async (data) => {
        const payload = {
            otp: data.otp,
            email
        };
        const { details } = await execute(payload);
        addToast({
            message: "Otp verified successfully",
            severity: 'success', // 'error', 'warning', 'info', 'success'
        });
        onRequestChangeStep()
        setOtpId(details.otpId)
    };

    const resendOtpHandler = async () => {
        const payload = {
            email
        };

        await callResendOtp(payload)
    }

    return (
        <Box
            component={"form"}
            sx={{ width: "100%" }}

            onSubmit={handleSubmit(verifyOtpSubmitHandler)}
        >
            <Typography color="primary" fontSize="1.5rem" fontWeight={900} >
                Verify otp
            </Typography>
            <Typography>Enter an OTP to continue</Typography>

            <Stack mt="2rem" spacing={2}>

                <UIOTPInput errorMessage={errors.otp?.message} control={control}
                />

            </Stack>

            <Stack width="100%" mt="1rem" direction={{ sm: "row", xs: "column" }} spacing={2}>
                <UIButton isLoading={loading} disabled={resendOtpLoading} startIcon={<Send />} color="secondary" fullWidth type="submit">
                    Verify otp
                </UIButton>
                <UIButtonWithTimer disabledTime={120000} isLoading={resendOtpLoading} startIcon={<Send />} fullWidth color="secondary" onClick={resendOtpHandler}>
                    Resend
                </UIButtonWithTimer>
            </Stack>

            <Typography mt="0.5rem" width="100%" textAlign="center">
                <MuiLink component={Link} href={"/forgot-password"}>Update email? </MuiLink>
            </Typography>
        </Box>
    );
}

// export default Login;
