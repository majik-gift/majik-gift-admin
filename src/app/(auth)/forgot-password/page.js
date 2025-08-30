"use client";

import useQueryParams from "@/hooks/useQueryParams";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOtp from "./components/VerifyOTP";

export default function ForgotPasswordPage() {

  const router = useRouter()

  const { getQueryParam, updateQueryParam, removeQueryParam } = useQueryParams();
  const [forgetPassSteps, setForgetPassSteps] = useState("forget")
  const [email, setEmail] = useState("")
  const [otpId, setOtpId] = useState("")

  useEffect(() => {
    const screen = getQueryParam("screen")
    if (!screen) {
      setForgetPassSteps("forget")
    } else {
      setForgetPassSteps(screen.step)
    }
  }, [getQueryParam])



  const renderSteps = () => {
    switch (forgetPassSteps) {
      case "forget":
        return <ForgotPassword
          onRequestChangeStep={() => {
            updateQueryParam("screen", { step: "verify" })
            setForgetPassSteps("verify")
          }}
          setEmail={setEmail}
        />;
      case "verify":
        return <VerifyOtp
          onRequestChangeStep={() => setForgetPassSteps("reset")}
          email={email}
          setOtpId={setOtpId}
        />;
      case "reset":
        return <ResetPassword
          otpId={otpId}
        />;
      default:
        return null;  // Optionally return null or a fallback UI
    }
  };

  return renderSteps();


}

// export default Login;
