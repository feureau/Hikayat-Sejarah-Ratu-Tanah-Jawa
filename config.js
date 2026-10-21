const COLLECTIONS = {
    hikayat_pegon: {
        title: "Hikayat Ratu Tanah Jawa (Pegon Manuscript)",
        manuscript: "Hikayat Ratu Tanah Jawa",
        type: "pegon",
        range: { start: 1, end: 125 },
        padLength: 4,
        imagePath: (id) => `Hikayat Ratu Tanah Jawa/scans/pegon/IMG_${id}.jpg`,
        mdPath: (id) => `Hikayat Ratu Tanah Jawa/text/handwritten-pegon/IMG_${id}.md`,
        enPath: (id) => `Hikayat Ratu Tanah Jawa/text/handwritten-pegon-latin/IMG_${id}.md`,
        translationPath: (id) => `Hikayat Ratu Tanah Jawa/text/handwritten-pegon-english/IMG_${id}.md`
    },
    hikayat_typescript: {
        title: "Hikayat Ratu Tanah Jawa (1973 Typescript & Translation)",
        manuscript: "Hikayat Ratu Tanah Jawa",
        type: "typescript",
        range: { start: 58, end: 104 },
        padLength: 4,
        imagePath: (id) => `Hikayat Ratu Tanah Jawa/scans/1973-transcription/IMGe_2026-26-01-10-17-53-50-${id}.jpg`,
        mdPath: (id) => `Hikayat Ratu Tanah Jawa/text/1973-typescript/IMG_${id}.md`,
        enPath: (id) => `Hikayat Ratu Tanah Jawa/text/english-translation/IMG_${id}_EN.md`,
        translationPath: null
    },
    sejarah_pegon: {
        title: "Sejarah Ratu Tanah Jawa (Pegon Manuscript)",
        manuscript: "Sejarah Ratu Tanah Jawa",
        type: "pegon",
        range: { start: 1, end: 90 },
        padLength: 4,
        imagePath: (id) => `Sejarah Ratu Tanah Jawa/scans/pegon/IMG_${id}.jpg`,
        mdPath: (id) => `Sejarah Ratu Tanah Jawa/text/handwritten-pegon/IMG_${id}.md`,
        enPath: (id) => `Sejarah Ratu Tanah Jawa/text/handwritten-pegon-latin/IMG_${id}.md`,
        translationPath: (id) => `Sejarah Ratu Tanah Jawa/text/handwritten-pegon-english/IMG_${id}.md`
    },
    sejarah_typescript: {
        title: "Sejarah Ratu Tanah Jawa (1973 Typescript & Translation)",
        manuscript: "Sejarah Ratu Tanah Jawa",
        type: "typescript",
        range: { start: 1, end: 57 },
        padLength: 4,
        imagePath: (id) => `Sejarah Ratu Tanah Jawa/scans/1973-transcription/IMGe_2026-26-01-10-17-53-50-${id}.jpg`,
        mdPath: (id) => `Sejarah Ratu Tanah Jawa/text/1973-typescript/IMG_${id}.md`,
        enPath: (id) => `Sejarah Ratu Tanah Jawa/text/english-translation/IMG_${id}_EN.md`,
        translationPath: null
    }
};

function padId(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}