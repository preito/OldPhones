import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as authApi from "../../api/authApi";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email…");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    authApi
      .verifyEmail({ token, email })
      .then((response) => {
        const msg = response.data;
        if (/already verified/i.test(msg)) {
          setStatus("Your email is already verified. Redirecting to sign in…");
        } else {
          setStatus("Your email has been verified! Redirecting to sign in…");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setStatus("Invalid or expired link.");
        } else {
          setStatus("Something went wrong. Please try again later.");
        }
      })
      .finally(() => {
        setTimeout(() => navigate("/signin"), 3000); // Change -- Let the user navigate in their own time.
      });
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
}
