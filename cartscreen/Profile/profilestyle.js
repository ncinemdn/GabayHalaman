document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    // Toggle Sidebar for Mobile
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (event) => {
        // We only run this if the sidebar exists and is actually open
        if (sidebar && sidebar.classList.contains('open')) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            
            // Check if mobileToggle exists before checking if it was clicked
            const isClickInsideToggle = mobileToggle ? mobileToggle.contains(event.target) : false;

            if (!isClickInsideSidebar && !isClickInsideToggle) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Handle Active State switching (Visual Demo Only)
    const navItems = document.querySelectorAll('.sidebar-nav li');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // On mobile, close sidebar after selection
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    // Simple search filter simulation for the log table
    const logSearchInput = document.querySelector('.inner-search input');
    const tableRows = document.querySelectorAll('.transaction-table tbody tr');

    if (logSearchInput && tableRows.length > 0) {
        logSearchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            
            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                if (text.includes(term)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});