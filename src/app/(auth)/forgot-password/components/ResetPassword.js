"use client";

import { UIButton, UIPasswordField } from "@components";
import { yupResolver } from "@hookform/resolvers/yup";
import { LockReset } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { resetPasswordSchema } from "../schema";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useToast } from "@/shared/context/ToastContext";
import { resetPassword } from "@/store/auth/auth.thunks";


export default function ResetPassword({ otpId }) {
    const { addToast } = useToast();
    const router = useRouter()

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const [execute, loading] = useApiRequest(resetPassword, {
        initLoading: false,
        initFetch: false,
    });


    const resetPasswordSubmitHandler = async (data) => {
        const payload = {
            otp_id: otpId,
            new_password: data.password,
        };

        await execute(payload);
        addToast({
            message: "Your password has been reset successfully. Please log in to continue.",
            severity: 'success', // 'error', 'warning', 'info', 'success'
        });
        router.push("/login")

    };

    return (
        <Box
            component={"form"}
            sx={{ width: "100%" }}

            onSubmit={handleSubmit(resetPasswordSubmitHandler)}
        >
            <Typography color="primary" fontSize="1.5rem" fontWeight={900} >
                Reset password
            </Typography>
            <Typography>Please entry your new password</Typography>

            <Stack mt="2rem" spacing={2}>
                <UIPasswordField name="password" errorMessage={errors.password?.message} control={control}
                    placeholder="New password"
                />

                <UIPasswordField name="confirmPassword" errorMessage={errors.confirmPassword?.message} control={control}
                    placeholder="Confirm password"

                />
            </Stack>


            <Box width="100%" mt="2rem">
                <UIButton isLoading={loading} startIcon={<LockReset />} color="secondary" fullWidth type="submit">
                    Reset
                </UIButton>
            </Box>
        </Box>
    );
}

// export default Login;
