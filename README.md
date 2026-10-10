# Hikayat & Sejarah Ratu Tanah Jawa

Digital archival preservation, transcription, transliteration, and English translation of two major historical manuscripts composed or dictated by **Prince Diponegoro** (*Pangeran Dipanagara* / *Ingkang Sinuhun Kangjeng Sultan Abdul Hamid Erucakra Kabirul Mukminin Panatagama Khalifat Rasulullah*) during his exile in Fort Rotterdam, Makassar (1837–1838).

---

## Table of Contents

- [Historical Overview & Context](#historical-overview--context)
- [The Two Manuscripts](#the-two-manuscripts)
  - [1. Sejarah Ratu Tanah Jawa](#1-sejarah-ratu-tanah-jawa)
  - [2. Hikayat Ratu Tanah Jawa](#2-hikayat-ratu-tanah-jawa)
- [Reading Editions](#reading-editions)
- [Repository Organization](#repository-organization)
- [Archival Provenance & Digitization Pipeline](#archival-provenance--digitization-pipeline)
- [License & Citation](#license--citation)

---

## Historical Overview & Context

Following the Java War (*Perang Jawa*, 1825–1830), Prince Diponegoro was exiled first to Menado (1830–1833) and subsequently to Fort Rotterdam in Makassar (1833–1855). 

Following the Dutch colonial government's *Geheim Besluit* (Secret Decree) of **March 15, 1837** (prompted by intercepted correspondence), Diponegoro was placed under near-solitary confinement. Most of his retainers were deported to Ambon, his visitors were strictly restricted, and his correspondence was intercepted and inspected. During this period of intense spiritual isolation, Diponegoro produced or dictated these two profound works on government paper:

1. **Sejarah Ratu Tanah Jawa** (completed **5 Dulkangidah A.J. 1765 / February 2, 1838**): An extensive mytho-historical chronicle of Java from the creation and descent of Adam and Eve through the pre-Islamic kingdoms up to Majapahit (Hayam Wuruk and Gajah Mada). This work functions as the direct chronological prelude to Diponegoro’s autobiographical *Babad Diponegoro* (which commences at the fall of Majapahit).
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
  * Eyewitness chronicle of the outbreak of the Java War: the confrontation at Tegalreja, retreat to the Selarong caves, battles with Dutch cannons and Resident Smissaert, and negotiations with General De Kock.

---

## Reading Editions

All finalized reading texts are housed in the `text/` subdirectory of each respective manuscript folder:

| Manuscript | Javanese (Latin Transliteration) | English Translation | Pegon (Arabic Script) |
| :--- | :--- | :--- | :--- |
| **Hikayat Ratu Tanah Jawa** | [hikayat-javanese-latin.md](Hikayat%20Ratu%20Tanah%20Jawa/text/hikayat-javanese-latin.md) | [hikayat-english.md](Hikayat%20Ratu%20Tanah%20Jawa/text/hikayat-english.md) | [hikayat-pegon.md](Hikayat%20Ratu%20Tanah%20Jawa/text/hikayat-pegon.md) |
| **Sejarah Ratu Tanah Jawa** | [sejarah-javanese-latin.md](Sejarah%20Ratu%20Tanah%20Jawa/text/sejarah-javanese-latin.md) | [sejarah-english.md](Sejarah%20Ratu%20Tanah%20Jawa/text/sejarah-english.md) | [sejarah-pegon.md](Sejarah%20Ratu%20Tanah%20Jawa/text/sejarah-pegon.md) |

---

## Repository Organization

The repository follows a clean, mirrored structure across both manuscripts:

```text
Hikayat & Sejarah Ratu Tanah Jawa/
├── README.md                                 # Overview, provenance, directory guide
├── LICENSE                                   # GNU General Public License v3.0
├── .gitattributes                            # Line-ending normalization settings
│
├── Hikayat Ratu Tanah Jawa/                  # Treatise / Risalah (Sufism & Java War)
│   ├── text/                                 # Final curated reading editions
│   │   ├── hikayat-javanese-latin.md         # Complete Javanese Latin transliteration (pp. 58–104)
│   │   ├── hikayat-english.md                # Complete English translation
│   │   └── hikayat-pegon.md                  # Complete Pegon Arabic script edition
│   ├── scans/                                # Archival high-resolution image assets
│   │   ├── pegon/                            # 125 photographic scans of original Pegon pages (IMG_0001–0125)
│   │   ├── 1973-transcription/               # 47 scans of the 1973 Sastrasuganda Latin typescript (IMGe_0058–0104)
│   │   ├── plates/                           # High-res master TIFFs and JPG plates (Sufi diagrams / Da'irah)
│   │   └── marginalia/                       # Close-up camera captures of manuscript margins
│   └── pipeline/                             # Machine transcription & translation artifacts
│       ├── qwen-transcription/               # Page-by-page OCR text and logs (Qwen-VL)
│       ├── gemini-translation/               # Batched translation markdown chunks and logs (Gemini Flash Lite)
│       └── gemini-pegon/                     # Pegon OCR extraction files and logs (Gemini)
│
└── Sejarah Ratu Tanah Jawa/                  # Chronicle of Java (Pre-Majapahit)
    ├── text/                                 # Final curated reading editions
    │   ├── sejarah-javanese-latin.md         # Complete Javanese Latin transliteration (pp. 1–57)
    │   ├── sejarah-english.md                # Complete English translation (includes Carey introduction)
    │   └── sejarah-pegon.md                  # Complete Pegon Arabic script edition
    ├── scans/                                # Archival high-resolution image assets
    │   ├── pegon/                            # 90 photographic scans of original Pegon pages (IMG_0001–0090)
    │   └── 1973-transcription/               # 57 scans of the 1973 Sastrasuganda Latin typescript (IMGe_0001–0057)
    └── pipeline/                             # Machine transcription & translation artifacts
        ├── qwen-transcription/               # Page-by-page OCR text and logs (Qwen-VL)
        ├── gemini-translation/               # Batched translation markdown chunks and logs (Gemini Flash Lite)
        └── pegon-transcription/              # Segmented Pegon OCR transcriptions and drafts
```

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

### Digital AI Pipeline (2026)
* **Vision Transcription:** Both the 1973 typed Latin transcriptions and original Pegon folios were processed through large multimodal vision models (**Qwen3-VL 235B Cloud** via Ollama, and **Google Gemini**).
* **Translation:** Segmented multi-page chunks were translated from Javanese into modern English using **Gemini Flash Lite**, preserving cultural terminology, Islamic honorifics, and historical titles.
* **Curation:** Cleaned, deduplicated, and unified into synchronized Markdown editions.

---

## License & Citation

The digitization, transcription files, translations, and documentation in this repository are licensed under the **GNU General Public License v3.0** ([LICENSE](LICENSE)).

When citing this work for academic or historical research:
```bibtex
@misc{diponegoro_ratu_tanah_jawa_2026,
  author       = {Pangeran Dipanagara (Prince Diponegoro)},
  title        = {Hikayat & Sejarah Ratu Tanah Jawa},
  year         = {1838},
  note         = {Transliterated by Sastrasuganda (1973); Photocopied by P.B.R. Carey (1972); Digitized and translated (2026)},
  howpublished = {\url{https://github.com/feureau/Hikayat-Sejarah-Ratu-Tanah-Jawa}}
}
```
