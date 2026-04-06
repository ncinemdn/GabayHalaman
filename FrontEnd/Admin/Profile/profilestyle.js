document.addEventListener('DOMContentLoaded', () => {
    const PROFILE_KEY = 'gh_admin_profile_data';
    const PASSWORD_KEY = 'gh_admin_profile_password';

    const defaultProfile = {
        fullName: 'Bae Suzy',
        role: 'Administrator',
        email: 'baesuzy22@gmail.com',
        phone: '0912-987-6543'
    };

    const profile = loadProfile();

    const heroName = document.getElementById('heroName');
    const headerName = document.querySelector('.user-name');
    const detailFullName = document.getElementById('detailFullName');
    const detailRole = document.getElementById('detailRole');
    const detailEmail = document.getElementById('detailEmail');
    const detailPhone = document.getElementById('detailPhone');

    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const profileEditForm = document.getElementById('profileEditForm');
    const profileEditError = document.getElementById('profileEditError');
    const editFullName = document.getElementById('editFullName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editRole = document.getElementById('editRole');

    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordModal = document.getElementById('passwordModal');
    const closePasswordModalBtn = document.getElementById('closePasswordModalBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const passwordForm = document.getElementById('passwordForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');

    const profileToast = document.getElementById('profileToast');

    const logSearchInput = document.getElementById('logSearchInput');
    const tableRows = document.querySelectorAll('.transaction-table tbody tr');

    renderProfile(profile);

    if (editProfileBtn && profileEditForm) {
        editProfileBtn.addEventListener('click', () => {
            profileEditError.textContent = '';
            editFullName.value = profile.fullName;
            editEmail.value = profile.email;
            editPhone.value = profile.phone;
            editRole.value = profile.role;
            profileEditForm.classList.remove('hidden');
            editFullName.focus();
        });
    }

    if (cancelEditBtn && profileEditForm) {
        cancelEditBtn.addEventListener('click', () => {
            profileEditError.textContent = '';
            profileEditForm.classList.add('hidden');
        });
    }

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', (event) => {
            event.preventDefault();
            profileEditError.textContent = '';

            const fullName = editFullName.value.trim();
            const email = editEmail.value.trim();
            const phone = editPhone.value.trim();

            if (!fullName || !email || !phone) {
                profileEditError.textContent = 'Please complete all required fields.';
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                profileEditError.textContent = 'Please enter a valid email address.';
                return;
            }

            profile.fullName = fullName;
            profile.email = email;
            profile.phone = phone;
            saveProfile(profile);
            renderProfile(profile);
            profileEditForm.classList.add('hidden');
            showToast('Profile updated successfully.');
        });
    }

    if (changePasswordBtn && passwordModal) {
        changePasswordBtn.addEventListener('click', () => {
            openPasswordModal();
        });
    }

    if (closePasswordModalBtn) {
        closePasswordModalBtn.addEventListener('click', closePasswordModal);
    }

    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', closePasswordModal);
    }

    if (passwordModal) {
        passwordModal.addEventListener('click', (event) => {
            if (event.target === passwordModal) {
                closePasswordModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && passwordModal && !passwordModal.classList.contains('hidden')) {
            closePasswordModal();
        }
    });

    if (passwordForm) {
        passwordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            passwordError.textContent = '';

            const current = currentPassword.value;
            const nextPass = newPassword.value;
            const confirmPass = confirmPassword.value;
            const storedPassword = localStorage.getItem(PASSWORD_KEY) || 'admin123';

            if (current !== storedPassword) {
                passwordError.textContent = 'Current password is incorrect.';
                return;
            }

            if (nextPass.length < 6) {
                passwordError.textContent = 'New password must be at least 6 characters.';
                return;
            }

            if (nextPass !== confirmPass) {
                passwordError.textContent = 'New password and confirmation do not match.';
                return;
            }

            if (nextPass === current) {
                passwordError.textContent = 'New password must be different from current password.';
                return;
            }

            localStorage.setItem(PASSWORD_KEY, nextPass);
            closePasswordModal();
            showToast('Password changed successfully.');
        });
    }

    if (logSearchInput && tableRows.length > 0) {
        logSearchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();

            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    function renderProfile(data) {
        if (heroName) heroName.textContent = data.fullName;
        if (headerName) headerName.textContent = data.fullName;
        if (detailFullName) detailFullName.textContent = data.fullName;
        if (detailRole) detailRole.textContent = data.role;
        if (detailEmail) detailEmail.textContent = data.email;
        if (detailPhone) detailPhone.textContent = data.phone;
    }

    function loadProfile() {
        try {
            const saved = localStorage.getItem(PROFILE_KEY);
            if (!saved) {
                return { ...defaultProfile };
            }

            const parsed = JSON.parse(saved);
            return {
                fullName: parsed.fullName || defaultProfile.fullName,
                role: parsed.role || defaultProfile.role,
                email: parsed.email || defaultProfile.email,
                phone: parsed.phone || defaultProfile.phone
            };
        } catch (error) {
            return { ...defaultProfile };
        }
    }

    function saveProfile(data) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    }

    function openPasswordModal() {
        passwordError.textContent = '';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        passwordModal.classList.remove('hidden');
        currentPassword.focus();
    }

    function closePasswordModal() {
        passwordModal.classList.add('hidden');
    }

    function showToast(message) {
        if (!profileToast) return;
        profileToast.textContent = message;
        profileToast.classList.remove('hidden');
        profileToast.classList.add('show');

        window.setTimeout(() => {
            profileToast.classList.remove('show');
            profileToast.classList.add('hidden');
        }, 2200);
    }
});