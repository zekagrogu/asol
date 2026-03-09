// ============================================
// OZNACI DA JE JS UCITAN - kartice se animiraju
// ============================================
document.body.classList.add('js-loaded');

// ============================================
// DARK MODE TOGGLE
// ============================================
const toggleBtn = document.getElementById('darkToggle');

// Pokusaj da ucitas preferencu (moze failovati na file:// protokolu)
let isDarkStored = false;
try { isDarkStored = localStorage.getItem('lazar-dark-mode') === 'true'; } catch (e) { }

if (isDarkStored) {
    document.body.classList.add('dark-mode');
    if (toggleBtn) toggleBtn.textContent = '☀️';
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
        const isDark = document.body.classList.toggle('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        try { localStorage.setItem('lazar-dark-mode', isDark); } catch (e) { }
    });
}

// ============================================
// POW / BAM CLICK EFFECTS
// ============================================
const burstWords = ['POW!', 'BAM!', 'ZAP!', 'BOOM!', 'WOW!', 'SPLAT!', 'KAPOW!', 'WHAM!'];
const burstColors = ['#FF0000', '#FF8C00', '#FFD700', '#00BFFF', '#FF69B4', '#7B68EE'];

document.addEventListener('click', function (e) {
    // Ne pucaj efekat na dugme za dark mode
    if (e.target.id === 'darkToggle') return;

    const word = burstWords[Math.floor(Math.random() * burstWords.length)];
    const color = burstColors[Math.floor(Math.random() * burstColors.length)];
    const outline = (color === '#FFD700') ? '#FF8C00' : '#FFD700';

    const el = document.createElement('div');
    el.classList.add('click-burst');
    el.textContent = word;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.color = color;
    el.style.webkitTextStroke = '3px ' + outline;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 750);
});

// ============================================
// CARD ENTRANCE ANIMATIONS (IntersectionObserver)
// ============================================
const cards = document.querySelectorAll('.card');

if ('IntersectionObserver' in window && cards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.card'));
                const idx = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = (idx * 80) + 'ms';
                entry.target.classList.add('card-visible');
                observer.unobserve(entry.target);
                // Nakon sto se animacija zavrsi, ukloni je da hover moze raditi
                entry.target.addEventListener('animationend', function () {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                    entry.target.classList.remove('card-visible');
                }, { once: true });
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    cards.forEach(card => observer.observe(card));
} else {
    // Fallback - prikaži sve kartice odmah ako nema IntersectionObserver
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
}