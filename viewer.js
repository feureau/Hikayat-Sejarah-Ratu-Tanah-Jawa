// viewer.js - Handles fetching markdown, rendering, navigation and zoom logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('collection');
    let pageNum = parseInt(urlParams.get('page'));

    if (!collectionId || !COLLECTIONS[collectionId]) {
        showError("Invalid or missing collection parameter.");
        return;
    }

    const collection = COLLECTIONS[collectionId];
    if (isNaN(pageNum) || pageNum < collection.range.start) {
        pageNum = collection.range.start;
    } else if (pageNum > collection.range.end) {
        pageNum = collection.range.end;
    }

    // 2. Setup UI
    document.getElementById('doc-title').textContent = `${collection.title} - Page ${pageNum}`;
    setupNavigation(collectionId, pageNum, collection);

    // 3. Load Content
    const paddedId = padId(pageNum, collection.padLength);
    loadImage(collection.imagePath(paddedId), paddedId);
    loadMarkdown(collection, paddedId);

    // 4. Setup Image Zoom/Pan
    setupImageZoom();

    // 5. Setup Keyboard Nav
    setupKeyboardNav(collectionId, pageNum, collection);
});

function setupNavigation(collectionId, pageNum, collection) {
    const prevBtns = [document.getElementById('btn-prev'), document.getElementById('foot-btn-prev')];
    const nextBtns = [document.getElementById('btn-next'), document.getElementById('foot-btn-next')];

    if (pageNum > collection.range.start) {
        prevBtns.forEach(btn => {
            btn.href = `?collection=${collectionId}&page=${pageNum - 1}`;
            btn.removeAttribute('aria-disabled');
        });
    } else {
        prevBtns.forEach(btn => btn.setAttribute('aria-disabled', 'true'));
    }

    if (pageNum < collection.range.end) {
        nextBtns.forEach(btn => {
            btn.href = `?collection=${collectionId}&page=${pageNum + 1}`;
            btn.removeAttribute('aria-disabled');
        });
    } else {
        nextBtns.forEach(btn => btn.setAttribute('aria-disabled', 'true'));
    }
}

function setupKeyboardNav(collectionId, pageNum, collection) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && pageNum > collection.range.start) {
            window.location.href = `?collection=${collectionId}&page=${pageNum - 1}`;
        } else if (e.key === 'ArrowRight' && pageNum < collection.range.end) {
            window.location.href = `?collection=${collectionId}&page=${pageNum + 1}`;
        }
    });
}

function loadImage(imagePath, id) {
    const imgEl = document.getElementById('scan');
    const noteEl = document.getElementById('scan-note');
    const linkEl = document.getElementById('scan-link');

    imgEl.src = imagePath;
    noteEl.textContent = imagePath.split('/').pop();
    linkEl.href = imagePath;

    imgEl.onerror = () => {
        noteEl.textContent = `Image not found: ${imagePath}`;
        imgEl.style.display = 'none';
    };
}

async function loadMarkdown(collection, id) {
    const javaneseDiv = document.getElementById('transcript-javanese');
    const englishDiv = document.getElementById('transcript-english');

    javaneseDiv.innerHTML = '<div class="loading-msg">Loading transcription...</div>';

    try {
        // Fetch Javanese
        const mdRes = await fetch(collection.mdPath(id));
        if (!mdRes.ok) throw new Error(`Transcription not found (${mdRes.status})`);
        const mdText = await mdRes.text();

        let javaneseHtml = marked.parse(mdText);
        if (collection.type === 'typescript') {
            javaneseHtml = `<div class="lang-label">Javanese Typescript</div>` + javaneseHtml;
        } else {
            javaneseHtml = `<div class="lang-label">Diplomatic Transcription</div>` + javaneseHtml;
        }
        javaneseDiv.innerHTML = javaneseHtml;

        // Fetch English if typescript
        if (collection.type === 'typescript' && collection.enPath) {
            englishDiv.innerHTML = '<div class="loading-msg">Loading English translation...</div>';
            const enRes = await fetch(collection.enPath(id));
            if (enRes.ok) {
                const enText = await enRes.text();
                englishDiv.innerHTML = `<div class="lang-label">English Translation</div>` + marked.parse(enText);
            } else {
                englishDiv.innerHTML = `<div class="error-msg">English translation not found.</div>`;
            }
        }
    } catch (e) {
        javaneseDiv.innerHTML = `<div class="error-msg">Error loading content: ${e.message}.<br><br>Make sure you are running a local web server (e.g., <code>python -m http.server</code>).</div>`;
        englishDiv.innerHTML = '';
    }
}

function showError(msg) {
    document.querySelector('.viewer').innerHTML = `<div class="error-msg">${msg}</div>`;
}

// Image Zoom and Pan Logic
function setupImageZoom() {
    const container = document.getElementById('scan-container');
    const img = document.getElementById('scan');

    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;

    function setTransform() {
        img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        panning = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        img.style.cursor = 'grabbing';
        img.style.transition = 'none'; // disable transition while panning
    });

    container.addEventListener('mouseup', () => {
        panning = false;
        img.style.cursor = 'zoom-in';
        img.style.transition = 'transform 0.1s ease'; // re-enable transition
    });

    container.addEventListener('mouseleave', () => {
        panning = false;
        img.style.cursor = 'zoom-in';
        img.style.transition = 'transform 0.1s ease';
    });

    container.addEventListener('mousemove', (e) => {
        if (!panning) return;
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        setTransform();
    });

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const xs = (e.clientX - pointX) / scale;
        const ys = (e.clientY - pointY) / scale;
        const delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

        if (delta > 0) {
            scale *= 1.2;
        } else {
            scale /= 1.2;
        }

        // Cap zoom
        scale = Math.min(Math.max(0.5, scale), 5);

        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;
        setTransform();
    }, { passive: false });

    container.addEventListener('dblclick', (e) => {
        e.preventDefault();
        scale = 1;
        pointX = 0;
        pointY = 0;
        setTransform();
    });
}