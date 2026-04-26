(function () {
    const DEFAULT_PROFILE_PHOTO = '../Profile/cc.jpg';

    function getApiOrigin() {
        const configuredBase = (window.GH_API_BASE_URL && String(window.GH_API_BASE_URL).trim())
            || String(localStorage.getItem('gh_api_base_url') || '').trim()
            || 'http://localhost:5007/api';

        return configuredBase.replace(/\/api\/?$/i, '');
    }

    function resolveProfilePhotoUrl(value, fallbackPhoto) {
        const raw = String(value || '').trim();
        const fallback = String(fallbackPhoto || DEFAULT_PROFILE_PHOTO).trim() || DEFAULT_PROFILE_PHOTO;

        if (!raw) {
            return fallback;
        }

        if (/^(data:image\/|https?:\/\/|blob:|file:)/i.test(raw)) {
            return raw;
        }

        if (raw.startsWith('/uploads/') || raw.startsWith('uploads/')) {
            return getApiOrigin() + '/' + raw.replace(/^\/+/, '');
        }

        return raw;
    }

    function setProfilePhotoImage(imageElement, photoValue, fallbackPhoto) {
        if (!imageElement) {
            return;
        }

        const fallback = String(fallbackPhoto || DEFAULT_PROFILE_PHOTO).trim() || DEFAULT_PROFILE_PHOTO;
        const nextSource = resolveProfilePhotoUrl(photoValue, fallback);

        imageElement.onerror = function () {
            if (imageElement.getAttribute('src') === fallback) {
                imageElement.onerror = null;
                return;
            }

            imageElement.src = fallback;
        };

        imageElement.src = nextSource;
    }

    async function getAdminHeaderData() {
        let currentAdmin = null;

        try {
            currentAdmin = JSON.parse(localStorage.getItem('admin') || 'null');
        } catch (error) {
            currentAdmin = null;
        }

        const profile = {
            fullName: currentAdmin?.full_name || currentAdmin?.name || 'Admin',
            role: currentAdmin?.role || 'Administrator',
            photo: currentAdmin?.photo || ''
        };

        try {
            if (currentAdmin && typeof adminAPI !== 'undefined' && Number.isFinite(Number(currentAdmin.admin_id))) {
                const adminData = await adminAPI.getById(currentAdmin.admin_id);
                profile.fullName = adminData?.full_name || adminData?.name || profile.fullName;
                profile.role = adminData?.role || profile.role;
                profile.photo = adminData?.photo || profile.photo;

                localStorage.setItem('admin', JSON.stringify({
                    ...currentAdmin,
                    ...adminData,
                    full_name: adminData?.full_name || currentAdmin?.full_name || currentAdmin?.name || profile.fullName,
                    role: adminData?.role || currentAdmin?.role || profile.role,
                    photo: adminData?.photo || currentAdmin?.photo || ''
                }));
            }
        } catch (error) {
            console.warn('Unable to load admin header data:', error);
        }

        return profile;
    }

    async function applyAdminHeader(options) {
        const settings = options || {};
        const data = await getAdminHeaderData();
        const nameElement = document.querySelector(settings.nameSelector || '.user-name');
        const roleElement = document.querySelector(settings.roleSelector || '.user-role');
        const avatarElement = document.querySelector(settings.avatarSelector || '.user-avatar img');
        const greetingElement = settings.greetingSelector ? document.querySelector(settings.greetingSelector) : null;

        if (nameElement) {
            nameElement.textContent = data.fullName;
        }

        if (roleElement) {
            roleElement.textContent = data.role;
        }

        if (avatarElement) {
            setProfilePhotoImage(avatarElement, data.photo, settings.fallbackPhoto || DEFAULT_PROFILE_PHOTO);
        }

        if (greetingElement && settings.greetingTemplate) {
            greetingElement.textContent = settings.greetingTemplate.replace('{name}', data.fullName);
        }

        return data;
    }

    window.GHAdminHeader = {
        apply: applyAdminHeader,
        getData: getAdminHeaderData,
        resolvePhotoUrl: resolveProfilePhotoUrl
    };
})();