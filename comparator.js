// comparator.js - Logic for the Folio-Anchored Parallel Comparator

let currentMs = 'sejarah';
let currentFolio = 1;
let isSyncLocked = true;

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL Parsing
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('manuscript') && COMPARATOR_INDEX[urlParams.get('manuscript')]) {
        currentMs = urlParams.get('manuscript');
    }
    const fParam = parseInt(urlParams.get('folio'));
    if (!isNaN(fParam)) {
        currentFolio = fParam;
    }

    // 2. Setup UI Hooks
    document.getElementById('ms-select').value = currentMs;
    setupFolioDropdown();

    document.getElementById('ms-select').addEventListener('change', (e) => {
        currentMs = e.target.value;
        currentFolio = 1;
        setupFolioDropdown();
        loadComparator(currentMs, currentFolio);
        updateUrl();
    });

    document.getElementById('folio-select').addEventListener('change', (e) => {
        currentFolio = parseInt(e.target.value);
        loadComparator(currentMs, currentFolio);
        updateUrl();
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (currentFolio > 1) {
            currentFolio--;
            document.getElementById('folio-select').value = currentFolio;
            loadComparator(currentMs, currentFolio);
            updateUrl();
        }
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        const maxFolios = Object.keys(COMPARATOR_INDEX[currentMs]).length;
        if (currentFolio < maxFolios) {
            currentFolio++;
            document.getElementById('folio-select').value = currentFolio;
            loadComparator(currentMs, currentFolio);
            updateUrl();
        }
    });

    const btnSync = document.getElementById('btn-sync');
    btnSync.addEventListener('click', () => {
        isSyncLocked = !isSyncLocked;
        if (isSyncLocked) {
            btnSync.classList.add('active');
            btnSync.textContent = '🔒 Sync Locked';
            loadComparator(currentMs, currentFolio); // force resync
        } else {
            btnSync.classList.remove('active');
            btnSync.textContent = '🔓 Free Scrolling';
        }
    });

    // Tab Hooks
    setupColumnTabs('left-tab', 'left-scan', 'left-pegon', 'left-latin', 'left-en');
    setupColumnTabs('right-tab', 'right-scan', 'right-md', 'right-en');

    // Zoom Hooks
    setupImageZoom('left-scan', 'left-scan-img');
    setupImageZoom('right-scan', 'right-scan-img');

    // Initial Load
    loadComparator(currentMs, currentFolio);
});

function setupFolioDropdown() {
    const select = document.getElementById('folio-select');
    select.innerHTML = '';
    const maxFolios = Object.keys(COMPARATOR_INDEX[currentMs]).length;
    for (let i = 1; i <= maxFolios; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Folio ${i}`;
        select.appendChild(opt);
    }
    select.value = currentFolio;
}

function updateUrl() {
    const newUrl = `${window.location.pathname}?manuscript=${currentMs}&folio=${currentFolio}`;
    window.history.pushState({path:newUrl}, '', newUrl);
}

function setupColumnTabs(btnClass, ...contentIds) {
    const btns = document.querySelectorAll(`.${btnClass}`);
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            btns.forEach(b => b.classList.remove('active'));
            contentIds.forEach(id => document.getElementById(id).classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(target).classList.add('active');

            // if switching to a text tab on right while sync locked, trigger highlight scroll again
            if (isSyncLocked && btnClass === 'right-tab' && target !== 'right-scan') {
                const map = COMPARATOR_INDEX[currentMs][currentFolio];
                if (map) highlightAndScrollRight(map.anchorTag, target);
            }
        });
    });
}

async function loadComparator(ms, folio) {
    const map = COMPARATOR_INDEX[ms][folio];
    if (!map) return;

    document.getElementById('left-title').textContent = `1838 Pegon — Folio ${folio}`;
    document.getElementById('right-title').textContent = `1973 Typescript — (Holds Folio ${folio})`;

    // Load Left
    loadImage('left-scan-img', 'left-scan-note', 'left-scan-link', map.pegonScan);
    fetchAndRender(map.pegonMd, 'left-pegon');
    fetchAndRender(map.pegonLatin, 'left-latin');
    fetchAndRender(map.pegonEn, 'left-en');

    // Load Right
    if (isSyncLocked) {
        loadImage('right-scan-img', 'right-scan-note', 'right-scan-link', map.tsScan);
        await fetchAndRender(map.tsMd, 'right-md');
        await fetchAndRender(map.tsEn, 'right-en');

        // Find active text tab on right and scroll to anchor
        const activeRightTab = document.querySelector('.right-tab.active').getAttribute('data-target');
        if (activeRightTab !== 'right-scan') {
            highlightAndScrollRight(map.anchorTag, activeRightTab);
        }
    }
}

async function fetchAndRender(path, containerId) {
    const div = document.getElementById(containerId);
    div.innerHTML = '<div class="loading-msg">Loading text...</div>';
    try {
        const res = await fetch('./' + encodeURI(path), { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status}`);
        let text = await res.text();
        div.innerHTML = marked.parse(text);
    } catch (e) {
        div.innerHTML = `<div class="error-msg">Failed to load: ${path.split('/').pop()}</div>`;
    }
}

