(function () {
    var scriptSrc = document.currentScript && document.currentScript.src
        ? document.currentScript.src
        : '';

    function getFrontEndRoot() {
        if (scriptSrc) {
            return new URL('../', scriptSrc);
        }

        if (window.location && window.location.href) {
            var marker = '/FrontEnd/';
            var markerIndex = window.location.href.indexOf(marker);
            if (markerIndex !== -1) {
                return new URL(window.location.href.slice(0, markerIndex + marker.length));
            }
        }

        return null;
    }

    function ensureFooterStyles(frontEndRoot) {
        if (!frontEndRoot || document.getElementById('gh-footer-unified-css')) {
            return;
        }

        var link = document.createElement('link');
        link.id = 'gh-footer-unified-css';
        link.rel = 'stylesheet';
        link.href = new URL('shared/footer-unified.css', frontEndRoot).href;
        document.head.appendChild(link);
    }

    function getFooterMarkup(frontEndRoot) {
        var aboutUsHref = new URL('LandingPage/info.html#about-us', frontEndRoot).href;
        var usersManualHref = new URL('LandingPage/info.html#users-manual', frontEndRoot).href;
        var contactHref = new URL('Reservation/confirmation.html', frontEndRoot).href;
        var adminHref = new URL('Admin/Auth/signin.html', frontEndRoot).href;

        return [
            '<footer class="site-footer">',
            '    <button class="footer-back-to-top" type="button" aria-label="Back to top">Back to Top</button>',
            '    <div class="footer-main">',
            '        <p class="footer-kicker">GabayHalaman</p>',
            '        <h2 class="footer-title">Grow with confidence, one plant at a time.</h2>',
            '        <p class="footer-description">',
            '            We make plant care simple with trusted delivery, friendly guidance,',
            '            and a thoughtful selection of greenery for every space.',
            '        </p>',
            '        <nav class="footer-nav" aria-label="Footer navigation">',
            '            <a href="' + aboutUsHref + '">About Us</a>',
            '            <a href="' + usersManualHref + '">Users Manual</a>',
            '            <a href="' + contactHref + '">Contact Us</a>',
            '            <a href="' + adminHref + '">Admin</a>',
            '        </nav>',
            '    </div>',
            '    <div class="footer-bar">',
            '        <p>&copy; 2026 GabayHalaman. All rights reserved.</p>',
            '    </div>',
            '</footer>'
        ].join('\n');
    }

    function upsertFooter(frontEndRoot) {
        var footer = document.querySelector('footer.site-footer');
        var footerMarkup = getFooterMarkup(frontEndRoot);

        if (footer) {
            footer.outerHTML = footerMarkup;
            return;
        }

        if (document.body) {
            document.body.insertAdjacentHTML('beforeend', footerMarkup);
        }
    }

    function bindBackToTop() {
        var backToTopButton = document.querySelector('.footer-back-to-top');
        if (!backToTopButton || backToTopButton.dataset.boundFooterTop === 'true') {
            return;
        }

        backToTopButton.dataset.boundFooterTop = 'true';
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initializeUnifiedFooter() {
        var frontEndRoot = getFrontEndRoot();
        if (!frontEndRoot) {
            return;
        }

        ensureFooterStyles(frontEndRoot);
        upsertFooter(frontEndRoot);
        bindBackToTop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUnifiedFooter);
    } else {
        initializeUnifiedFooter();
    }
})();
