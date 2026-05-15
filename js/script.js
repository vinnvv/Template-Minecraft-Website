/* =============================================
   ZERAPHINE — script.js
   ============================================= */

// ====== MASUK KE WEBSITE ======
function masukKeWeb() {
    const intro = document.getElementById('intro-screen');
    const body  = document.body;
    if (intro) {
        intro.classList.add('intro-hidden');
        body.classList.remove('no-scroll');
        sessionStorage.setItem('visited', 'true');
        setTimeout(() => { intro.style.display = 'none'; }, 1050);
    }
}

// ====== TOGGLE MENU MOBILE ======
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('open');
}

// ====== COPY IP ======
function copyIP() {
    const ip = document.getElementById('serverIP').innerText;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(ip);
    } else {
        const el = document.createElement('textarea');
        el.value = ip;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
    const toast = document.getElementById('copy-toast');
    if (toast) {
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }
}

// ====== KIRIM PESAN (contact form) ======
function kirimPesan() {
    const toast = document.getElementById('form-toast');
    if (toast) {
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
}

// ====== UPDATE PLAYER COUNT ======
async function updateServerStats() {
    const ip      = 'play.zeraphinesmp.xyz';
    const playerEl = document.getElementById('player-count');
    if (!playerEl) return;
    try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 5000);
        const res  = await fetch(`https://api.mcsrvstat.us/2/${ip}`, { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        if (data.online) playerEl.innerText = data.players.online;
    } catch (e) {
        console.log('Stats timeout/error:', e);
    }
}

// ====== DOM READY ======
document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');

    // Skip intro jika sudah pernah masuk di sesi ini
    if (sessionStorage.getItem('visited') === 'true') {
        const intro = document.getElementById('intro-screen');
        if (intro) intro.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', masukKeWeb);
    }

    updateServerStats();
});