function loadImage(imgId, noteId, linkId, path) {
    const imgEl = document.getElementById(imgId);
    const noteEl = document.getElementById(noteId);
    const linkEl = document.getElementById(linkId);

    const encoded = encodeURI('./' + path);
    imgEl.src = encoded;
    noteEl.textContent = path.split('/').pop();
    linkEl.href = encoded;

    imgEl.onerror = () => {
        noteEl.textContent = `Image missing: ${path.split('/').pop()}`;
        imgEl.src = "data:image/svg+xml;utf8," + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect fill="#222" width="100%" height="100%"/><text x="50%" y="50%" fill="#888" font-family="sans-serif" font-size="14" text-anchor="middle">Missing Image</text></svg>`
        );
    };
}

function highlightAndScrollRight(anchorTag, containerId) {
    const container = document.getElementById(containerId);
    // Find the text node containing the anchor tag (e.g. "[p. 4.]")
    // We use a tree walker to safely inject HTML without breaking markdown rendering

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let found = false;

    // Normalize anchor search string (e.g. "[p. 4.]")
    const searchStr = anchorTag.toLowerCase().replace(/\s+/g, '');

    while ((node = walker.nextNode())) {
        if (node.nodeValue.toLowerCase().replace(/\s+/g, '').includes(searchStr)) {
            const span = document.createElement('span');
            span.className = 'anchor-highlight';
            span.id = 'active-anchor';

            // simple string replace on the parent HTML is easiest if we're careful
            const parent = node.parentNode;
            const originalHTML = parent.innerHTML;

            // Regex to find exact tag preserving original spaces
            const regexStr = anchorTag.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\./g, '\\.').replace(/\s+/g, '\\s*');
            const regex = new RegExp(`(${regexStr})`, 'i');

            if (regex.test(originalHTML)) {
                parent.innerHTML = originalHTML.replace(regex, `<span class="anchor-highlight" id="active-anchor">$1</span>`);
                found = true;
                break;
            }
        }
    }

    if (found) {
        setTimeout(() => {
            const el = document.getElementById('active-anchor');
            if (el) {
                // Scroll the container so element is near top
                container.scrollTop = el.offsetTop - 50;
            }
        }, 100);
    }
}

function setupImageZoom(containerId, imgId) {
    const container = document.getElementById(containerId);
    const img = document.getElementById(imgId);
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const updateTransform = () => { img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; };

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        const rect = img.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        translateX = (translateX - offsetX) * delta + offsetX;
        translateY = (translateY - offsetY) * delta + offsetY;
        scale *= delta;
        if (scale < 0.2) scale = 0.2;
        if (scale > 5) scale = 5;
        updateTransform();
    }, { passive: false });

    container.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        img.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener('mouseup', () => {
        if (!isPanning) return;
        isPanning = false;
        img.style.cursor = 'zoom-in';
    });

    container.addEventListener('dblclick', () => {
        scale = 1; translateX = 0; translateY = 0; updateTransform();
    });
}