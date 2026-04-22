async function login(email, password) {
    try {
        const admins = await adminAPI.getAll();

        const user = admins.find(a => a.email === email);

        if (!user) {
            document.getElementById("signInError").textContent = "User not found";
            return;
        }

        if (user.password_hash !== password) {
            document.getElementById("signInError").textContent = "Incorrect password";
            return;
        }

        // Clear error if success
        document.getElementById("signInError").textContent = "";

        // Save session
        localStorage.setItem("admin", JSON.stringify(user));

        window.location.href = "../Dashboard/dashboard.html";

    } catch (error) {
        console.error(error);
        document.getElementById("signInError").textContent = "Server error";
    }
}

async function signup(name, email, contactNumber, password) {
    try {
        // Validate inputs
        if (!name || !email || !contactNumber || !password) {
            document.getElementById("signUpError").textContent = "All fields are required";
            return;
        }

        // Match the backend Admin model property names
        const newAdmin = {
            full_name: name,           // Backend expects 'full_name', not 'name'
            email: email,
            phone: contactNumber,      // Backend expects 'phone', not 'contactNumber'
            password_hash: password,
            created_at: new Date().toISOString(),  // Add timestamp
            updated_at: new Date().toISOString(),  // Add timestamp
        };

        console.log('Sending admin data:', newAdmin);

        const response = await adminAPI.create(newAdmin);
        
        console.log('API Response:', response);

        // Clear error if success
        document.getElementById("signUpError").textContent = "";
        document.getElementById("signUpSuccess").textContent = "Account created successfully! Redirecting to sign in...";

        setTimeout(() => {
            window.location.href = "signin.html";
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        
        // Provide specific error messages
        if (error.message.includes('409') || error.message.includes('conflict')) {
            document.getElementById("signUpError").textContent = "Email already exists";
        } else if (error.message.includes('400') || error.message.includes('validation')) {
            document.getElementById("signUpError").textContent = "Invalid input data";
        } else if (error.message.includes('duplicate') || error.message.includes('Duplicate')) {
            document.getElementById("signUpError").textContent = "Email already registered. Please use a different email.";
        } else {
            document.getElementById("signUpError").textContent = "Failed to create account: " + error.message;
        }
    }
}

// Sign In form handler
if (document.getElementById("signInForm")) {
    document.getElementById("signInForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("signinEmail").value;
        const password = document.getElementById("signinPassword").value;

        await login(email, password);
    });
}

// Sign Up form handler
if (document.getElementById("signUpForm")) {
    document.getElementById("signUpForm").addEventListener("submit", async function (e) {
        e.preventDefault();

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

async function sendRecoveryCodeToEmail(email) {
    await apiRequest('/admin/forgot-password/send-code', 'POST', {
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

// Forgot Password form handler
if (document.getElementById("forgotPasswordForm")) {
    let isCodeVerified = false;

    const forgotForm = document.getElementById("forgotPasswordForm");
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