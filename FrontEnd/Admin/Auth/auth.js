async function login(email, password) {
    try {
        const response = await adminAPI.login({
            email: email,
            password: password
        });

        // save session
        localStorage.setItem("admin", JSON.stringify(response));

        window.location.href = "../Dashboard/dashboard.html";

    } catch (error) {
        document.getElementById("signInError").textContent =
            error.message?.includes("verify")
                ? "Please verify your email first."
                : error.message?.includes("password")
                ? "Incorrect password."
                : error.message || "Login failed";
    }
}

async function signup(name, email, contactNumber, password) {
    try {
        if (!name || !email || !contactNumber || !password) {
            document.getElementById("signUpError").textContent = "All fields are required";
            return;
        }

        const data = {
            full_name: name,
            email: email,
            phone: contactNumber,
            password_hash: password
        };

        await adminAPI.signup(data);

        document.getElementById("signUpError").textContent = "";
        document.getElementById("signUpSuccess").textContent =
            "Verification code sent to your email!";

        localStorage.setItem("tempPassword", password);
        localStorage.setItem("verifyEmail", email);

        openVerificationModal();
        startCountdown();

    } catch (error) {
        document.getElementById("signUpError").textContent =
            error.message || "Signup failed";
    }
}

async function verifyAccount() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || localStorage.getItem("verifyEmail");
    const codeInput = document.getElementById("signupVerifyCode") || document.getElementById("code");
    const verifyError = document.getElementById("verifyError");
    const code = codeInput ? codeInput.value.trim() : "";

    if (!code) {
        if (verifyError) {
            verifyError.textContent = "Please enter the verification code.";
        } else {
            alert("Please enter the verification code.");
        }
        return;
    }
    try {
        if (!email) {
            if (verifyError) {
                verifyError.textContent = "Missing email. Please sign up again.";
            } else {
                alert("Missing email. Please sign up again.");
            }
            return;
        }

        if (verifyError) {
            verifyError.textContent = "";
        }

        await adminAPI.verify({
            email: email,
            code: code
        });

        localStorage.removeItem("verifyEmail");
        localStorage.removeItem("tempPassword");
        closeVerificationModal();
        window.location.href = "signin.html";

    } catch (error) {
        if (verifyError) {
            verifyError.textContent = "Invalid or expired code";
        } else {
            alert("Invalid or expired code");
        }
    }
}

function openVerificationModal() {
    const verifyModal = document.getElementById("verifyModal");
    const verifyInput = document.getElementById("signupVerifyCode");
    const verifyError = document.getElementById("verifyError");
    const authPanel = document.querySelector(".auth-panel");

    if (!verifyModal) {
        return;
    }

    verifyModal.classList.add("is-open");
    verifyModal.setAttribute("aria-hidden", "false");
    if (authPanel) {
        authPanel.classList.add("verification-active");
    }

    if (verifyError) {
        verifyError.textContent = "";
    }

    if (verifyInput) {
        verifyInput.value = "";
        verifyInput.focus();
    }
}

function closeVerificationModal() {
    const verifyModal = document.getElementById("verifyModal");
    const authPanel = document.querySelector(".auth-panel");

    if (!verifyModal) {
        return;
    }

    verifyModal.classList.remove("is-open");
    verifyModal.setAttribute("aria-hidden", "true");
    if (authPanel) {
        authPanel.classList.remove("verification-active");
    }
    clearInterval(countdownInterval);
}

function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll(".password-toggle[data-toggle-target]");

    toggleButtons.forEach(function (button) {
        const targetId = button.getAttribute("data-toggle-target");
        const targetInput = document.getElementById(targetId);

        if (!targetInput) {
            return;
        }

        button.textContent = "Show";
        button.setAttribute("aria-label", "Show password");

        button.addEventListener("click", function () {
            const isHidden = targetInput.type === "password";
            targetInput.type = isHidden ? "text" : "password";
            button.classList.toggle("is-visible", isHidden);
            button.textContent = isHidden ? "Hide" : "Show";
            button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        });
    });
}

