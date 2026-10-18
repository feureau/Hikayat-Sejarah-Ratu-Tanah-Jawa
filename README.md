# Hikayat & Sejarah Ratu Tanah Jawa

Digital archival preservation, 1:1 scan-concordant diplomatic transcription, Latin transliteration, and historical translations of two major manuscripts composed or dictated by **Prince Diponegoro** (*Pangeran Dipanagara* / *Ingkang Sinuhun Kangjeng Sultan Abdul Hamid Erucakra Kabirul Mukminin Panatagama Khalifat Rasulullah*) during his exile in Fort Rotterdam, Makassar (1837–1838).

---

## Table of Contents

- [Historical Overview & Context](#historical-overview--context)
- [The Two Manuscripts](#the-two-manuscripts)
  - [1. Sejarah Ratu Tanah Jawa](#1-sejarah-ratu-tanah-jawa)
  - [2. Hikayat Ratu Tanah Jawa](#2-hikayat-ratu-tanah-jawa)
- [Repository Structure & Editions](#repository-structure--editions)
  - [1:1 Scan-Concordant Diplomatic Transcriptions](#11-scan-concordant-diplomatic-transcriptions)
  - [Archived Unified Editions](#archived-unified-editions)
- [Diplomatic Transcription Standard](#diplomatic-transcription-standard)
- [Archival Provenance & Digitization Pipeline](#archival-provenance--digitization-pipeline)
- [License & Citation](#license--citation)

---

## Historical Overview & Context

Following the Java War (*Perang Jawa*, 1825–1830), Prince Diponegoro was exiled first to Menado (1830–1833) and subsequently to Fort Rotterdam in Makassar (1833–1855). 

Following the Dutch colonial government's *Geheim Besluit* (Secret Decree) of **March 15, 1837** (prompted by intercepted correspondence), Diponegoro was placed under near-solitary confinement. Most of his retainers were deported to Ambon, his visitors were strictly restricted, and his correspondence was intercepted and inspected. During this period of intense spiritual isolation, Diponegoro produced or dictated these two profound works on government paper:

1. **Sejarah Ratu Tanah Jawa** (completed **5 Dulkangidah A.J. 1765 / February 2, 1838**): An extensive mytho-historical chronicle of Java from the creation and descent of Adam and Eve through the pre-Islamic dynasties up to Majapahit (Hayam Wuruk and Gajah Mada). This work functions as the direct chronological prelude to Diponegoro’s autobiographical *Babad Diponegoro* (which commences at the fall of Majapahit).
2. **Hikayat Ratu Tanah Jawa** (Treatise / *Risalah*): A profound synthesis of Islamic mysticism (Sufism), esoteric practice (*Thariqah Shattariyyah* / *Satariyah*, *dzikir nafi isbat*, *Insan Kamil*, *kawula-Gusti*), and political-theological recollections of the Java War, detailing encounters at Tegalreja, Selarong, Banyumeneng, Magelang, and interactions with Resident Smissaert and General Hendrik Merkus de Kock.

---

## The Two Manuscripts

### 1. Sejarah Ratu Tanah Jawa
* **Original Language & Script:** Javanese in Pegon (Arabic) script.
* **Date of Composition:** 5 Dulkangidah, A.J. 1765 (February 2, 1838), Fort Rotterdam, Makassar.
* **Scope & Subject Matter:**
  * The cosmic descent of Prophet Adam and Babu Khowo (Mother Eve) to Ceylon and Java.
  * The genealogical origins of Javanese kings and spiritual entities (Batara Guru, Batara Wisnu, Suralaya).
  * The legendary dynasties of Medang Kamulan, Prabu Sindula, and Dewata Cengkar.
  * The rise and peak of the Majapahit Empire under King Hayam Wuruk and Patih Gajah Mada.
  * Serves as the canonical prelude to the *Babad Diponegoro* and the Islamic conversion of Java.

### 2. Hikayat Ratu Tanah Jawa
* **Original Language & Script:** Javanese in Pegon (Arabic) script.
* **Form:** Theological-mystical treatise (*Risalah*) and autobiographical reflection.
* **Scope & Subject Matter:**
  * Theological exposition of the *Shahadat*, *Niyyah*, and *Iman*.
  * The mystical stages and spiritual breathing techniques of the **Shattariyyah** Sufi order (*Thoriq Satariyah*).
  * The symbolism of the heart, spiritual vision, and the Sufi diagram (*Da'irah*).
  * The ethics of seeking an authentic spiritual guide (*Guru Mursyid*) versus false teachers.
  * Eyewitness chronicle of the outbreak of the Java War: confrontation at Tegalreja, retreat to the Selarong caves, battles with Dutch artillery, Resident Smissaert, and negotiations with General De Kock.

---

## Repository Structure & Editions

The repository follows a clean, 1:1 scan-concordant modular architecture:

```text
Hikayat & Sejarah Ratu Tanah Jawa/
├── README.md                                 # Project documentation & codicological guide
├── LICENSE                                   # GNU General Public License v3.0
├── .gitattributes                            # Line-ending normalization settings
│
├── Hikayat Ratu Tanah Jawa/                  # Treatise / Risalah (Sufism & Java War)
│   ├── scans/                                # Archival high-resolution image assets
│   │   ├── pegon/                            # 125 photographic scans of original Pegon pages (IMG_0001–0125)
│   │   ├── 1973-transcription/               # 47 scans of the 1973 Sastrasuganda Latin typescript (IMGe_0058–0104)
│   │   ├── plates/                           # High-res master TIFFs and JPG plates (Sufi diagrams / Da'irah)
│   │   └── marginalia/                       # Close-up camera captures of manuscript margins
│   ├── text/                                 # 1:1 Concordant Text Transcriptions
│   │   ├── handwritten-pegon/                # 125 diplomatic markdown files (IMG_0001.md – IMG_0125.md)
│   │   ├── handwritten-pegon-latin/          # 125 phonetic Latin transliterations with diacritics
│   │   ├── 1973-typescript/                  # 47 diplomatic markdown files (IMG_0058.md – IMG_0104.md)
│   │   └── archive/                          # Archived composite editions (Pegon, Latin, English)
│   └── pipeline/                             # Transcription & translation intermediate artifacts
│
└── Sejarah Ratu Tanah Jawa/                  # Chronicle of Java (Pre-Majapahit)
    ├── scans/                                # Archival high-resolution image assets
    │   ├── pegon/                            # 90 photographic scans of original Pegon pages (IMG_0001–0090)
    │   └── 1973-transcription/               # 57 scans of the 1973 Sastrasuganda Latin typescript (IMGe_0001–0057)
    ├── text/                                 # 1:1 Concordant Text Transcriptions
    │   ├── handwritten-pegon/                # 90 diplomatic markdown files (IMG_0001.md – IMG_0090.md)
    │   ├── 1973-typescript/                  # 57 diplomatic markdown files (IMG_0001.md – IMG_0057.md)
    │   └── archive/                          # Archived composite editions (Pegon, Latin, English)
    └── pipeline/                             # Transcription & translation intermediate artifacts
```

### 1:1 Scan-Concordant Diplomatic Transcriptions & Transliterations

Every scanned page has an exact, dedicated markdown transcription file named after its image identifier:

| Manuscript | Corpus | Directory | File Range | Total Files |
| :--- | :--- | :--- | :--- | :--- |
| **Hikayat Ratu Tanah Jawa** | Handwritten Pegon | [`Hikayat Ratu Tanah Jawa/text/handwritten-pegon/`](Hikayat%20Ratu%20Tanah%20Jawa/text/handwritten-pegon/) | `IMG_0001.md` – `IMG_0125.md` | **125** |
| **Hikayat Ratu Tanah Jawa** | Handwritten Pegon (Latin) | [`Hikayat Ratu Tanah Jawa/text/handwritten-pegon-latin/`](Hikayat%20Ratu%20Tanah%20Jawa/text/handwritten-pegon-latin/) | `IMG_0001.md` – `IMG_0125.md` | **125** |
| **Hikayat Ratu Tanah Jawa** | 1973 Latin Typescript | [`Hikayat Ratu Tanah Jawa/text/1973-typescript/`](Hikayat%20Ratu%20Tanah%20Jawa/text/1973-typescript/) | `IMG_0058.md` – `IMG_0104.md` | **47** |
| **Sejarah Ratu Tanah Jawa** | Handwritten Pegon | [`Sejarah Ratu Tanah Jawa/text/handwritten-pegon/`](Sejarah%20Ratu%20Tanah%20Jawa/text/handwritten-pegon/) | `IMG_0001.md` – `IMG_0090.md` | **90** |
| **Sejarah Ratu Tanah Jawa** | 1973 Latin Typescript | [`Sejarah Ratu Tanah Jawa/text/1973-typescript/`](Sejarah%20Ratu%20Tanah%20Jawa/text/1973-typescript/) | `IMG_0001.md` – `IMG_0057.md` | **57** |

### Archived Unified Editions

Earlier composite reading files combining all folios into single documents are preserved under the `text/archive/` folders:
* `hikayat-pegon.md`, `hikayat-javanese-latin.md`, `hikayat-english.md`
* `sejarah-pegon.md`, `sejarah-javanese-latin.md`, `sejarah-english.md`

---

## Diplomatic Transcription Standard

The transcriptions in `handwritten-pegon/` follow strict diplomatic philological standards:

1. **Line-by-Line Correspondence (12 Lines per Folio):**
   - The manuscript text boxes contain 12 ruled lines per folio. Transcriptions maintain exact scribal line numbers (`1:` through `12:`), avoiding modern re-flowing or paragraph merging.
2. **Orthographic Precision (Fully Vocalized Pegon):**
   - All diacritics (*fathah*, *kasrah*, *dammah*, *sukun*, *pepet*, and Javanese modified consonants: ڠ, ۑ, چ, ڤ, ݢ) are recorded precisely as penned by the scribe.
   - Non-standard, dialectal, and archaic phonetic spellings are preserved without modern standardization.
3. **Codicological Elements:**
   - **Catchwords (*Kata Alihan* / *Reklam*):** Preserved in brackets (`[catchword: ...]`) at the end of each folio.
   - **Foliation & Rubrics:** Foliation numbers, original pencil annotations (e.g. `P. 195`), and rubric headings are mapped to their corresponding physical folios.
   - **Mystical Calligraphic Diagrams:** Visual diagrams (such as the frontispiece and the *hulu keris* / lamp diagram on folios 132–133) include diplomatic structural breakdowns of inscribed Arabic/Pegon phrases.

---

## Archival Provenance & Digitization Pipeline

### Provenance Chain
* **1838–1855:** Preserved in the possession of Prince Diponegoro in Fort Rotterdam, Makassar, and bequeathed to his widow and heirs.
* **Late 19th c. – 20th c.:** Held at the Diponegoro family residence built in 1855 (Jl. Irian No. 83, Makassar) by direct descendants:
  * Prince Diponegoro $\rightarrow$ Pangeran Abdurachman $\rightarrow$ R.M. Abdumuttalib $\rightarrow$ **R.M. Saleh Diponegoro** (Keeper of the Tomb of Prince Diponegoro).
* **September 1972:** British historian **Peter B.R. Carey** (Trinity College, Oxford) photographed both manuscripts in Makassar with the permission of R.M. Saleh Diponegoro.
* **May 1973:** Transliterated from Pegon script into Latinized Javanese by **Sastrasuganda** in Yogyakarta. Three certified copies were deposited:
  1. Faculty of Letters, Universitas Gadjah Mada (UGM), Yogyakarta.
  2. Leiden University Library (UB), Netherlands.
  3. P.B.R. Carey (Trinity College, Oxford, UK).

### Digital Pipeline
* **High-Resolution Scanning:** Digitized from the original Carey photographic negatives and archival prints.
* **Full-Page Diplomatic Transcription:** Every page transcribed from uncropped master scans, cross-verifying scribal ductus, rubrics, and catchwords.
* **Concordance System:** Strict 1:1 image-to-text mapping allowing researchers to side-by-side inspect any scan and its corresponding diplomatic transcription.

---

## License & Citation

The digitization, transcription files, translations, and documentation in this repository are licensed under the **GNU General Public License v3.0** ([LICENSE](LICENSE)).

When citing this repository in academic or historical research:
```bibtex
@misc{diponegoro_ratu_tanah_jawa,
  author       = {Pangeran Dipanagara (Prince Diponegoro)},
  title        = {Hikayat \& Sejarah Ratu Tanah Jawa: Digital Archival Preservation and Diplomatic Transcription},
  year         = {1838},
  note         = {Transliterated by Sastrasuganda (1973); Photocopied by P.B.R. Carey (1972); Digitized and diplomatically transcribed (2026)},
  howpublished = {\url{https://github.com/feureau/Hikayat-Sejarah-Ratu-Tanah-Jawa}}
}
```
