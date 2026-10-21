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

    // Setup Tabs first
    setupTabs(collection);
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

    const encodedPath = encodeURI(imagePath);
    imgEl.src = encodedPath;
    noteEl.textContent = imagePath.split('/').pop();
    linkEl.href = encodedPath;

    imgEl.onerror = () => {
        noteEl.textContent = `Image not found: ${imagePath}`;
        imgEl.alt = noteEl.textContent;
        imgEl.src = "data:image/svg+xml;utf8," + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320">` +
            `<rect fill="#222" width="100%" height="100%"/>` +
            `<text x="50%" y="50%" fill="#888" font-family="sans-serif" ` +
            `font-size="14" text-anchor="middle">Image not found: ${imagePath.split('/').pop()}</text></svg>`
        );
    };
}

function setupTabs(collection) {
    const tabContainer = document.getElementById('tab-buttons');
    const tabTranslationBtn = document.getElementById('btn-tab-translation');
    const tabEnBtn = document.querySelector('[data-target="tab-en"]');

    // Only show tabs if there is an enPath
    if (collection.enPath) {
        tabContainer.style.display = 'flex';

        // Rename middle tab based on collection type
        if (collection.type === 'typescript') {
            tabEnBtn.textContent = 'English Translation';
            tabTranslationBtn.style.display = 'none'; // No third tab for typescript
        } else {
            tabEnBtn.textContent = 'Latin Transliteration';
            if (collection.translationPath) {
                tabTranslationBtn.style.display = 'block';
            } else {
                tabTranslationBtn.style.display = 'none';
            }
        }

        // Setup Tab Clicking
        const btns = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');

                // Update UI
                btns.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');

                // Persist state
                localStorage.setItem('activeTab', target);
            });
        });

        // Restore State
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            const savedBtn = document.querySelector(`[data-target="${savedTab}"]`);
            if (savedBtn && savedBtn.style.display !== 'none') {
                savedBtn.click();
            }
        }
    } else {
        tabContainer.style.display = 'none';
    }
}

async function loadMarkdown(collection, id) {
    const mdDiv = document.getElementById('tab-md');
    const enDiv = document.getElementById('tab-en');
    const transDiv = document.getElementById('tab-translation');

    mdDiv.innerHTML = '<div class="loading-msg">Loading transcription...</div>';
    enDiv.innerHTML = '';
    transDiv.innerHTML = '';

    try {
        // Fetch Primary Transcription
        const mdRes = await fetch(encodeURI(collection.mdPath(id)), { cache: "no-store" });
        if (!mdRes.ok) throw new Error(`Transcription not found (${mdRes.status})`);
        const mdText = await mdRes.text();

        const buttonHtml = `<div style="margin-bottom: 20px;"><a href="#" class="github-report-btn btn" data-docid="${collection.manuscript} - Page ${id}" style="background:#2ea043; border-color:#2ea043; color:white; display:inline-flex; align-items:center; gap:6px;"><svg height="16" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" style="fill:white;"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg> Report Issue on GitHub</a></div>`;

        mdDiv.innerHTML = buttonHtml + marked.parse(mdText);
        addHeaderIds(mdDiv);

        // Fetch Secondary Text (Transliteration or English)
        if (collection.enPath) {
            enDiv.innerHTML = '<div class="loading-msg">Loading secondary text...</div>';
            const enRes = await fetch(encodeURI(collection.enPath(id)), { cache: "no-store" });
            if (enRes.ok) {
                const enText = await enRes.text();
                enDiv.innerHTML = buttonHtml + marked.parse(enText);
                addHeaderIds(enDiv);
            } else {
                enDiv.innerHTML = `<div class="error-msg">Secondary text not found.</div>`;
            }
        }

        // Fetch Tertiary Text (Translation for Pegon)
        if (collection.translationPath) {
            transDiv.innerHTML = '<div class="loading-msg">Loading translation...</div>';
            const transRes = await fetch(encodeURI(collection.translationPath(id)), { cache: "no-store" });
            if (transRes.ok) {
                const transText = await transRes.text();
                transDiv.innerHTML = buttonHtml + marked.parse(transText);
                addHeaderIds(transDiv);
            } else {
                transDiv.innerHTML = `<div class="error-msg">English translation not found.</div>`;
            }
        }

        setupGithubButtons();

    } catch (e) {
        mdDiv.innerHTML = `<div class="error-msg">Error loading content: ${e.message}.<br><br>Make sure you are running a local web server (e.g., <code>python -m http.server 8000 --bind 127.0.0.1</code>).</div>`;
    }
}

function setupGithubButtons() {
    const GITHUB_REPO = "Feureau/Hikayat-Sejarah-Ratu-Tanah-Jawa";
    document.querySelectorAll(".github-report-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const docId = btn.getAttribute("data-docid");
            const sel = window.getSelection();
            let selectionText = "";

            if (sel.rangeCount > 0) {
                selectionText = sel.toString().trim();
            }

            let body = `**Transcription/Translation Issue:** ${docId}\n\n`;
            if (selectionText) {
                body += `**Original Text:**\n> ${selectionText.replace(/\n/g, '\n> ')}\n\n`;
            }
            body += `**Suggested Correction / Notes:**\n`;

            const url = `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent('Transcription Note: ' + docId)}&body=${encodeURIComponent(body)}`;
            window.open(url, '_blank');
        });
    });
}

function showError(msg) {
    document.querySelector('.viewer').innerHTML = `<div class="error-msg">${msg}</div>`;
}

// Header Auto-Linking Logic
function addHeaderIds(root) {
    if (!root) return;
    root.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(h => {
        h.id = h.textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    });
}

// Image Zoom and Pan Logic
function setupImageZoom() {
    const img = document.getElementById('scan');
    img.style.cursor = "zoom-in";

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const updateTransform = () => {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    // Wheel zoom (mouse wheel or touchpad)
    img.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;

        // Compute cursor position relative to image
        const rect = img.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Adjust translation to keep point under cursor stationary
        translateX = (translateX - offsetX) * delta + offsetX;
        translateY = (translateY - offsetY) * delta + offsetY;
        scale *= delta;

        // Clamp scale
        if (scale < 0.2) scale = 0.2;
        if (scale > 5) scale = 5;

        updateTransform();
    }, { passive: false });

    // Drag to pan
    img.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // left button only
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

    // Reset on double click
    img.addEventListener('dblclick', () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });

    // Ensure transform origin is top-left for proper calculations
    img.style.transformOrigin = '0 0';
}