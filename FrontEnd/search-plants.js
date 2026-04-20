(function () {
    const PLANT_RESULTS = [
        { name: 'Yellow Lemon', href: 'Shopage/Categories/citrus.html' },
        { name: 'American Lemon', href: 'Shopage/Categories/citrus.html' },
        { name: 'Dayap', href: 'Shopage/Categories/citrus.html' },
        { name: 'Pomegrenate', href: 'Shopage/Categories/citrus.html' },
        { name: 'Calamansi', href: 'Shopage/Categories/citrus.html' },
        { name: 'Suha Davao', href: 'Shopage/Categories/citrus.html' },
        { name: 'Calamandarin', href: 'Shopage/Categories/citrus.html' },
        { name: 'Davao Pomelo', href: 'Shopage/Categories/citrus.html' },
        { name: 'Dalanghita', href: 'Shopage/Categories/citrus.html' },
        { name: 'Satsuma Citrus', href: 'Shopage/Categories/citrus.html' },
        { name: 'Japanese Orange', href: 'Shopage/Categories/citrus.html' },
        { name: 'Sagada Orange', href: 'Shopage/Categories/citrus.html' },
        { name: 'Lemon Meyer', href: 'Shopage/Categories/citrus.html' },
        { name: 'Kiat-kiat', href: 'Shopage/Categories/citrus.html' },
        { name: 'Ponkan', href: 'Shopage/Categories/citrus.html' },
        { name: 'Dalandan', href: 'Shopage/Categories/citrus.html' },
        { name: 'Hybrid Coconut', href: 'Shopage/Categories/coconut.html' },
        { name: 'Native Coconut', href: 'Shopage/Categories/coconut.html' },
        { name: 'Golden Coconut', href: 'Shopage/Categories/coconut.html' },
        { name: 'Dwarf Golden', href: 'Shopage/Categories/coconut.html' },
        { name: 'Macapuno', href: 'Shopage/Categories/coconut.html' },
        { name: 'Sweet Catimon Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Queen Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'King Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Purple Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Indian Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Apple Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Carabao Mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Golden queen mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Florida mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Double rootstock mango', href: 'Shopage/Categories/mango.html' },
        { name: 'Guapple', href: 'Shopage/Categories/guava.html' },
        { name: 'Red Guava', href: 'Shopage/Categories/guava.html' },
        { name: 'Mangosteen', href: 'Shopage/Categories/grafted.html' },
        { name: 'Durian Puyat', href: 'Shopage/Categories/grafted.html' },
        { name: 'Sweet Balimbing', href: 'Shopage/Categories/grafted.html' },
        { name: 'Macpa red', href: 'Shopage/Categories/grafted.html' },
        { name: 'Hybrid Mulberry', href: 'Shopage/Categories/grafted.html' },
        { name: 'Guyabano', href: 'Shopage/Categories/grafted.html' },
        { name: 'Abiu', href: 'Shopage/Categories/grafted.html' },
        { name: 'Caimito', href: 'Shopage/Categories/grafted.html' },
        { name: 'Atis', href: 'Shopage/Categories/grafted.html' },
        { name: 'Atis Seedless', href: 'Shopage/Categories/grafted.html' },
        { name: 'Langka', href: 'Shopage/Categories/grafted.html' },
        { name: 'Anonas', href: 'Shopage/Categories/grafted.html' },
        { name: 'Chico', href: 'Shopage/Categories/grafted.html' },
        { name: 'Cherrymoya', href: 'Shopage/Categories/grafted.html' },
        { name: 'Bangkok Santol', href: 'Shopage/Categories/grafted.html' },
        { name: 'Avocado', href: 'Shopage/Categories/grafted.html' },
        { name: 'Giant Duhat', href: 'Shopage/Categories/grafted.html' },
        { name: 'Kamias', href: 'Shopage/Categories/grafted.html' },
        { name: 'Star Apple', href: 'Shopage/Categories/grafted.html' },
        { name: 'Magic Fruit', href: 'Shopage/Categories/grafted.html' },
        { name: 'Cacao', href: 'Shopage/Categories/grafted.html' },
        { name: 'Sweet Tamarind', href: 'Shopage/Categories/grafted.html' },
        { name: 'Red Grapes', href: 'Shopage/Categories/grafted.html' },
        { name: 'Lychee', href: 'Shopage/Categories/grafted.html' },
        { name: 'Lanzones', href: 'Shopage/Categories/grafted.html' },
        { name: 'Rambutan(RR)', href: 'Shopage/Categories/grafted.html' },
        { name: 'Longgan', href: 'Shopage/Categories/grafted.html' },
        { name: 'Kasoy', href: 'Shopage/Categories/grafted.html' },
        { name: 'Marang', href: 'Shopage/Categories/grafted.html' },
        { name: 'Araucaria Trees', href: 'Shopage/Categories/forest.html' },
        { name: 'Indian Tree', href: 'Shopage/Categories/forest.html' },
        { name: 'Mahogany', href: 'Shopage/Categories/forest.html' },
        { name: 'Pole Bamboo', href: 'Shopage/Categories/forest.html' },
        { name: 'Thailand bamboo', href: 'Shopage/Categories/forest.html' },
        { name: 'Chinese bamboo', href: 'Shopage/Categories/forest.html' },
        { name: 'African talisay', href: 'Shopage/Categories/forest.html' },
        { name: 'Royal palm', href: 'Shopage/Categories/forest.html' },
        { name: 'Bunga china', href: 'Shopage/Categories/forest.html' },
        { name: 'Gemelina', href: 'Shopage/Categories/forest.html' },
        { name: 'Narra', href: 'Shopage/Categories/forest.html' },
        { name: 'Molave', href: 'Shopage/Categories/forest.html' },
        { name: 'Golden trumpet', href: 'Shopage/Categories/flowering.html' },
        { name: 'Pink trumpet', href: 'Shopage/Categories/flowering.html' },
        { name: 'Cherry blossom', href: 'Shopage/Categories/flowering.html' },
        { name: 'Golden shower', href: 'Shopage/Categories/flowering.html' },
        { name: 'Fire tree', href: 'Shopage/Categories/flowering.html' },
        { name: 'Ilang ilang', href: 'Shopage/Categories/flowering.html' },
        { name: 'Jacaranda', href: 'Shopage/Categories/flowering.html' },
        { name: 'Pine tree', href: 'Shopage/Categories/flowering.html' },
        { name: 'Palm tree', href: 'Shopage/Categories/flowering.html' },
        { name: 'Dates palm', href: 'Shopage/Categories/flowering.html' },
        { name: 'Paminta', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Micracle Fruit', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Karamay', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Sarguelas', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Mabolo', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Bignay', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Robusta', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Arabica Coffee', href: 'Shopage/Categories/cuttings.html' },
        { name: 'Barako', href: 'Shopage/Categories/cuttings.html' }
    ];

    const STYLE_ID = 'plant-search-style';

    function resolveHref(target) {
        const cleaned = target.replace(/^\/+/, '');
        const categoryMatch = cleaned.match(/^Shopage\/Categories\/([a-z-]+)\.html$/i);
        const categoryAliasMap = {
            'fruit-bearing': 'grafted'
        };
        const routed = categoryMatch
            ? `Shopage/Shoppage.html?category=${categoryAliasMap[categoryMatch[1].toLowerCase()] || categoryMatch[1].toLowerCase()}`
            : cleaned;
        const current = window.location.pathname.replace(/\\/g, '/');
        const idx = current.toLowerCase().lastIndexOf('/frontend/');
        if (idx !== -1) {
            const base = current.slice(0, idx + '/FrontEnd/'.length);
            return base + routed;
        }
        return '../' + routed;
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
