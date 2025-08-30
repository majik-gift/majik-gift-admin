"use client"

import { useEffect, useState } from "react";

import { UIButton } from "@/shared/components";

const UIButtonWithTimer = ({
    disabledTime = 0, // time in milliseconds to disable the button
    buttonKey = "UIButtonTimer", // unique key to store timer in localStorage
    isLoading = false,
    ...props // Pass down all props to UIButton
}) => {
    const [isDisabled, setIsDisabled] = useState(isLoading);
    const [remainingTime, setRemainingTime] = useState(0);

    // Function to display time in "mm:ss" or "ss"
    const formatTime = () => {
        if (remainingTime >= 60) {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            return `${minutes}m ${seconds}s`;
        } else {
            return `${remainingTime}s`;
        }
    };

    useEffect(() => {
        const savedTime = localStorage.getItem(buttonKey);
        const currentTime = Date.now();

        if (savedTime) {
            const timeDiff = Math.floor((savedTime - currentTime) / 1000); // Difference in seconds
            if (timeDiff > 0) {
                setRemainingTime(timeDiff);
                setIsDisabled(true);
            }
        }

        let timer;
        if (isLoading || isDisabled) {
            if (disabledTime > 0) {
                if (!remainingTime) {
                    setRemainingTime(disabledTime / 1000); // Initialize the countdown in seconds
                    localStorage.setItem(buttonKey, currentTime + disabledTime); // Store the expiration timestamp in localStorage
                }

                timer = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(timer);
                            setIsDisabled(false);
                            localStorage.removeItem(buttonKey); // Remove the timer from localStorage
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }, 1000);
            }
        }

        return () => {
            clearInterval(timer);
        };
    }, [isLoading, disabledTime, buttonKey, remainingTime]);

    return (
        <UIButton
            disabled={isLoading || isDisabled}
            isLoading={isLoading}
            {...props} // Spread remaining props to the UIButton component
        >
            {isDisabled && remainingTime > 0 ? formatTime() : props.children}
        </UIButton>
    );
};

export default UIButtonWithTimer;
