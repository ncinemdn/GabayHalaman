async function login(email, password) {
    try {
        console.log('Fetching all admins from API...');
        const admins = await adminAPI.getAll();
        console.log('Admins fetched:', admins);

        if (!admins || !Array.isArray(admins)) {
            console.error('API did not return an array of admins:', admins);
            document.getElementById("signInError").textContent = "Server returned invalid data";
            return;
        }

        // Trim email for case-insensitive and whitespace-safe comparison
        const trimmedEmail = email.trim().toLowerCase();
        const user = admins.find(a => (a.email || '').trim().toLowerCase() === trimmedEmail);
        console.log('User found:', user);

        if (!user) {
            document.getElementById("signInError").textContent = "User not found";
            return;
        }

        console.log('Checking password...');
        console.log('Stored hash:', user.password_hash);
        console.log('Entered password:', password);

        if ((user.password_hash || '').trim() !== (password || '').trim()) {
            console.error('Password mismatch. Stored:', user.password_hash, 'Entered:', password);
            document.getElementById("signInError").textContent = "Incorrect password";
            return;
        }

        // Clear error if success
        console.log('Login successful, saving session and redirecting...');
        document.getElementById("signInError").textContent = "";

        // Save session
        localStorage.setItem("admin", JSON.stringify(user));

        window.location.href = "../Dashboard/dashboard.html";

    } catch (error) {
        console.error('Login error:', error);
        console.error('Full error stack:', error.stack);
        document.getElementById("signInError").textContent = "Server error: " + error.message;
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
        console.log('Response type:', typeof response);

        if (!response) {
            console.error('API returned falsy response:', response);
            document.getElementById("signUpError").textContent = "Failed to create account. Email may already exist or server error.";
            return;
        }

        // Clear error if success
        console.log('Account created successfully');
        document.getElementById("signUpError").textContent = "";
        document.getElementById("signUpSuccess").textContent = "Account created successfully! Redirecting to sign in...";

        setTimeout(() => {
            window.location.href = "signin.html";
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        console.error('Error message:', error.message);
        
        // Provide specific error messages
        if (error.message.includes('409') || error.message.includes('conflict')) {
            document.getElementById("signUpError").textContent = "Email already exists";
        } else if (error.message.includes('400') || error.message.includes('validation')) {
            document.getElementById("signUpError").textContent = "Invalid input data";
        } else if (error.message.includes('duplicate') || error.message.includes('Duplicate')) {
            document.getElementById("signUpError").textContent = "Email already registered. Please use a different email.";
        } else {
            document.getElementById("signUpError").textContent = "Error: " + error.message;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth page loaded, attaching event handlers...');
    
    const signInForm = document.getElementById("signInForm");
    console.log('Sign-in form found:', !!signInForm);
    
    if (signInForm) {
        signInForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log('Sign-in form submitted');

            const email = document.getElementById("signinEmail").value;
            const password = document.getElementById("signinPassword").value;

            console.log('Attempting login with email:', email);
            await login(email, password);
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