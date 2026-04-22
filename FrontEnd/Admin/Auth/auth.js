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
        const newAdmin = {
            name,
            email,
            contactNumber,
            password_hash: password, // Note: In production, hash the password on the server
        };

        await adminAPI.create(newAdmin);

        // Clear error if success
        document.getElementById("signUpError").textContent = "";
        document.getElementById("signUpSuccess").textContent = "Account created successfully! Redirecting to sign in...";

        setTimeout(() => {
            window.location.href = "signin.html";
        }, 2000);

    } catch (error) {
        console.error(error);
        document.getElementById("signUpError").textContent = "Failed to create account. Please try again.";
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