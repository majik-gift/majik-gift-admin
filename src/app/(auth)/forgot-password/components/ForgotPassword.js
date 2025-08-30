"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowForward, Mail } from "@mui/icons-material";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { useApiRequest } from "@/hooks/useApiRequest";
import { useToast } from "@/shared/context/ToastContext";
import { forgetPass } from "@/store/auth/auth.thunks";
import { UIButton, UIInputField } from "@components";
import Link from "next/link";
import { forgetPassSchema } from "../schema";

export default function ForgotPassword({ onRequestChangeStep, setEmail }) {
    const { addToast } = useToast();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(forgetPassSchema),
        defaultValues: {
            email: "",
        },
    });

    const [execute, loading,] = useApiRequest(forgetPass, {
        initLoading: false,
        initFetch: false,
    });



    const forgetPassSubmitHandler = async (data) => {
        const payload = {
            email: data.email,
        };
        await execute(payload);
        onRequestChangeStep()
        setEmail(data.email)
        addToast({
            message: "Please check your email for the OTP we just sent to proceed.",
            severity: 'info', // 'error', 'warning', 'info', 'success'
        });

    };

    return (
        <Box
            component={"form"}
            sx={{ width: "100%" }}
            onSubmit={handleSubmit(forgetPassSubmitHandler)}
        >
            <Typography color="primary" fontSize="1.5rem" fontWeight={900} >
                Forgot Password
            </Typography>
            <Typography>Use the email you used to create your account before.</Typography>

            <Stack mt="2rem" spacing={2}>
                <UIInputField name="email" errorMessage={errors.email?.message} control={control} placeholder="Email" startIcon={<Mail color="secondary" />} />

            </Stack>


            <Box width="100%" mt="2rem">
                <UIButton isLoading={loading} startIcon={<ArrowForward />} color="secondary" fullWidth type="submit">
                    Next
                </UIButton>
            </Box>

            <Typography mt="0.5rem" width="100%" textAlign="center">
                Already have a account? <MuiLink component={Link} href={"/login"}>Login</MuiLink>
            </Typography>
        </Box>
    );
}

// export default Login;
