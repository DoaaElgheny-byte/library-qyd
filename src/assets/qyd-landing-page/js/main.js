window.addEventListener("load", function () {
    document.body.style.overflowY = 'auto'
    document.getElementById("loading").classList.add('d-none')
    AOS.init();

    // 1) Select all anchor tags that start with "https"
    const links = document.querySelectorAll('a[href^="https"]');
    links.forEach(link => {
        if (window.location.hostname == 'test.qyd.sa') {
            link.href = link.href.replace('https://qyd.sa', 'https://test.qyd.sa')
        }

        else if (window.location.hostname == 'qyd.sa') {
            link.href = link.href.replace('https://test.qyd.sa', 'https://qyd.sa')
        }
    });

});


function openWhatsApp() {
    // Basic check for iPhone in User-Agent
    var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS) {
        // iPhone or iPad
        window.open('https://wa.me/966552202366', '_blank');
    } else {
        // Other devices (Android, desktop, etc.)
        window.open('https://api.whatsapp.com/send?phone=966552202366', '_blank');
    }
}

// Example: attach it to a button click
document.getElementById('openWhatsApp').addEventListener('click', openWhatsApp);