function clearFormOnLoad(formElement) {
    if (!formElement) {
        return;
    }

    const clear = function () {
        formElement.reset();
        const inputs = formElement.querySelectorAll("input");
        inputs.forEach(function (input) {
            if (input.type !== "hidden") {
                input.value = "";
            }
        });
    };

    clear();
    requestAnimationFrame(clear);
    setTimeout(clear, 80);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth page loaded, attaching event handlers...');
    initializePasswordToggles();
    
    const resendBtn = document.getElementById("resendBtn");
    const verifyBtn = document.getElementById("verifyBtn");
    const closeVerifyModalBtn = document.getElementById("closeVerifyModal");
    const verifyModal = document.getElementById("verifyModal");
    const verifyCodeInput = document.getElementById("signupVerifyCode");

    if (resendBtn) {
        resendBtn.addEventListener("click", resendCode);
    }

    if (verifyBtn) {
        verifyBtn.addEventListener("click", verifyAccount);
    }

    if (verifyCodeInput) {
        verifyCodeInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                verifyAccount();
            }
        });
    }

    if (closeVerifyModalBtn) {
        closeVerifyModalBtn.addEventListener("click", closeVerificationModal);
    }

    if (verifyModal) {
        verifyModal.addEventListener("click", function (event) {
            if (event.target === verifyModal) {
                closeVerificationModal();
            }
        });
    }

    // start timer automatically when on verify page
    if (window.location.pathname.includes("verify.html")) {
        startCountdown();
    }

    const signInForm = document.getElementById("signInForm");
    console.log('Sign-in form found:', !!signInForm);
    clearFormOnLoad(signInForm);
    
    if (signInForm) {
        signInForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const btn = signInForm.querySelector("button");
            btn.disabled = true;

            const email = document.getElementById("signinEmail").value;
            const password = document.getElementById("signinPassword").value;

            try {
                await login(email, password);
            } finally {
                btn.disabled = false;
            }
        });
    }

    const signUpForm = document.getElementById("signUpForm");
    console.log('Sign-up form found:', !!signUpForm);
    clearFormOnLoad(signUpForm);
    
    if (signUpForm) {
        signUpForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log('Sign-up form submitted');

            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const contactNumber = document.getElementById("signupContact").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("signupConfirmPassword").value;

            if (password !== confirmPassword) {
                document.getElementById("signUpError").textContent = "Passwords do not match";
                return;
            }

            await signup(name, email, contactNumber, password);
        });
    }

    const forgotForm = document.getElementById("forgotPasswordForm");
    console.log('Forgot password form found:', !!forgotForm);
    clearFormOnLoad(forgotForm);
    
    if (forgotForm) {
        let isCodeVerified = false;

        const forgotEmailInput = document.getElementById("forgotEmail");
        const forgotCodeInput = document.getElementById("forgotCode");
        const newPasswordInput = document.getElementById("newPassword");
        const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
        const passwordFields = document.getElementById("passwordFields");
        const forgotError = document.getElementById("forgotError");
        const forgotSuccess = document.getElementById("forgotSuccess");
        const sendCodeBtn = document.getElementById("sendCodeBtn");
        const submitBtn = forgotForm.querySelector("button[type='submit']");

        if (sendCodeBtn) {
            sendCodeBtn.addEventListener("click", async function () {
                const email = forgotEmailInput.value.trim();

                forgotError.textContent = "";
                forgotSuccess.textContent = "";

                if (!email) {
                    forgotError.textContent = "Enter your email first.";
                    return;
                }

                sendCodeBtn.disabled = true;

                try {
                    await sendRecoveryCodeToEmail(email);

                    isCodeVerified = false;
                    passwordFields.classList.add("is-hidden");
                    newPasswordInput.value = "";
                    confirmNewPasswordInput.value = "";
                    if (submitBtn) {
                        submitBtn.textContent = "Send Request";
                    }

                    forgotSuccess.textContent = "Code sent to your email. Check your inbox and enter the authentication code.";
                } catch (error) {
                    console.error(error);
                    forgotError.textContent = error.message || "Failed to send code from server.";
                } finally {
                    sendCodeBtn.disabled = false;
                }
            });
        }

        forgotForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = forgotEmailInput.value.trim();
            const enteredCode = forgotCodeInput.value.trim();
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmNewPasswordInput.value;
            forgotError.textContent = "";
            forgotSuccess.textContent = "";

            if (!email) {
                forgotError.textContent = "Email is required.";
                return;
            }

            if (!enteredCode) {
                forgotError.textContent = "Authentication code is required.";
                return;
            }

            try {
                await verifyRecoveryCode(email, enteredCode);
            } catch (error) {
                forgotError.textContent = error.message || "Invalid authentication code.";
                return;
            }

            if (!isCodeVerified) {
                isCodeVerified = true;
                passwordFields.classList.remove("is-hidden");
                forgotSuccess.textContent = "Code verified. Enter your new password and click Send Request again.";
                if (submitBtn) {
                    submitBtn.textContent = "Reset Password";
                }
                return;
            }

            if (!newPassword || !confirmPassword) {
                forgotError.textContent = "Enter and confirm your new password.";
                return;
            }

            if (newPassword.length < 8) {
                forgotError.textContent = "New password must be at least 8 characters.";
                return;
            }

            if (newPassword !== confirmPassword) {
                forgotError.textContent = "New password and confirm password do not match.";
                return;
            }

            try {
                await resetPasswordByEmail(email, newPassword);
                forgotSuccess.textContent = "Password updated successfully. Redirecting to sign in...";

                setTimeout(function () {
                    window.location.href = "signin.html";
                }, 1400);
            } catch (error) {
                console.error(error);
                forgotError.textContent = error.message || "Failed to reset password.";
            }
        });
    }
});

