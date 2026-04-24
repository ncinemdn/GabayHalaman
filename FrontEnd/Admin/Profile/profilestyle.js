// Logout function
function logout() {
    // Clear admin session from localStorage
    localStorage.removeItem('admin');
    // Redirect to signin page
    window.location.href = '../../Admin/Auth/signin.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const ADMIN_KEY = 'admin';

    const currentAdmin = loadAdminSession();
    if (!currentAdmin) {
        window.location.href = '../../Admin/Auth/signin.html';
        return;
    }

    let profile = {
        fullName: 'Admin',
        role: 'Administrator',
        email: '',
        phone: ''
    };

    try {
        const adminData = await adminAPI.getById(currentAdmin.admin_id);
        profile.fullName = adminData.full_name || adminData.name || profile.fullName;
        profile.email = adminData.email || profile.email;
        profile.phone = adminData.phone || profile.phone;
    } catch (error) {
        console.error('Failed to fetch admin data:', error);
    }

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
    const transactionLogBody = document.getElementById('transactionLogBody');

    renderProfile(profile);
    await loadAdminLogs();

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
        profileEditForm.addEventListener('submit', async (event) => {
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
            await saveProfile(profile);
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
        passwordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            passwordError.textContent = '';

            const current = currentPassword.value;
            const nextPass = newPassword.value;
            const confirmPass = confirmPassword.value;

            if (nextPass !== confirmPass) {
                passwordError.textContent = 'New passwords do not match.';
                return;
            }

            if (nextPass.length < 6) {
                passwordError.textContent = 'New password must be at least 6 characters.';
                return;
            }

            try {
                const success = await adminAPI.changePassword(currentAdmin.admin_id, {
                    currentPassword: current,
                    newPassword: nextPass
                });

                if (success) {
                    passwordForm.reset();
                    closePasswordModal();
                    showToast('Password changed successfully.');
                } else {
                    passwordError.textContent = 'Current password is incorrect.';
                }
            } catch (error) {
                console.error('Password change error:', error);
                passwordError.textContent = 'Error changing password: ' + error.message;
            }
        });
    }

    if (logSearchInput) {
        logSearchInput.addEventListener('keyup', (e) => {
            const term = (e.target.value || '').toLowerCase();
            const rows = transactionLogBody ? transactionLogBody.querySelectorAll('tr') : [];
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    async function loadAdminLogs() {
        if (!transactionLogBody) {
            return;
        }

        try {
            const logs = await adminLogsAPI.getAll();
            if (!Array.isArray(logs) || logs.length === 0) {
                transactionLogBody.innerHTML = '<tr><td colspan="5" class="placeholder">No transaction logs available.</td></tr>';
                return;
            }

            transactionLogBody.innerHTML = logs.map(log => `
                <tr>
                    <td><strong>${log.admin_log_id ? '#LOG-' + log.admin_log_id : 'N/A'}</strong></td>
                    <td>${log.created_at || log.createdAt || ''}</td>
                    <td>${log.action || log.description || 'No details'}</td>
                    <td>${log.module || ''}</td>
                    <td><span class="status-badge ${String(log.status || '').toLowerCase() === 'success' ? 'success' : 'warning'}">${log.status || 'Unknown'}</span></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Failed to load admin logs:', error);
            transactionLogBody.innerHTML = '<tr><td colspan="5" class="placeholder">Unable to load transaction logs.</td></tr>';
        }
    }

    async function saveProfile(data) {
        if (!currentAdmin || !currentAdmin.admin_id) {
            return;
        }

        try {
            await adminAPI.update({
                ...currentAdmin,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone
            });
        } catch (error) {
            console.warn('Failed to save profile to backend:', error);
        }
    }

    function renderProfile(data) {
        if (heroName) heroName.textContent = data.fullName;
        if (headerName) headerName.textContent = data.fullName;
        if (detailFullName) detailFullName.textContent = data.fullName;
        if (detailRole) detailRole.textContent = data.role;
        if (detailEmail) detailEmail.textContent = data.email;
        if (detailPhone) detailPhone.textContent = data.phone;
    }

    function loadAdminSession() {
        try {
            return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
        } catch (error) {
            return null;
        }
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

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});