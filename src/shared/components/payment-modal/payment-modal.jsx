"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    IconButton,
    Typography,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CloseIcon from "@mui/icons-material/Close";
import { CheckoutForm } from "..";

const PaymentModal = ({
    open,
    handleClose,
    TransitionComponent,
    handleConfirm,
    selectedOrder,
    clientSecret,
}) => {

    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    return (
        <Stack>
            <Dialog
                open={open}
                style={{ width: "100%" }}
            // onClose={handleClose}
            // TransitionComponent={TransitionComponent}
            >
                <DialogTitle
                    width={{ xs: "100%", sm: "500px", md: "600px" }}
                    overflow={"hidden"}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    gap={3}
                >
                    <Typography
                        fontWeight={"Bold"}
                        sx={{
                            typography: { xs: "h3", md: "h4" },
                            marginTop: { md: "30px" },
                            fontFamily: "Libre Bodoni",
                        }}
                    >
                        Payment Modal
                    </Typography>
                    <Typography
                        textAlign={"center"}
                        width={{ xs: "80%", sm: "70%", md: "60%" }}
                        sx={{ typography: { xs: "body2", md: "body1" } }}
                    >
                        To place an order you must need to logged into your account.{" "}
                    </Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    {clientSecret ? (
                        <Elements
                            options={{ clientSecret: clientSecret }}
                            stripe={stripePromise}
                        >
                            <CheckoutForm handleClose={handleClose} selectedOrder={selectedOrder} handleConfirm={handleConfirm} />
                        </Elements>
                    ) : (
                        <Typography color="error">Error: Missing client secret</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Stack>
    );
};

export default PaymentModal;
