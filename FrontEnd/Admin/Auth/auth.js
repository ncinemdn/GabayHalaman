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

        // 👉 REDIRECT TO VERIFY PAGE
        setTimeout(() => {
            localStorage.setItem("verifyEmail", email);

            window.location.href = `verify.html?email=${email}`;
        }, 1500);

    } catch (error) {
        document.getElementById("signUpError").textContent =
            error.message || "Signup failed";
    }
}

async function verifyAccount() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || localStorage.getItem("verifyEmail");
    const code = document.getElementById("code").value;

    if (!code) {
    alert("Please enter the verification code.");
    return;
}
    try {
        if (!email) {
            alert("Missing email. Please sign up again.");
            return;
        }

        await adminAPI.verify({
            email: email,
            code: code
        });
        // 👉 redirect to login
        localStorage.removeItem("verifyEmail");
            const password = localStorage.getItem("tempPassword");

            if (password) {
                const response = await adminAPI.login({
                    email: email,
                    password: password
                });

                localStorage.setItem("admin", JSON.stringify(response));
                localStorage.removeItem("tempPassword");

                window.location.href = "../Dashboard/dashboard.html";
            } else {
                window.location.href = "signin.html";
            }

    } catch (error) {
        alert("Invalid or expired code");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth page loaded, attaching event handlers...');
    
    const resendBtn = document.getElementById("resendBtn");

    if (resendBtn) {
        resendBtn.addEventListener("click", resendCode);
    }

    // start timer automatically when on verify page
    if (window.location.pathname.includes("verify.html")) {
        startCountdown();
    }

    const signInForm = document.getElementById("signInForm");
    console.log('Sign-in form found:', !!signInForm);
    
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

    if (!email) {
        alert("Email not found. Please sign up again.");
        return;
    }

    try {
        await apiRequest('/admin/forgot-password/send-code', 'POST', {
            email: email
        });

        alert("Verification code resent!");
        startCountdown();

    } catch (error) {
        alert("Failed to resend code.");
    }
}

let countdownInterval;

function startCountdown(duration = 300) {
    let time = duration;

const timerText = document.getElementById("timerText");
if (!timerText) return;
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        timerText.textContent =
            `Code expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (time <= 0) {
            clearInterval(countdownInterval);
            timerText.textContent = "Code expired. Please resend.";
        }

        time--;
    }, 1000);
}

