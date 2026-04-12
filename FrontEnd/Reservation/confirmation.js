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

    if (platform === 'viber') {
        alert(`Opening Viber for ${CONTACT_DETAILS.viberLocal}`);
    }

    window.open(targetUrl, '_blank');
}

function continueReservationFlow() {
    const pendingPlatform = localStorage.getItem('pendingContactPlatform');
    if (!pendingPlatform) {
        return;
    }

    const now = Date.now();
    if (isContinuePromptOpen || now - lastContinuePromptAt < 800) {
        return;
    }

    isContinuePromptOpen = true;
    lastContinuePromptAt = now;

    const shouldContinue = confirm(
        `Finished negotiating via ${pendingPlatform}? Click OK to continue your reservation steps.`
    );

    isContinuePromptOpen = false;

    if (shouldContinue) {
        localStorage.removeItem('pendingContactPlatform');
        window.location.href = 'reserved-plants.html';
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        continueReservationFlow();
    }
});

window.addEventListener('focus', continueReservationFlow);

document.addEventListener('DOMContentLoaded', continueReservationFlow);
