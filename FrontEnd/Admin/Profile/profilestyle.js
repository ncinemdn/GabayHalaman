const PROFILE_CONTEXT_KEY = '__ghProfileAdminContext';

function logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('role');
    window.location.href = '../../Admin/Auth/signin.html';
}

function getRoleLabel(roleValue) {
    const rawRole = String(roleValue || '').trim();
    if (!rawRole) {
        return 'Administrator';
    }

    if (rawRole.toLowerCase() === 'superadmin') {
        return 'SuperAdmin';
    }

    return rawRole;
}

function isSuperAdminRole(roleValue) {
    return getRoleLabel(roleValue) === 'SuperAdmin';
}

function setProfileContext(currentRole, currentAdminId) {
    window[PROFILE_CONTEXT_KEY] = {
        currentRole: getRoleLabel(currentRole),
        currentAdminId: Number.isFinite(Number(currentAdminId)) ? Number(currentAdminId) : null
    };
}

function getProfileContext() {
    return window[PROFILE_CONTEXT_KEY] || {
        currentRole: getRoleLabel(localStorage.getItem('role')),
        currentAdminId: null
    };
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', async () => {
    const ADMIN_KEY = 'admin';
    const DEFAULT_PROFILE_PHOTO = 'cc.jpg';
    const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024;
    const SUPPORTED_PROFILE_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    let currentAdmin = loadAdminSession();

    if (!currentAdmin) {
        window.location.href = '../../Admin/Auth/signin.html';
        return;
    }

    let currentRole = getRoleLabel(currentAdmin.role || localStorage.getItem('role'));
    localStorage.setItem('role', currentRole);
    setProfileContext(currentRole, currentAdmin.admin_id);

    let adminRecord = { ...currentAdmin };
    let pendingPhotoDataUrl = '';
    let lastServerPhoto = '';

    let profile = {
        fullName: currentAdmin.full_name || currentAdmin.name || 'Admin',
        role: currentRole,
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
            currentRole = getRoleLabel(adminData.role || currentRole);
            localStorage.setItem('role', currentRole);
            setProfileContext(currentRole, currentAdmin.admin_id);

            profile.fullName = adminData.full_name || adminData.name || profile.fullName;
            profile.role = currentRole;
            profile.email = adminData.email || profile.email;
            profile.phone = adminData.phone || profile.phone;
            profile.photo = adminData.photo || profile.photo;
        }
    } catch (error) {
        console.error('Failed to fetch admin data:', error);
    }

    const heroName = document.getElementById('heroName');
    const headerName = document.querySelector('.user-name');
    const headerRole = document.getElementById('headerRole');
    const heroRoleLine = document.getElementById('heroRoleLine');
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

    const manageAdminsBtn = document.getElementById('manageAdminsBtn');
    const adminSection = document.getElementById('adminSection');
    const addAdminToggleBtn = document.getElementById('addAdminToggleBtn');
    const addAdminForm = document.getElementById('addAdminForm');
    const cancelAddAdminBtn = document.getElementById('cancelAddAdminBtn');
    const addAdminError = document.getElementById('addAdminError');
    const newAdminFullName = document.getElementById('newAdminFullName');
    const newAdminEmail = document.getElementById('newAdminEmail');
    const newAdminPhone = document.getElementById('newAdminPhone');
    const newAdminPassword = document.getElementById('newAdminPassword');
    const newAdminRole = document.getElementById('newAdminRole');
    const toggleNewAdminPasswordBtn = document.getElementById('toggleNewAdminPasswordBtn');

    const isSuperAdmin = isSuperAdminRole(profile.role);
    if (isSuperAdmin && manageAdminsBtn) {
        manageAdminsBtn.classList.remove('hidden');
    }

    if (isSuperAdmin && addAdminToggleBtn) {
        addAdminToggleBtn.classList.remove('hidden');
    }

    if (manageAdminsBtn && adminSection) {
        manageAdminsBtn.addEventListener('click', async () => {
            adminSection.classList.remove('hidden');
            await loadAdmins();
        });
    }

    if (addAdminToggleBtn && addAdminForm) {
        addAdminToggleBtn.addEventListener('click', () => {
            addAdminError.textContent = '';
            addAdminForm.classList.toggle('hidden');

            if (!addAdminForm.classList.contains('hidden')) {
                newAdminFullName.focus();
            }
        });
    }

    if (cancelAddAdminBtn && addAdminForm) {
        cancelAddAdminBtn.addEventListener('click', () => {
            addAdminError.textContent = '';
            addAdminForm.reset();
            if (newAdminPassword) {
                newAdminPassword.type = 'password';
            }
            if (toggleNewAdminPasswordBtn) {
                toggleNewAdminPasswordBtn.textContent = 'Show';
                toggleNewAdminPasswordBtn.setAttribute('aria-label', 'Show password');
                toggleNewAdminPasswordBtn.setAttribute('aria-pressed', 'false');
            }
            addAdminForm.classList.add('hidden');
        });
    }

    if (toggleNewAdminPasswordBtn && newAdminPassword) {
        toggleNewAdminPasswordBtn.addEventListener('click', () => {
            const isHidden = newAdminPassword.type === 'password';
            newAdminPassword.type = isHidden ? 'text' : 'password';
            toggleNewAdminPasswordBtn.textContent = isHidden ? 'Hide' : 'Show';
            toggleNewAdminPasswordBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
            toggleNewAdminPasswordBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
        });
    }

    if (addAdminForm) {
        addAdminForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            addAdminError.textContent = '';

            if (!isSuperAdminRole(profile.role)) {
                addAdminError.textContent = 'Only SuperAdmin can create admin accounts.';
                return;
            }

            const fullName = String(newAdminFullName.value || '').trim();
            const email = String(newAdminEmail.value || '').trim();
            const phone = String(newAdminPhone.value || '').trim();
            const password = String(newAdminPassword.value || '').trim();
            const role = getRoleLabel(newAdminRole.value);

            if (!fullName || !email || !phone || !password) {
                addAdminError.textContent = 'Please complete all required fields.';
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                addAdminError.textContent = 'Please enter a valid email address.';
                return;
            }

            if (password.length < 6) {
                addAdminError.textContent = 'Password must be at least 6 characters.';
                return;
            }

            try {
                await createAdminAccount({
                    full_name: fullName,
                    email,
                    phone,
                    password,
                    role
                });

                if (typeof createAdminActivityLog === 'function') {
                    await createAdminActivityLog({
                        action_performed: `Created admin "${fullName}"`,
                        module_used: 'Profile'
                    });
                }

                addAdminForm.reset();
                if (newAdminPassword) {
                    newAdminPassword.type = 'password';
                }
                if (toggleNewAdminPasswordBtn) {
                    toggleNewAdminPasswordBtn.textContent = 'Show';
                    toggleNewAdminPasswordBtn.setAttribute('aria-label', 'Show password');
                    toggleNewAdminPasswordBtn.setAttribute('aria-pressed', 'false');
                }
                addAdminForm.classList.add('hidden');
                showToast('Admin account created successfully.');
                await loadAdmins();
            } catch (error) {
                const message = String(error?.message || 'Unable to create admin account.');
                if (message.includes('405')) {
                    addAdminError.textContent = 'Create Admin endpoint is not active in the running backend. Restart your API and try again.';
                } else {
                    addAdminError.textContent = message;
                }
            }
        });
    }

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
            editRole.value = getRoleLabel(profile.role);
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

        currentRole = getRoleLabel(currentAdmin.role || data.role || currentRole);
        localStorage.setItem('role', currentRole);
        setProfileContext(currentRole, currentAdmin.admin_id);

        localStorage.setItem(ADMIN_KEY, JSON.stringify(currentAdmin));

        return {
            fullName: currentAdmin.full_name || currentAdmin.name || data.fullName,
            role: currentRole,
            email: currentAdmin.email || data.email,
            phone: currentAdmin.phone || data.phone,
            photo: currentAdmin.photo || data.photo || ''
        };
    }

    function renderProfile(data) {
        const resolvedRole = getRoleLabel(data.role);
        if (heroName) heroName.textContent = data.fullName;
        if (headerName) headerName.textContent = data.fullName;
        if (headerRole) headerRole.textContent = resolvedRole;
        if (heroRoleLine) heroRoleLine.textContent = `${resolvedRole} for catalog, reservations, and delivery operations`;
        if (detailFullName) detailFullName.textContent = data.fullName;
        if (detailRole) detailRole.textContent = resolvedRole;
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

    async function createAdminAccount(payload) {
        try {
            return await apiRequest('/admin', 'POST', payload);
        } catch (error) {
            const message = String(error?.message || '').toLowerCase();
            const isMethodNotAllowed = message.includes('405');

            if (!isMethodNotAllowed) {
                throw error;
            }

            try {
                return await apiRequest('/admin/signup', 'POST', payload);
            } catch (fallbackError) {
                const fallbackMessage = String(fallbackError?.message || '').toLowerCase();
                const signupDisabled = fallbackMessage.includes('disabled');

                if (signupDisabled) {
                    throw error;
                }

                throw fallbackError;
            }
        }
    }
});

