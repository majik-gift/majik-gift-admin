"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowForward, Mail } from "@mui/icons-material";
import { Box, FormControl, FormHelperText, InputLabel, Link as MuiLink, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { useApiRequest } from "@/hooks/useApiRequest";
import { useToast } from "@/shared/context/ToastContext";
import { forgetPass } from "@/store/auth/auth.thunks";
import { UIButton, UIInputField } from "@components";
import Link from "next/link";
import { forgetPassSchema } from "../schema";

const ADMIN_ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "light_worker", label: "Light Worker" },
  { value: "stall_holder", label: "Stall Holder" },
];

export default function ForgotPassword({ onRequestChangeStep, setEmail }) {
    const { addToast } = useToast();
    const [role, setRole] = useState("admin");

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
            role,
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
                <FormControl fullWidth>
                    <InputLabel id="admin-forgot-role-label">Account type</InputLabel>
                    <Select
                        labelId="admin-forgot-role-label"
                        id="admin-forgot-role"
                        value={role}
                        label="Account type"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        {ADMIN_ROLE_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select which account you need to reset</FormHelperText>
                </FormControl>
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
