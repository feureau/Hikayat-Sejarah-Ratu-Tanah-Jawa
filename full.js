// full.js - Continuous Full Manuscript Reader logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('collection');
    const targetLayer = urlParams.get('layer'); // 'pegon', 'latin', 'english', 'typescript'

    if (!collectionId || !COLLECTIONS[collectionId]) {
        showError("Invalid or missing collection parameter.");
        return;
    }

    const collection = COLLECTIONS[collectionId];
    document.getElementById('doc-title').textContent = `Full Text — ${collection.title}`;

    // 2. Setup Page Jump Dropdown
    setupJumpDropdown(collectionId, collection);

    // 3. Setup Tabs
    setupTabs(collection, targetLayer);

    // 4. Load All Markdown Pages
    loadFullMarkdown(collectionId, collection);
});

function setupJumpDropdown(collectionId, collection) {
    const select = document.getElementById('page-jump');
    select.innerHTML = '<option value="">Jump to Page…</option>';

    for (let i = collection.range.start; i <= collection.range.end; i++) {
        const opt = document.createElement('option');
        opt.value = `page-${i}`;
        opt.textContent = `Page ${i}`;
        select.appendChild(opt);
    }

    select.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
            const el = document.getElementById(val);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

function setupTabs(collection, targetLayer) {
    const tabContainer = document.getElementById('tab-buttons');
    const tabTranslationBtn = document.getElementById('btn-tab-translation');
    const tabEnBtn = document.querySelector('[data-target="tab-en"]');

    if (collection.enPath) {
        tabContainer.style.display = 'flex';

        if (collection.type === 'typescript') {
            tabEnBtn.textContent = 'English Translation';
            tabTranslationBtn.style.display = 'none';
        } else {
            tabEnBtn.textContent = 'Latin Transliteration';
            if (collection.translationPath) {
                tabTranslationBtn.style.display = 'block';
            } else {
                tabTranslationBtn.style.display = 'none';
            }
        }

        const btns = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');

                btns.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');

                localStorage.setItem('activeTab', target);
            });
        });

        // Determine initial active tab based on layer parameter or localStorage
        let initialTabTarget = null;
        if (targetLayer) {
            const layerLower = targetLayer.toLowerCase();
            if (layerLower === 'latin' || layerLower === 'transliteration') {
                initialTabTarget = 'tab-en';
            } else if (layerLower === 'english' || layerLower === 'translation') {
                if (collection.type === 'typescript') {
                    initialTabTarget = 'tab-en';
                } else {
                    initialTabTarget = 'tab-translation';
                }
            } else if (layerLower === 'pegon' || layerLower === 'typescript' || layerLower === 'transcription') {
                initialTabTarget = 'tab-md';
            }
        }

        if (!initialTabTarget) {
            initialTabTarget = localStorage.getItem('activeTab') || 'tab-md';
        }

        const initialBtn = document.querySelector(`[data-target="${initialTabTarget}"]`);
        if (initialBtn && initialBtn.style.display !== 'none') {
            initialBtn.click();
        }
    } else {
        tabContainer.style.display = 'none';
    }
}

async function loadFullMarkdown(collectionId, collection) {
    const mdDiv = document.getElementById('tab-md');
    const enDiv = document.getElementById('tab-en');
    const transDiv = document.getElementById('tab-translation');

    mdDiv.innerHTML = '<div class="loading-msg">Loading all pages for transcription...</div>';
    if (collection.enPath) enDiv.innerHTML = '<div class="loading-msg">Loading all pages for secondary text...</div>';
    if (collection.translationPath) transDiv.innerHTML = '<div class="loading-msg">Loading all pages for translation...</div>';

    try {
        const pages = [];
        for (let i = collection.range.start; i <= collection.range.end; i++) {
            pages.push(i);
        }

        // 1. Fetch Primary Transcription Pages
        const mdHtmlBlocks = await Promise.all(pages.map(async (pNum) => {
            const paddedId = padId(pNum, collection.padLength);
            const url = encodeURI(collection.mdPath(paddedId));
            try {
                const res = await fetch(url, { cache: "no-store" });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const text = await res.text();
                return renderPageBlock(collectionId, collection.manuscript, pNum, text);
            } catch (e) {
                return `<div class="page-block" id="page-${pNum}"><div class="error-msg">Page ${pNum}: Could not load (${e.message})</div></div>`;
            }
        }));
        mdDiv.innerHTML = mdHtmlBlocks.join('');
        addHeaderIds(mdDiv);

        // 2. Fetch Secondary Text Pages
        if (collection.enPath) {
            const enHtmlBlocks = await Promise.all(pages.map(async (pNum) => {
                const paddedId = padId(pNum, collection.padLength);
                const url = encodeURI(collection.enPath(paddedId));
                try {
                    const res = await fetch(url, { cache: "no-store" });
                    if (!res.ok) throw new Error(`Status ${res.status}`);
                    const text = await res.text();
                    return renderPageBlock(collectionId, collection.manuscript, pNum, text);
                } catch (e) {
                    return `<div class="page-block" id="page-${pNum}"><div class="error-msg">Page ${pNum}: Secondary text not found</div></div>`;
                }
            }));
            enDiv.innerHTML = enHtmlBlocks.join('');
            addHeaderIds(enDiv);
        }

        // 3. Fetch Tertiary Text Pages
        if (collection.translationPath) {
            const transHtmlBlocks = await Promise.all(pages.map(async (pNum) => {
                const paddedId = padId(pNum, collection.padLength);
                const url = encodeURI(collection.translationPath(paddedId));
                try {
                    const res = await fetch(url, { cache: "no-store" });
                    if (!res.ok) throw new Error(`Status ${res.status}`);
                    const text = await res.text();
                    return renderPageBlock(collectionId, collection.manuscript, pNum, text);
                } catch (e) {
                    return `<div class="page-block" id="page-${pNum}"><div class="error-msg">Page ${pNum}: Translation not found</div></div>`;
                }
            }));
            transDiv.innerHTML = transHtmlBlocks.join('');
            addHeaderIds(transDiv);
        }

        setupGithubButtons();

    } catch (e) {
        showError(`Failed to load full document: ${e.message}`);
    }
}

function renderPageBlock(collectionId, manuscriptName, pageNum, mdText) {
    const docId = `${manuscriptName} - Page ${pageNum}`;
    const buttonHtml = `<div style="margin-bottom: 15px;"><a href="#" class="github-report-btn btn" data-docid="${docId}" style="background:#2ea043; border-color:#2ea043; color:white; display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; padding:4px 10px;"><svg height="14" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="14" style="fill:white;"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg> Report Issue</a></div>`;

    const parsedContent = marked.parse(mdText);

    return `
    <div class="page-block" id="page-${pageNum}">
      <div class="page-header">
        <h2>Page ${pageNum}</h2>
        <a href="viewer.html?collection=${collectionId}&page=${pageNum}" class="dual-btn">View Scan & Dual Pane →</a>
      </div>
      <div class="page-body">
        ${buttonHtml}
        ${parsedContent}
      </div>
    </div>`;
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

function showError(msg) {
    document.querySelector('.wrap').innerHTML = `<div class="error-msg">${msg}</div>`;
}