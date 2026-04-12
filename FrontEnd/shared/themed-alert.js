(function () {
    if (window.__ghThemedAlertInstalled) {
        return;
    }
    window.__ghThemedAlertInstalled = true;

    var styleId = 'gh-themed-alert-style';
    var modalId = 'gh-themed-alert-modal';
    var queue = [];
    var isOpen = false;
    var confirmButton = null;
    var bodyElement = null;

    function ensureStyles() {
        if (document.getElementById(styleId)) {
            return;
        }

        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = [
            '.gh-alert-overlay {',
            '    position: fixed;',
            '    inset: 0;',
            '    background: rgba(33, 49, 24, 0.45);',
            '    display: none;',
            '    align-items: center;',
            '    justify-content: center;',
            '    padding: 16px;',
            '    z-index: 9999;',
            '}',
            '.gh-alert-overlay.is-open {',
            '    display: flex;',
            '}',
            '.gh-alert-card {',
            '    width: min(520px, 100%);',
            '    background: #f7f0e3;',
            '    border: 2px solid #7fa843;',
            '    border-radius: 20px;',
            '    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);',
            '    overflow: hidden;',
            '}',
            '.gh-alert-header {',
            '    background: #7fa843;',
            '    color: #ffffff;',
            '    font-family: "Inria Serif", serif;',
            '    font-weight: 700;',
            '    font-size: 20px;',
            '    padding: 14px 20px;',
            '}',
            '.gh-alert-body {',
            '    color: #2f4a1f;',
            '    font-family: "Poppins", sans-serif;',
            '    font-size: 16px;',
            '    line-height: 1.55;',
            '    padding: 22px 20px 8px;',
            '    white-space: pre-wrap;',
            '}',
            '.gh-alert-actions {',
            '    display: flex;',
            '    justify-content: flex-end;',
            '    padding: 16px 20px 20px;',
            '}',
            '.gh-alert-ok {',
            '    border: none;',
            '    border-radius: 999px;',
            '    background: #3b4e31;',
            '    color: #ffffff;',
            '    font-family: "Poppins", sans-serif;',
            '    font-weight: 600;',
            '    font-size: 15px;',
            '    letter-spacing: 0.2px;',
            '    padding: 10px 22px;',
            '    cursor: pointer;',
            '}',
            '.gh-alert-ok:hover {',
            '    background: #2f3f26;',
            '}',
            '.gh-alert-ok:focus-visible {',
            '    outline: 3px solid rgba(127, 168, 67, 0.45);',
            '    outline-offset: 2px;',
            '}'
        ].join('\n');

        document.head.appendChild(style);
    }

    function closeAlert() {
        if (!bodyElement) {
            return;
        }

        bodyElement.classList.remove('is-open');
        isOpen = false;
        processQueue();
    }

    function ensureModal() {
        if (document.getElementById(modalId)) {
            return;
        }

        ensureStyles();

        var overlay = document.createElement('div');
        overlay.id = modalId;
        overlay.className = 'gh-alert-overlay';
        overlay.innerHTML = [
            '<div class="gh-alert-card" role="alertdialog" aria-modal="true" aria-labelledby="gh-alert-title" aria-describedby="gh-alert-message">',
            '    <div id="gh-alert-title" class="gh-alert-header">Notice</div>',
            '    <div id="gh-alert-message" class="gh-alert-body"></div>',
            '    <div class="gh-alert-actions">',
            '        <button type="button" class="gh-alert-ok">OK</button>',
            '    </div>',
            '</div>'
        ].join('');

        document.body.appendChild(overlay);

        bodyElement = overlay;
        confirmButton = overlay.querySelector('.gh-alert-ok');

        confirmButton.addEventListener('click', closeAlert);

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                closeAlert();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (!isOpen) {
                return;
            }

            if (event.key === 'Escape' || event.key === 'Enter') {
                event.preventDefault();
                closeAlert();
            }
        });
    }

    function processQueue() {
        if (isOpen || !queue.length) {
            return;
        }

        ensureModal();

        var nextMessage = queue.shift();
        var messageElement = document.getElementById('gh-alert-message');
        if (messageElement) {
            messageElement.textContent = String(nextMessage || '');
        }

        bodyElement.classList.add('is-open');
        isOpen = true;
        confirmButton.focus();
    }

    window.nativeAlert = window.alert.bind(window);
    window.alert = function (message) {
        queue.push(message);
        processQueue();
    };
})();
