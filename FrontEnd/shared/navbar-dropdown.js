(function () {
    const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

    if (!dropdowns.length) {
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
})();