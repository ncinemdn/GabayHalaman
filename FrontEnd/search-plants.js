(function () {
    const PLANT_RESULTS = [
        { name: 'Hybrid Coconut', href: 'Shopage/Categories/coconut.html' },
        { name: 'Native Coconut', href: 'Shopage/Categories/coconut.html' },
        { name: 'Golden Coconut', href: 'Shopage/Categories/coconut.html' },
        { name: 'Macapuno', href: 'Shopage/Categories/coconut.html' },
        { name: 'Sweet Catimon Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Indian Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Apple Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Carabao Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Golden Queen Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Florida Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Double Rootstock Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Guapple', href: 'Shopage/Categories/guava.html' },
        { name: 'Red Guava', href: 'Shopage/Categories/guava.html' },
        { name: 'Yellow Lemon', href: 'Shopage/Categories/citrus.html' },
        { name: 'American Lemon', href: 'Shopage/Categories/citrus.html' },
        { name: 'Dayap', href: 'Shopage/Categories/citrus.html' },
        { name: 'Pomegranate', href: 'Shopage/Categories/citrus.html' },
        { name: 'Calamansi', href: 'Shopage/Categories/citrus.html' },
        { name: 'Suha Davao', href: 'Shopage/Categories/citrus.html' },
        { name: 'Calamandarin', href: 'Shopage/Categories/citrus.html' },
        { name: 'Sagada Orange', href: 'Shopage/Categories/citrus.html' },
        { name: 'Kiat-kiat', href: 'Shopage/Categories/citrus.html' },
        { name: 'Ponkan', href: 'Shopage/Categories/citrus.html' },
        { name: 'Dalandan', href: 'Shopage/Categories/citrus.html' },
        { name: 'Mangosteen', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Mulberry', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Guyabano', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Atis', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Atis Seedless', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Langka', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Anonas', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Chico', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Cherrymoya', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Bangkok Santol', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Avocado', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Giant Duhat', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Kamias', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Star Apple', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Magic Fruit', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Cacao', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Sweet Tamarind', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Red Grapes', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Lychee', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Lanzones', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Rambutan (RR)', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Longgan', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Kasoy', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Marang', href: 'Shopage/Categories/fruit-bearing.html' },
        { name: 'Araucaria Trees', href: 'Shopage/Categories/forest.html' },
        { name: 'Indian Tree', href: 'Shopage/Categories/forest.html' },
        { name: 'Mahogany', href: 'Shopage/Categories/forest.html' },
        { name: 'Thailand Bamboo', href: 'Shopage/Categories/forest.html' },
        { name: 'Chinese Bamboo', href: 'Shopage/Categories/forest.html' },
        { name: 'African Talisay', href: 'Shopage/Categories/forest.html' },
        { name: 'Royal Palm', href: 'Shopage/Categories/forest.html' },
        { name: 'Bunga China', href: 'Shopage/Categories/forest.html' },
        { name: 'Gemelina', href: 'Shopage/Categories/forest.html' },
        { name: 'Narra', href: 'Shopage/Categories/forest.html' },
        { name: 'Molave', href: 'Shopage/Categories/forest.html' },
        { name: 'Golden Trumpet', href: 'Shopage/Categories/flowering.html' },
        { name: 'Pink Trumpet', href: 'Shopage/Categories/flowering.html' },
        { name: 'Cherry Blossom', href: 'Shopage/Categories/flowering.html' },
        { name: 'Golden Shower', href: 'Shopage/Categories/flowering.html' },
        { name: 'Fire Tree', href: 'Shopage/Categories/flowering.html' },
        { name: 'Ilang Ilang', href: 'Shopage/Categories/flowering.html' },
        { name: 'Jacaranda', href: 'Shopage/Categories/flowering.html' },
        { name: 'Pine Tree', href: 'Shopage/Categories/flowering.html' },
        { name: 'Palm Tree', href: 'Shopage/Categories/flowering.html' },
        { name: 'Dates Palm', href: 'Shopage/Categories/flowering.html' }
    ];

    const STYLE_ID = 'plant-search-style';

    function resolveHref(target) {
        const cleaned = target.replace(/^\/+/, '');
        const current = window.location.pathname.replace(/\\/g, '/');
        const idx = current.toLowerCase().lastIndexOf('/frontend/');
        if (idx !== -1) {
            const base = current.slice(0, idx + '/FrontEnd/'.length);
            return base + cleaned;
        }
        return '../' + cleaned;
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.plant-search-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:none;align-items:flex-start;justify-content:center;padding:90px 20px 20px;z-index:3000;}',
            '.plant-search-overlay.is-open{display:flex;}',
            '.plant-search-panel{width:min(760px,100%);background:#fff;border-radius:16px;box-shadow:0 18px 40px rgba(0,0,0,0.2);overflow:hidden;border:1px solid #d8e3cf;}',
            '.plant-search-top{display:flex;gap:10px;padding:14px;border-bottom:1px solid #e8efe1;}',
            '.plant-search-input{flex:1;border:1px solid #cad9bb;border-radius:10px;padding:11px 12px;font-size:15px;outline:none;}',
            '.plant-search-close{border:none;background:#e9f2dc;color:#2f4a24;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer;}',
            '.plant-search-results{max-height:380px;overflow:auto;}',
            '.plant-search-item{display:block;padding:12px 14px;text-decoration:none;color:#1f2f14;border-bottom:1px solid #edf2e8;}',
            '.plant-search-item:hover{background:#f4f9eb;}',
            '.plant-search-name{font-weight:700;display:block;font-size:15px;margin-bottom:3px;}',
            '.plant-search-meta{font-size:12px;color:#5a7851;}',
            '.plant-search-empty{padding:20px 14px;color:#5a7851;font-size:14px;}'
        ].join('');

        document.head.appendChild(style);
    }

    function buildPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'plant-search-overlay';
        overlay.id = 'plantSearchOverlay';
        overlay.innerHTML = [
            '<div class="plant-search-panel" role="dialog" aria-modal="true" aria-label="Search plants">',
            '<div class="plant-search-top">',
            '<input id="plantSearchInput" class="plant-search-input" type="text" placeholder="Search plants (e.g. Mango, Calamansi, Narra)" autocomplete="off">',
            '<button id="plantSearchClose" class="plant-search-close" type="button">Close</button>',
            '</div>',
            '<div id="plantSearchResults" class="plant-search-results"></div>',
            '</div>'
        ].join('');

        document.body.appendChild(overlay);
        return overlay;
    }

    function getCategoryFromHref(href) {
        const parts = href.split('/');
        const file = parts[parts.length - 1] || '';
        return file.replace('.html', '').replace(/-/g, ' ');
    }

    function mountSearch() {
        const searchButton = document.querySelector('.header-icons .icon-btn[aria-label="Search"]');
        if (!searchButton) {
            return;
        }

        ensureStyle();
        const overlay = buildPanel();
        const input = overlay.querySelector('#plantSearchInput');
        const closeBtn = overlay.querySelector('#plantSearchClose');
        const results = overlay.querySelector('#plantSearchResults');

        function render(query) {
            const keyword = (query || '').trim().toLowerCase();
            const list = keyword
                ? PLANT_RESULTS.filter((plant) => plant.name.toLowerCase().includes(keyword))
                : PLANT_RESULTS.slice(0, 16);

            if (!list.length) {
                results.innerHTML = '<p class="plant-search-empty">No plant found. Try another keyword.</p>';
                return;
            }

            results.innerHTML = list.map((plant) => {
                const category = getCategoryFromHref(plant.href);
                return [
                    '<a class="plant-search-item" href="' + resolveHref(plant.href) + '">',
                    '<span class="plant-search-name">' + plant.name + '</span>',
                    '<span class="plant-search-meta">Category: ' + category + '</span>',
                    '</a>'
                ].join('');
            }).join('');
        }

        function openSearch() {
            overlay.classList.add('is-open');
            render('');
            window.setTimeout(function () {
                input.focus();
            }, 0);
        }

        function closeSearch() {
            overlay.classList.remove('is-open');
            input.value = '';
        }

        searchButton.addEventListener('click', function () {
            openSearch();
        });

        closeBtn.addEventListener('click', function () {
            closeSearch();
        });

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                closeSearch();
            }
        });

        input.addEventListener('input', function () {
            render(input.value);
        });

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const first = results.querySelector('.plant-search-item');
                if (first) {
                    window.location.href = first.getAttribute('href') || '';
                }
            }

            if (event.key === 'Escape') {
                closeSearch();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
                closeSearch();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountSearch);
    } else {
        mountSearch();
    }
})();