async function sendRecoveryCodeToEmail(email) {
    await apiRequest('/admin/resend-verification', 'POST', {
            email,
    });
}

async function verifyRecoveryCode(email, enteredCode) {
    await apiRequest('/admin/forgot-password/verify-code', 'POST', {
        email,
        code: enteredCode,
    });
}

async function resetPasswordByEmail(email, newPassword) {
    await apiRequest('/admin/forgot-password/reset-password', 'POST', {
        email,
        newPassword,
    });
}

async function resendCode() {
    const email = localStorage.getItem("verifyEmail");
    const verifyError = document.getElementById("verifyError");

    if (!isVerificationCodeExpired) {
        if (verifyError) {
            verifyError.textContent = "You can resend only after the current code expires.";
        }
        return;
    }

    if (!email) {
        if (verifyError) {
            verifyError.textContent = "Email not found. Please sign up again.";
        } else {
            alert("Email not found. Please sign up again.");
        }
        return;
    }

    try {
        await apiRequest('/admin/resend-verification', 'POST', {
            email: email
        });

        if (verifyError) {
            verifyError.textContent = "Verification code resent.";
        } else {
            alert("Verification code resent!");
        }
        startCountdown();

    } catch (error) {
        if (verifyError) {
            verifyError.textContent = "Failed to resend code.";
        } else {
            alert("Failed to resend code.");
        }
    }
}

let countdownInterval;
let isVerificationCodeExpired = false;

function setResendButtonState(disabled) {
    const resendBtn = document.getElementById("resendBtn");

    if (!resendBtn) {
        return;
    }

    resendBtn.disabled = disabled;
}

function startCountdown(duration = 300) {
    let time = duration;

const timerText = document.getElementById("timerText");
if (!timerText) return;
    clearInterval(countdownInterval);
    isVerificationCodeExpired = false;
    setResendButtonState(true);

    countdownInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        timerText.textContent =
            `Code expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (time <= 0) {
            clearInterval(countdownInterval);
            timerText.textContent = "Code expired. Please resend.";
            isVerificationCodeExpired = true;
            setResendButtonState(false);
        }

        time--;
    }, 1000);
}

