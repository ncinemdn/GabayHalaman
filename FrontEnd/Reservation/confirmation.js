const CONTACT_DETAILS = {
    email: 'christinelumban025@gmail.com',
    viberLocal: '09937590358',
    viberInternational: '+639937590358',
    facebookMessenger: 'https://www.facebook.com/share/1Dbsh6mBu1/?mibextid=wwXIfr'
};

let isContinuePromptOpen = false;
let lastContinuePromptAt = 0;

function selectPlatform(platform) {
    let platformName = '';
    let targetUrl = '';

    switch (platform) {
        case 'gmail':
            platformName = 'Email';
            targetUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_DETAILS.email)}&su=${encodeURIComponent('Plant Reservation Inquiry')}`;
            break;
        case 'viber':
            platformName = 'Viber';
            targetUrl = `viber://chat?number=${encodeURIComponent(CONTACT_DETAILS.viberInternational)}`;
            break;
        case 'messenger':
            platformName = 'Facebook/Messenger';
            targetUrl = CONTACT_DETAILS.facebookMessenger;
            break;
        default:
            return;
    }

    localStorage.setItem('selectedPlatform', platform);
    localStorage.setItem('pendingContactPlatform', platformName);
    sessionStorage.setItem('platformOpened', '1');

    if (platform === 'viber') {
        alert(`Opening Viber for ${CONTACT_DETAILS.viberLocal}`);
    }

    window.open(targetUrl, '_blank');
}

function cancelReservation() {
    localStorage.removeItem('pendingContactPlatform');
    localStorage.removeItem('selectedPlatform');
    localStorage.removeItem('reservations');
    localStorage.removeItem('deliveryDetails');
    sessionStorage.removeItem('platformOpened');
    window.location.href = 'reservation.html';
}

function showNegotiationPrompt(pendingPlatform) {
    // Build overlay
    var overlay = document.createElement('div');
    overlay.id = 'gh-confirm-overlay';
    overlay.style.cssText = [
        'position:fixed;inset:0;background:rgba(33,49,24,0.45);',
        'display:flex;align-items:center;justify-content:center;',
        'padding:16px;z-index:9999;'
    ].join('');

    overlay.innerHTML = [
        '<div style="width:min(520px,100%);background:#f7f0e3;border:2px solid #7fa843;',
        'border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.25);overflow:hidden;">',
        '<div style="background:#7fa843;color:#fff;font-family:Inria Serif,serif;',
        'font-weight:700;font-size:20px;padding:14px 20px;">Reservation Negotiation</div>',
        '<div style="color:#2f4a1f;font-family:Poppins,sans-serif;font-size:16px;',
        'line-height:1.55;padding:22px 20px 8px;">',
        'Finished negotiating via <strong>' + pendingPlatform + '</strong>?<br>',
        'Click <strong>Continue</strong> to proceed with your reservation, or ',
        '<strong>Cancel Reservation</strong> to remove it.',
        '</div>',
        '<div style="display:flex;justify-content:flex-end;gap:10px;padding:16px 20px 20px;">',
        '<button id="gh-confirm-cancel" type="button" style="border:2px solid #7fa843;',
        'border-radius:999px;background:transparent;color:#3b4e31;',
        'font-family:Poppins,sans-serif;font-weight:600;font-size:15px;',
        'padding:10px 22px;cursor:pointer;">Cancel Reservation</button>',
        '<button id="gh-confirm-ok" type="button" style="border:none;border-radius:999px;',
        'background:#3b4e31;color:#fff;font-family:Poppins,sans-serif;',
        'font-weight:600;font-size:15px;padding:10px 22px;cursor:pointer;">Continue</button>',
        '</div>',
        '</div>'
    ].join('');

    document.body.appendChild(overlay);

    document.getElementById('gh-confirm-ok').addEventListener('click', function () {
        overlay.remove();
        isContinuePromptOpen = false;
        localStorage.removeItem('pendingContactPlatform');
        window.location.href = 'reserved-plants.html';
    });

    document.getElementById('gh-confirm-cancel').addEventListener('click', function () {
        overlay.remove();
        isContinuePromptOpen = false;
        cancelReservation();
    });

    document.addEventListener('keydown', function onKey(e) {
        if (!document.getElementById('gh-confirm-overlay')) {
            document.removeEventListener('keydown', onKey);
            return;
        }
        if (e.key === 'Enter') {
            document.getElementById('gh-confirm-ok') && document.getElementById('gh-confirm-ok').click();
        }
        if (e.key === 'Escape') {
            document.getElementById('gh-confirm-cancel') && document.getElementById('gh-confirm-cancel').click();
        }
    });
}

function continueReservationFlow() {
    const pendingPlatform = localStorage.getItem('pendingContactPlatform');
    if (!pendingPlatform || !sessionStorage.getItem('platformOpened')) {
        return;
    }

    const now = Date.now();
    if (isContinuePromptOpen || now - lastContinuePromptAt < 800) {
        return;
    }

    isContinuePromptOpen = true;
    lastContinuePromptAt = now;

    showNegotiationPrompt(pendingPlatform);
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        continueReservationFlow();
    }
});

window.addEventListener('focus', continueReservationFlow);
