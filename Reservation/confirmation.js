function selectPlatform(platform) {
    let contactInfo = '';
    let platformName = '';
   
    switch(platform) {
        case 'gmail':
            platformName = 'Gmail';
            contactInfo = 'christinelumban025@gmail.com';
            // Open Gmail compose
            window.open('mailto:christinelumban025@gmail.com?subject=Plant Reservation Inquiry', '_blank');
            break;
        case 'viber':
            platformName = 'Viber';
            contactInfo = '+63 XXX XXX XXXX';
            alert('Please contact us via Viber at: ' + contactInfo);
            break;
        case 'messenger':
            platformName = 'Messenger';
            contactInfo = 'https://www.facebook.com/share/1Dbsh6mBu1/?mibextid=wwXIfr';
            // Open Messenger
            window.open('https://www.facebook.com/share/1Dbsh6mBu1/?mibextid=wwXIfr', '_blank');
            break;
    }
   
    // Store the selected platform
    localStorage.setItem('selectedPlatform', platform);
   
    // After user selects platform, navigate to reserved plants page after a short delay
    setTimeout(() => {
        if (confirm('Your reservation has been recorded! Click OK to view all your reserved plants.')) {
            window.location.href = 'reserved-plants.html';
        }
    }, 1000);
}