async function loadAdmins() {
    try {
        const admins = await apiRequest('/admin', 'GET');
        const container = document.getElementById('adminList');
        if (!container) {
            return;
        }

        const context = getProfileContext();
        const canManage = isSuperAdminRole(context.currentRole);

        if (!Array.isArray(admins) || admins.length === 0) {
            container.innerHTML = '<div class="admin-list-empty">No admin accounts found.</div>';
            return;
        }

        container.innerHTML = admins.map((admin) => {
            const isOwnRecord = Number(admin.admin_id) === Number(context.currentAdminId);
            const shouldHideDelete = !canManage || isOwnRecord;

            return `
            <article class="admin-item">
                <div class="admin-item-copy">
                    <p class="admin-name">${escapeHtml(admin.full_name || 'Unnamed Admin')}</p>
                    <p class="admin-meta">${escapeHtml(admin.email || '')} • ${escapeHtml(getRoleLabel(admin.role))}</p>
                </div>
                <button class="admin-action-btn js-delete-admin-btn" data-admin-id="${Number(admin.admin_id)}" ${shouldHideDelete ? 'style="display:none;"' : ''}>Delete Admin</button>
            </article>
        `;
        }).join('');

        container.querySelectorAll('.js-delete-admin-btn').forEach((button) => {
            button.addEventListener('click', async () => {
                const id = Number(button.getAttribute('data-admin-id'));
                if (!Number.isFinite(id)) {
                    return;
                }

                await deleteAdmin(id);
            });
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteAdmin(id) {
    const context = getProfileContext();

    if (!isSuperAdminRole(context.currentRole)) {
        alert('Only SuperAdmin can delete admin accounts.');
        return;
    }

    if (Number(id) === Number(context.currentAdminId)) {
        alert('You cannot delete your own active admin account.');
        return;
    }

    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
        await apiRequest(`/admin?id=${id}`, 'DELETE');
        if (typeof createAdminActivityLog === 'function') {
            await createAdminActivityLog({
                action_performed: `Deleted admin #${id}`,
                module_used: 'Profile'
            });
        }
        alert('Admin deleted successfully!');
        await loadAdmins();
    } catch (error) {
        alert('Error deleting admin');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
