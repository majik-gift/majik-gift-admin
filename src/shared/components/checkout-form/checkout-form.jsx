'use client'
import React, { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import UIButton from '../ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from '@mui/material';
import { useToast } from '@/shared/context/ToastContext';

const CheckoutForm = ({ handleClose, selectedOrder, handleConfirm }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState({
        payment: false,
        button: true,
    })
    const [errorMessage, setErrorMessage] = useState(null);
    const { addToast } = useToast();


    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(prev => ({ ...prev, payment: true }));
        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: window?.location?.href,
            },
            redirect: 'if_required'
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            handleConfirm();

        }
        setLoading(prev => ({ ...prev, payment: false }));
    };

    useEffect(() => {
        if (!elements) {
            return;
        }

        const paymentElement = elements.getElement('payment');
        if (paymentElement) {
            paymentElement.on('loaderstart', () => {
                setLoading(prev => ({ ...prev, button: true }));
            });

            paymentElement.on('ready', () => {
                setLoading(prev => ({ ...prev, button: false }));
            });
        }
    }, [elements]);


    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {/* <button disabled={!stripe}>Submit</button> */}
            {!loading?.button &&
                <UIButton isLoading={loading?.payment} disable={!stripe || loading?.payment || loading?.button} sx={{ mt: 2, width: '100%' }} type='submit'>
                    Pay ${Number(selectedOrder?.commission_fee)?.toFixed(2)}
                </UIButton>
            }
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    )
};

export default CheckoutForm;