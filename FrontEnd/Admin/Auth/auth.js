async function login(email, password) {
    try {
        const response = await fetch('http://localhost:5007/api/Admin');
        const admins = await response.json();

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

document.getElementById("signInForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    await login(email, password);
});