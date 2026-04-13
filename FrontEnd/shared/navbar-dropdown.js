(function () {
    const BADGE_CLASS = 'gh-cart-count-badge';
    const BADGE_STYLE_ID = 'gh-cart-badge-style';
    const DROPDOWN_STYLE_ID = 'gh-navbar-dropdown-style';

    const ensureDropdownStyles = () => {
        if (document.getElementById(DROPDOWN_STYLE_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = DROPDOWN_STYLE_ID;
        style.textContent = `
            .nav-dropdown {
                position: relative;
            }

            .nav-dropdown-toggle {
                font-family: 'Inria Serif', serif;
                font-weight: 700;
                font-size: 18px;
                color: black;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                white-space: nowrap;
            }

            .nav-dropdown-toggle:hover {
                opacity: 0.6;
                text-decoration: none;
            }

            .nav-dropdown-menu {
                display: block;
                position: absolute;
                top: calc(100% + 5px);
                left: 50%;
                transform: translateX(-50%) translateY(8px);
                min-width: 170px;
                background: #ffffff;
                border-radius: 0;
                box-shadow: none;
                border: none;
                padding: 0;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
            }

            .nav-dropdown-menu a {
                display: block;
                padding: 14px 16px;
                font-size: 16px;
                line-height: 1.25;
                font-family: 'Poppins', sans-serif;
                font-weight: 400;
                color: #111111;
                text-decoration: none;
                white-space: nowrap;
                pointer-events: auto;
            }

            .nav-dropdown-menu a:hover {
                background: #f7f7f7;
            }

            .nav-dropdown.is-open .nav-dropdown-menu {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transform: translateX(-50%) translateY(0);
            }

            .cart-dropdown-menu {
                left: auto;
                right: 0;
                transform: translateY(8px);
                min-width: 170px;
            }

            .nav-dropdown.cart-dropdown.is-open .cart-dropdown-menu {
                transform: translateY(0);
            }
        `;

        document.head.appendChild(style);
    };

    const ensureBadgeStyles = () => {
        if (document.getElementById(BADGE_STYLE_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = BADGE_STYLE_ID;
        style.textContent = `
            .cart-dropdown .icon-btn {
                position: relative;
            }

            .${BADGE_CLASS} {
                position: absolute;
                top: -6px;
                right: -6px;
                min-width: 18px;
                height: 18px;
                border-radius: 999px;
                background: #d64141;
                color: #ffffff;
                border: 1px solid #ffffff;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 700;
                line-height: 1;
                padding: 0 5px;
                pointer-events: none;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                z-index: 2;
            }

            .${BADGE_CLASS}[hidden] {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
    };

    const getCartTotalCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (!Array.isArray(cart)) {
                return 0;
            }

            return cart.reduce((total, item) => {
                const qty = Number(item && item.quantity);
                return total + (Number.isFinite(qty) && qty > 0 ? qty : 1);
            }, 0);
        } catch (error) {
            return 0;
        }
    };

    const ensureCartBadge = (button) => {
        let badge = button.querySelector('.' + BADGE_CLASS);
        if (!badge) {
            badge = document.createElement('span');
            badge.className = BADGE_CLASS;
            badge.setAttribute('aria-hidden', 'true');
            badge.hidden = true;
            button.appendChild(badge);
        }
        return badge;
    };

    const updateCartBadges = () => {
        const total = getCartTotalCount();
        const label = total > 99 ? '99+' : String(total);
        const cartButtons = Array.from(document.querySelectorAll('.cart-dropdown .icon-btn'));

        cartButtons.forEach((button) => {
            const badge = ensureCartBadge(button);
            if (total > 0) {
                badge.hidden = false;
                badge.textContent = label;
            } else {
                badge.hidden = true;
                badge.textContent = '';
            }
        });
    };

    if (!window.__ghCartBadgeStoragePatched) {
        const originalSetItem = Storage.prototype.setItem;

        Storage.prototype.setItem = function (key, value) {
            originalSetItem.call(this, key, value);

            if (this === window.localStorage && key === 'cartItems') {
                window.dispatchEvent(new Event('gh-cart-updated'));
            }
        };

        window.__ghCartBadgeStoragePatched = true;
    }

    ensureBadgeStyles();
    ensureDropdownStyles();

    const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

    if (!dropdowns.length) {
        updateCartBadges();
        return;
    }

    const getToggle = (dropdown) => dropdown.querySelector('.nav-dropdown-toggle, .icon-btn');
    const getMenu = (dropdown) => dropdown.querySelector('.nav-dropdown-menu');

    const setOpenState = (dropdown, shouldOpen) => {
        const toggle = getToggle(dropdown);

        dropdown.classList.toggle('is-open', shouldOpen);

        if (toggle) {
            toggle.setAttribute('aria-expanded', String(shouldOpen));
        }
    };

    const closeAll = (exceptDropdown) => {
        dropdowns.forEach((dropdown) => {
            if (dropdown !== exceptDropdown) {
                setOpenState(dropdown, false);
            }
        });
    };

    dropdowns.forEach((dropdown, index) => {
        const toggle = getToggle(dropdown);
        const menu = getMenu(dropdown);

        if (!toggle || !menu) {
            return;
        }

        if (!menu.id) {
            menu.id = 'nav-dropdown-menu-' + (index + 1);
        }

        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-controls', menu.id);
        toggle.setAttribute('aria-expanded', 'false');

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();

            const shouldOpen = !dropdown.classList.contains('is-open');
            closeAll(dropdown);
            setOpenState(dropdown, shouldOpen);
        });

        menu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-dropdown')) {
            closeAll();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAll();
        }
    });

    window.addEventListener('gh-cart-updated', updateCartBadges);
    window.addEventListener('storage', (event) => {
        if (!event.key || event.key === 'cartItems') {
            updateCartBadges();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateCartBadges();
        }
    });

    window.addEventListener('focus', updateCartBadges);
    updateCartBadges();
})();