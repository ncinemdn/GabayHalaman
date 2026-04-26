// Logout function
function logout() {
    // Clear admin session from localStorage
    localStorage.removeItem('admin');
    // Redirect to signin page
    window.location.href = '../../Admin/Auth/signin.html';
}

document.addEventListener('DOMContentLoaded', async () => {

    const manageBtn = document.getElementById("manageAdminsBtn");

if (manageBtn) {
    manageBtn.addEventListener("click", () => {
        document.getElementById("adminSection").style.display = "block";
        loadAdmins();
    });
}

    const ADMIN_KEY = 'admin';
    const DEFAULT_PROFILE_PHOTO = 'cc.jpg';
    const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024;
    const SUPPORTED_PROFILE_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    let currentAdmin = loadAdminSession();

    const role = localStorage.getItem("role");

        if (role === "SuperAdmin") {
            const btn = document.getElementById("manageAdminsBtn");
            if (btn) btn.style.display = "block";
        }

    if (!currentAdmin) {
        window.location.href = '../../Admin/Auth/signin.html';
        return;
    }

    let adminRecord = { ...currentAdmin };
    let pendingPhotoDataUrl = '';
    let lastServerPhoto = '';

    let profile = {
        fullName: currentAdmin.full_name || currentAdmin.name || 'Admin',
        role: currentAdmin.role || 'Administrator',
        email: currentAdmin.email || '',
        phone: currentAdmin.phone || '',
        photo: currentAdmin.photo || ''
    };

    try {
        if (typeof adminAPI !== 'undefined' && Number.isFinite(Number(currentAdmin.admin_id))) {
            const adminData = await adminAPI.getById(currentAdmin.admin_id);
            adminRecord = {
                ...adminRecord,
                ...adminData
            };
            lastServerPhoto = String(adminData.photo || '').trim();
            profile.fullName = adminData.full_name || adminData.name || profile.fullName;
            profile.email = adminData.email || profile.email;
            profile.phone = adminData.phone || profile.phone;
            profile.photo = adminData.photo || profile.photo;
        }
    } catch (error) {
        console.error('Failed to fetch admin data:', error);
    }

    const heroName = document.getElementById('heroName');
    const headerName = document.querySelector('.user-name');
    const detailFullName = document.getElementById('detailFullName');
    const detailRole = document.getElementById('detailRole');
    const detailEmail = document.getElementById('detailEmail');
    const detailPhone = document.getElementById('detailPhone');
    const headerAvatarImage = document.getElementById('headerAvatarImage');
    const heroAvatarImage = document.getElementById('heroAvatarImage');

    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const profileEditForm = document.getElementById('profileEditForm');
    const profileEditError = document.getElementById('profileEditError');
    const editFullName = document.getElementById('editFullName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editRole = document.getElementById('editRole');
    const editPhotoInput = document.getElementById('editPhotoInput');
    const editPhotoPreview = document.getElementById('editPhotoPreview');
    const editPhotoFileName = document.getElementById('editPhotoFileName');

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

    window.addEventListener('gh:admin-log-created', () => {
        void loadAdminLogs();
    });

    if (editProfileBtn && profileEditForm) {
        editProfileBtn.addEventListener('click', () => {
            profileEditError.textContent = '';
            pendingPhotoDataUrl = '';
            editFullName.value = profile.fullName;
            editEmail.value = profile.email;
            editPhone.value = profile.phone;
            editRole.value = profile.role;
            if (editPhotoInput) {
                editPhotoInput.value = '';
            }
            updatePhotoPreview(profile.photo, 'Current photo');
            profileEditForm.classList.remove('hidden');
            editFullName.focus();
        });
    }

    if (cancelEditBtn && profileEditForm) {
        cancelEditBtn.addEventListener('click', () => {
            profileEditError.textContent = '';
            pendingPhotoDataUrl = '';
            if (editPhotoInput) {
                editPhotoInput.value = '';
            }
            profileEditForm.classList.add('hidden');
        });
    }

    if (editPhotoInput) {
        editPhotoInput.addEventListener('change', async () => {
            profileEditError.textContent = '';

            const selectedFile = editPhotoInput.files && editPhotoInput.files[0];
            if (!selectedFile) {
                pendingPhotoDataUrl = '';
                updatePhotoPreview(profile.photo, 'Current photo');
                return;
            }

            const validationMessage = validateProfilePhoto(selectedFile);
            if (validationMessage) {
                pendingPhotoDataUrl = '';
                editPhotoInput.value = '';
                updatePhotoPreview(profile.photo, 'Current photo');
                profileEditError.textContent = validationMessage;
                return;
            }

            try {
                pendingPhotoDataUrl = await readFileAsDataUrl(selectedFile);
                updatePhotoPreview(pendingPhotoDataUrl, selectedFile.name);
            } catch (error) {
                pendingPhotoDataUrl = '';
                editPhotoInput.value = '';
                updatePhotoPreview(profile.photo, 'Current photo');
                profileEditError.textContent = 'Unable to read the selected image. Please try again.';
            }
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

            const nextProfile = {
                ...profile,
                fullName,
                email,
                phone,
                photo: pendingPhotoDataUrl || profile.photo || ''
            };

            try {
                profile = await saveProfile(nextProfile);
                pendingPhotoDataUrl = '';
                if (editPhotoInput) {
                    editPhotoInput.value = '';
                }
                renderProfile(profile);
                profileEditForm.classList.add('hidden');
                showToast('Profile updated successfully.');
            } catch (error) {
                console.error('Profile update error:', error);
                profileEditError.textContent = error.message || 'Unable to update profile right now.';
            }
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
            const [logs, admins] = await Promise.all([
                adminLogsAPI.getAll(),
                (typeof adminAPI !== 'undefined' ? adminAPI.getAll() : Promise.resolve([]))
            ]);

            if (!Array.isArray(logs) || logs.length === 0) {
                transactionLogBody.innerHTML = '<tr><td colspan="5" class="placeholder">No transaction logs available.</td></tr>';
                return;
            }

            const adminNameById = new Map(
                (Array.isArray(admins) ? admins : []).map((admin) => [
                    String(admin.admin_id),
                    admin.full_name || admin.name || ('Admin #' + String(admin.admin_id || ''))
                ])
            );

            const sortedLogs = [...logs].sort((a, b) => {
                const aDate = new Date(a.created_at || a.createdAt || 0).getTime();
                const bDate = new Date(b.created_at || b.createdAt || 0).getTime();
                return bDate - aDate;
            });

            transactionLogBody.innerHTML = sortedLogs.map(log => {
                const logId = log.log_id || log.admin_log_id || 'N/A';
                const adminId = log.admin_id || log.adminId;
                const adminLabel = adminId ? (adminNameById.get(String(adminId)) || ('Admin #' + String(adminId))) : 'Unknown Admin';
                const createdAtRaw = log.created_at || log.createdAt || '';
                const createdAt = createdAtRaw ? new Date(createdAtRaw).toLocaleString('en-PH') : '';
                const actionText = log.action_performed || log.action || log.description || 'No details';
                const moduleText = log.module_used || log.module || '';
                const statusText = log.status || 'Unknown';
                const statusClass = String(statusText).toLowerCase() === 'success' ? 'success' : 'warning';

                return `
                <tr>
                    <td><strong>${logId !== 'N/A' ? '#LOG-' + logId : 'N/A'}</strong></td>
                    <td>${createdAt}</td>
                    <td>${actionText}<br><small>By: ${adminLabel}</small></td>
                    <td>${moduleText}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
            }).join('');
        } catch (error) {
            console.error('Failed to load admin logs:', error);
            transactionLogBody.innerHTML = '<tr><td colspan="5" class="placeholder">Unable to load transaction logs.</td></tr>';
        }
    }

    async function saveProfile(data) {
        if (!currentAdmin || !currentAdmin.admin_id) {
            throw new Error('Admin session not found. Please sign in again.');
        }

        const requestedPhotoValue = String(data.photo || '').trim();
        const requestedInlinePhoto = isInlineProfilePhoto(requestedPhotoValue);
        const shouldRequirePhotoChange = requestedInlinePhoto && requestedPhotoValue !== lastServerPhoto;

        const payload = {
            ...adminRecord,
            ...currentAdmin,
            admin_id: currentAdmin.admin_id,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            photo: data.photo || '',
            updated_at: new Date().toISOString()
        };

        const updated = await adminAPI.update(payload);
        if (updated === false) {
            throw new Error('Profile update was rejected by the server.');
        }

        let refreshedAdmin = payload;
        if (typeof adminAPI !== 'undefined' && Number.isFinite(Number(currentAdmin.admin_id))) {
            refreshedAdmin = await adminAPI.getById(currentAdmin.admin_id);
        }

        const persistedServerPhoto = String(refreshedAdmin?.photo || '').trim();
        const serverPhotoUnchanged = Boolean(lastServerPhoto) && persistedServerPhoto === lastServerPhoto;

        if (shouldRequirePhotoChange && (!persistedServerPhoto || serverPhotoUnchanged)) {
            throw new Error('Profile photo was not saved by the running admin API. Restart the backend so the latest AdminController update is loaded.');
        }

        lastServerPhoto = persistedServerPhoto;

        adminRecord = {
            ...adminRecord,
            ...refreshedAdmin
        };

        currentAdmin = {
            ...currentAdmin,
            ...adminRecord,
            full_name: adminRecord.full_name || data.fullName,
            email: adminRecord.email || data.email,
            phone: adminRecord.phone || data.phone,
            photo: adminRecord.photo || data.photo || ''
        };

        localStorage.setItem(ADMIN_KEY, JSON.stringify(currentAdmin));

        return {
            fullName: currentAdmin.full_name || currentAdmin.name || data.fullName,
            role: currentAdmin.role || data.role || 'Administrator',
            email: currentAdmin.email || data.email,
            phone: currentAdmin.phone || data.phone,
            photo: currentAdmin.photo || data.photo || ''
        };
    }

    function renderProfile(data) {
        if (heroName) heroName.textContent = data.fullName;
        if (headerName) headerName.textContent = data.fullName;
        if (detailFullName) detailFullName.textContent = data.fullName;
        if (detailRole) detailRole.textContent = data.role;
        if (detailEmail) detailEmail.textContent = data.email;
        if (detailPhone) detailPhone.textContent = data.phone || 'Not set';
        setProfilePhotoImage(headerAvatarImage, data.photo);
        setProfilePhotoImage(heroAvatarImage, data.photo);
        updatePhotoPreview(pendingPhotoDataUrl || data.photo, pendingPhotoDataUrl ? 'Selected photo' : 'Current photo');
    }

    function getApiOrigin() {
        const configuredBase = (window.GH_API_BASE_URL && String(window.GH_API_BASE_URL).trim())
            || String(localStorage.getItem('gh_api_base_url') || '').trim()
            || 'http://localhost:5007/api';

        return configuredBase.replace(/\/api\/?$/i, '');
    }

    function resolveProfilePhotoUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) {
            return DEFAULT_PROFILE_PHOTO;
        }

        if (/^(data:image\/|https?:\/\/|blob:|file:)/i.test(raw)) {
            return raw;
        }

        if (raw.startsWith('/uploads/') || raw.startsWith('uploads/')) {
            return `${getApiOrigin()}/${raw.replace(/^\/+/, '')}`;
        }

        return raw;
    }

    function setProfilePhotoImage(imageElement, photoValue) {
        if (!imageElement) {
            return;
        }

        const fallback = DEFAULT_PROFILE_PHOTO;
        const nextSource = resolveProfilePhotoUrl(photoValue);

        imageElement.onerror = () => {
            if (imageElement.getAttribute('src') === fallback) {
                imageElement.onerror = null;
                return;
            }

            imageElement.src = fallback;
        };
        imageElement.src = nextSource;
    }

    function updatePhotoPreview(photoValue, label) {
        setProfilePhotoImage(editPhotoPreview, photoValue);
        if (editPhotoFileName) {
            editPhotoFileName.textContent = label || 'Current photo';
        }
    }

    function validateProfilePhoto(file) {
        if (!file) {
            return 'Please choose an image file.';
        }

        if (!SUPPORTED_PROFILE_PHOTO_TYPES.includes(file.type)) {
            return 'Profile photo must be JPG, PNG, WEBP, or GIF.';
        }

        if (file.size > MAX_PROFILE_PHOTO_BYTES) {
            return 'Profile photo must be 5 MB or less.';
        }

        return '';
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Unable to read file.'));
            reader.readAsDataURL(file);
        });
    }

    function isInlineProfilePhoto(value) {
        return String(value || '').trim().startsWith('data:image/');
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

async function loadAdmins() {
    try {
        const admins = await apiRequest('/admin', 'GET');

        const container = document.getElementById("adminList");

        container.innerHTML = admins.map(a => `
            <div style="margin-bottom:10px;">
                ${a.full_name} (${a.email})
                <button onclick="deleteAdmin(${a.admin_id})" class="delete-btn">
                    Delete
                </button>
            </div>
        `).join('');

        // Hide delete if NOT superadmin
        const role = localStorage.getItem("role");
        if (role !== "SuperAdmin") {
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.style.display = "none";
            });
        }

    } catch (err) {
        console.error(err);
    }
}

async function deleteAdmin(id) {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
        await apiRequest(`/admin?id=${id}`, 'DELETE');
        alert("Admin deleted successfully!");
        loadAdmins();
    } catch (err) {
        alert("Error deleting admin");
    }
}

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});