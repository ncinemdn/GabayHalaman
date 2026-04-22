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