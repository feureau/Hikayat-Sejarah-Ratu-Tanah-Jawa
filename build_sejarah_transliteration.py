# Transliteration builder for Sejarah Ratu Tanah Jawa
# Generates 1:1 scan-concordant Latin transliteration from handwritten Pegon
# WITHOUT harmonizing against the 1973 typescript.

import sys, os, glob, re

# Standard Islamic / Quranic / Honorific formula phrases
PHRASES = [
    (r'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ', 'bismi ’llāhi ’r-raḥmāni ’r-raḥīm'),
    (r'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', 'bismi ’llāhi ’r-raḥmāni ’r-raḥīm'),
    (r'اَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِيْنَ', 'al-ḥamdu lillāhi rabbi ’l-‘ālamīn'),
    (r'الرَّحْمٰنِ الرَّحِيْمِ', '’r-raḥmāni ’r-raḥīm'),
    (r'مَالِكِ يَوْمِ الدِّيْنِ', 'māliki yawmi ’d-dīn'),
    (r'وَالْعَاقِبَةُ لِلْمُتَّقِيْنَ', 'wa-’l-‘āqibatu li-’l-muttaqīn'),
    (r'صَلَّى اللهُ عَلَيْهِ وَسَلَّمْ', 'ṣallallāhu ‘alayhi wa-sallam'),
    (r'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ', 'ṣallallāhu ‘alayhi wa-sallam'),
    (r'صَلَّى اللهُ عَلَيْهِ', 'ṣallallāhu ‘alayhi'),
    (r'سُبْحَانَهُ وَتَعَالَى', 'subḥānahu wa-ta‘ālā'),
    (r'عَزَّ وَجَلَّ', '‘azza wa-jalla'),
    (r'رَبِّ الْعَالَمِيْنَ', 'rabbi ’l-‘ālamīn'),
    (r'رَبِّ الْعَالَمِيْنْ', 'rabbi ’l-‘ālamīn'),
    (r'رَبُّ الْعَالَمِيْنَ', 'rabbu ’l-‘ālamīn'),
    (r'عَلَيْهِ السَّلَامْ', '‘alayhi ’s-salām'),
    (r'عَلَيْهِ السَّلَامُ', '‘alayhi ’s-salām'),
    (r'عَلَيْهِمَا السَّلَامْ', '‘alayhimā ’s-salām'),
    (r'رَضِيَ اللهُ عَنْهُ', 'raḍiyallāhu ‘anhu'),
    (r'رَضِيَ اللهُ عَنْهَا', 'raḍiyallāhu ‘anhā'),
    (r'رَضِيَ اللهُ عَنْهُمْ', 'raḍiyallāhu ‘anhum'),
    (r'لَعْنَةُ اللهِ', 'la‘natullāh'),
    (r'لَعْنَةَ اللهِ', 'la‘natallāh'),
    (r'رَسُوْلُ اللهِ', 'rasūlullāh'),
    (r'رَسُوْلِ اللهِ', 'rasūlillāh'),
    (r'خَلِيْفَةُ اللهِ', 'khalīfatullāh'),
    (r'خَلِيْفَةُ رَسُوْلِ اللهِ', 'khalīfatu rasūlillāh'),
    (r'وَاللهُ اَعْلَمُ بِالصَّوَابِ', 'wa-’Llāhu a‘lamu bi-’ṣ-ṣawāb'),
    (r'وَاللهُ اعلم بالصَّوَابْ', 'wa-’Llāhu a‘lamu bi-’ṣ-ṣawāb'),
    (r'غَفَرَ اللهُ لَهُمْ', 'ghafarallāhu lahum'),
    (r'غَفَرَ اللهُمْ', 'ghafarallāhum'),
    (r'يَا غَفُوْرُ', 'yā Ghafūru'),
    (r'يَا غَفُورُ', 'yā Ghafūru'),
    (r'اِنْ شَاءَ اللهُ', 'in syā’a Allāh'),
    (r'انْشَاءَ اللهُ', 'in syā’a Allāh'),
]

# Vocabulary dictionary for Javanese & Arabic words in Sejarah Ratu Tanah Jawa
WORDS = {
    # Pronouns & Particles
    'اِيْكُ': 'iku', 'اِيْتُ': 'itu', 'اِيْكِيْ': 'iki', 'اِكِيْ': 'iki',
    'كَڠْ': 'kang', 'كَعْ': 'kang', 'كَالِيْوَةْ': 'kaliwat', 'كَلِيْوَةْ': 'kaliwat',
    'اِڠْ': 'ing', 'اِعْ': 'ing', 'اعْ': 'ing', 'اِيْڠْ': 'ing', 'اِيْڠْكَعْ': 'ingkang',
    'اِعْكَڠْ': 'ingkang', 'اِعْكَعْ': 'ingkang', 'اعْكَعْ': 'ingkang', 'اعْك': 'ingkang',
    'مَكَ': 'maka', 'مَكَا': 'maka', 'مَكْنَا': 'mangkana', 'مَـعْكَنَا': 'mangkana',
    'مَـعْكَوْنَوْ': 'mangkono', 'مَفْكَوْنَوْ': 'mangkono', 'مَغْكَوْنَوْ': 'mangkono',
    'مَـعْكَوْ': 'mangka', 'مَفْكَوْ': 'mangka', 'مَـعْـكَوْ': 'mangka',
    'لَوَانْ': 'lawan', 'لَوَاعْ': 'lawan', 'كَلَوَانْ': 'kalawan', 'لَنْ': 'lan',
    'مَارِڠْ': 'maring', 'مَارِعْ': 'maring', 'مَرِعْ': 'maring', 'مَرِڠْ': 'maring', 'مْرِڠْ': 'mring',
    'دَادِيْ': 'dadi', 'دَادِيَا': 'dadiya', 'دَادِيْنْ': 'dadiné',
    'وُوْسْ': 'wus', 'وُووْسْ': 'wus', 'وَوْسْ': 'wus', 'وُوسْ': 'wus', 'وُوْسِيْ': 'wusé',
    'ڤَدَا': 'pada', 'ڤَدْ': 'pada', 'ڤَادَا': 'pada', 'ڤَد': 'pada', 'ڤَذَا': 'pada',
    'تَنْ': 'tan', 'ڤَنْ': 'pan', 'دِيْنْ': 'dèn', 'دَيْنْ': 'dèn',
    'بَنْجُوْرْ': 'banjur', 'بَنْجَوْرْ': 'banjur', 'سَڠْ': 'sang', 'سَعْ': 'sang', 'سَاعْيَعْ': 'Sang Hyang',
    'سَعْهِيْيَعْ': 'Sang Hyang', 'هِيَعْ': 'Hyang', 'هِيْيَعْ': 'Hyang', 'يَڠْ': 'Hyang', 'يَعْ': 'Hyang',
    'لَمُوْنْ': 'lamun', 'لَمَوْنْ': 'lamun', 'لَامُوْنْ': 'lamun', 'كَلَمَوْنْ': 'kalamun',
    'كَنْجَاڠْ': 'Kangjeng', 'كَنْجِڠْ': 'Kangjeng', 'كَنْجِعْ': 'Kangjeng', 'كَنْجَعْ': 'Kangjeng',
    'اَنَا': 'ana', 'هَنَا': 'hana', 'سِيْرَا': 'sira', 'سِيْرَايْكُ': 'siréku',
    'جَلْمَا': 'jalma', 'سَتْمَا': 'jalma', 'سَتْمِيْ': 'jalmi',
    'رَاتْ': 'rat', 'رَاتُوْ': 'ratu', 'رَاتَوْ': 'ratu', 'رَاتُ': 'ratu',
    'سَمْيَا': 'samya', 'مَڤَنْ': 'mapan', 'مَفَنْ': 'mapan',
    'يَا': 'iya', 'هِيَا': 'hiya', 'اِيَا': 'iya', 'اَيَا': 'iya',
    'اللهُ': 'Allāh', 'اللهِ': 'Allāh', 'الله': 'Allāh',
    'سَبَابْ': 'sabab', 'سَبَبْ': 'sabab',
    'نَوْرَا': 'nora', 'نُوْرَا': 'nora', 'نَوْرَ': 'nora', 'نُوْرَ': 'nora',
    'كَبِيْهْ': 'kabèh', 'كَبِيْهِ': 'kabèhé', 'كَبَيْهْ': 'kabèh', 'كَبَيْهِ': 'kabèhé',
    'كَنَا': 'kena', 'بَهِيْ': 'baé',
    'نَوْلِيْ': 'nuli', 'نَوْلِيَا': 'nulya', 'نُلْيَا': 'nulya', 'نَلِيَا': 'nulya',
    'نَتَا': 'nata', 'نَاتَا': 'nata', 'رَبِّ': 'rabbi', 'نَمَا': 'nama',
    'هِيْرَا': 'ira', 'نِيْرَا': 'nira', 'اِيْرَا': 'ira', 'اِيْرَايْكُ': 'irèku',
    'مَلَائِكَةْ': 'malā’ikat', 'مَلَيْكَةْ': 'malā’ikat', 'مَلَا': 'malā’i-', 'ئِكَةْ': '-kat',
    'سَكِيْهِيْ': 'sakèhé', 'سَكَيْهِيْ': 'sakèhé', 'سَكَيْهْ': 'sakèh', 'سَكِيْهْ': 'sakèh',
    'سَكَوْعْ': 'sakèhing', 'سَكُوْعْ': 'sakèhing', 'سَكَوْوعْ': 'sakèhing',
    'لِيْوَةْ': 'liwat', 'ڤُتْرَا': 'putra', 'ڤُوْتْرَا': 'putra', 'ڤَوْتْرَا': 'putra',
    'ڤُڤَوْتْرَا': 'peputra', 'ڤُڤُتْرَا': 'peputra', 'اَفُڤُتْرَا': 'apeputra',
    'ڤَوْتْرِيْ': 'putri', 'ڤَوْتْرَانِيْ': 'putrané',
    'كِيْنَوْنْ': 'kinon', 'كِنُوْنْ': 'kinon',
    'جَوَا': 'Jawa', 'جَوْا': 'Jawa', 'جَوِيْ': 'Jawi', 'جَوْايِكُ': 'Jawa iku', 'جَوَايِكُ': 'Jawa iku',
    'شُوْرْكَا': 'swarga', 'سَوْرْكَا': 'swarga', 'سُوْرْكَا': 'swarga',
    'رَامَا': 'rama', 'رَامِيْ': 'ramané', 'رَامَانِيْرَا': 'ramanira',
    'وَارَاكَنَا': 'warangana', 'وَارَاكِنَا': 'warangana', 'وَارَا': 'wara',
    'جِيْنْ': 'jin', 'سَاكَا': 'saka', 'تِكَا': 'teka', 'تَكَا': 'teka',
    'دِيْوِيْ': 'dhéwé', 'كَلَوْهْ': 'kaluwih', 'كَرْوَا': 'garwa', 'كَرْوَايِتْ': 'garwané',
    'كَرِيْ': 'kari', 'مَكْسِيْهْ': 'maksih', 'مَكْسِيْهِ': 'maksih',
    'لَوْرَوْ': 'loro', 'لَوْرَا': 'loro', 'بَطَارَا': 'Batara', 'بَطَرَا': 'Batara', 'بَطَرَ': 'Batara',
    'دُنْيَا': 'dunya', 'دِيْڤَاتِيْ': 'adipati', 'دِيْڤَاتِيَا': 'adipatiya', 'دِيْڤَاتِ': 'adipati',
    'ڤَتَيْهْ': 'patih', 'ڤَتِيْهْ': 'patih', 'ڤَتِيْهِ': 'patihné',
    'سِيْوُعْ': 'siyung', 'كَجَهْ': 'Gajah', 'مَدَا': 'Mada',
    'كَرْسَنِيْ': 'karsané', 'كَرْسَانِيْ': 'karsané', 'كَرْسَا': 'karsa', 'كَرْسَانِيْرَا': 'karsanira',
    'مَوْدَا': 'muda', 'اَجِيْ': 'aji', 'اَجِ': 'aji',
    'وَوْڠْ': 'wong', 'وُوْعْ': 'wong', 'وْوَعْ': 'wong', 'وَوْعْ': 'wong',
    'رَاجَا': 'raja', 'نَغِيْڠْ': 'nanging', 'نَاغِيْڠْ': 'nanging', 'نَاعِيْعْ': 'nanging', 'نَعِيْعْ': 'nanging',
    'مَرْمَا': 'marma', 'مَرْمَانِيْ': 'marmané', 'مَرْمِيْ': 'marmané',
    'جَاكَا': 'Jaka', 'جَكَا': 'Jaka', 'جَكْ': 'Jaka', 'جَكَ': 'Jaka',
    'ڤْرَاڤْتَا': 'prapta', 'ڤْرَابَوْ': 'Prabu', 'ڤْرَابُوْ': 'Prabu', 'ڤْرَبُوْ': 'Prabu',
    'سَاوُوْسِيْ': 'sawusé', 'سَاوَوْسِيْ': 'sawusé',
    'تُوْغْكَلْ': 'tunggal', 'تَوْغْكَلْ': 'tunggal',
    'سُلْطَنْ': 'Sultan', 'سُلْطَانْ': 'Sultan',
    'نَلِيْنْدْرَا': 'nalendra', 'نَلَيْـنْدْ': 'nalendra', 'سَرْتَا': 'sarta', 'سَرْتَ': 'sarta',
    'مَنِيْهْ': 'manèh', 'مَنِهْ': 'manèh', 'نُوْرْ': 'nūr', 'وَقْتُ': 'wektu', 'وَقْتَ': 'wektu',
    'بَلِيْ': 'bali', 'مَلَهْ': 'malah', 'دِيْوَا': 'déwa', 'دَيْوَا': 'déwa',
    'وَانَوْدِيَا': 'wanodya', 'عَنْدِيْكَا': 'andika', 'عَنْدِيْكَ': 'andika',
    'جَڠْكَلَا': 'Janggala', 'جَيْـعْكَلْ': 'Janggala', 'جَيْـعْكَلَا': 'Janggala',
    'بُويَوْةْ': 'buyut', 'بُوْيُوْةْ': 'buyut', 'بَوْيَوْةْ': 'buyut', 'كِيْبَوْيَوْةْ': 'ki buyut',
    'ڤَاجَجَرَانْ': 'Pajajaran', 'ڤَجَاجَرَانْ': 'Pajajaran',
    'مَجَاڤَهِيْتْ': 'Majapahit', 'الْقَهَّارْ': '’l-qahhār',
    'رَاكَا': 'raka', 'خُلْدِي': 'khuldī', 'خُلْدِيْ': 'khuldī',
    'خَلِيْفَةْ': 'khalīfah', 'رَسُوْلُ': 'rasūlu',
    'تَمَّتْ': 'tamat', 'تَمَتْ': 'tamat',

    # Proper names
    'اَدَمْ': 'Ādam', 'آدَمْ': 'Ādam', 'بَابُوْ': 'Babu', 'غَوْا': 'Hawa', 'غَاوِيْ': 'Hawa', 'غَوَا': 'Hawa', 'غَوْايِتْ': 'Hawa iku',
    'اِبْلِيْسْ': 'Iblīs', 'جَبْرَائِيْلْ': 'Jabrā’īl', 'جَبْرَائِيلْ': 'Jabrā’īl',
    'شِيْشْ': 'Syits', 'عِزَازِيْلْ': '‘Azāzīl',
    'سِيْنْدَوْلَوْ': 'Sindula', 'سِيْنْدُوْلَا': 'Sindula', 'سِيْنْدُولَا': 'Sindula', 'سِيْنْدَوْ': 'Sindula',
    'دَيْوَاتَا': 'Dewata', 'چَيْفْكَرْ': 'Cengkar', 'چِعْكَرْ': 'Cengkar',
    'بَرَاوِيْجَيَا': 'Brawijaya', 'رَادِيْنْ': 'Radèn', 'رَادَيْـنْ': 'Radèn',
    'مَنْتَرَامْ': 'Mataram', 'مَتَرَامْ': 'Mataram',
    'سِيْلَوْمَنْ': 'siluman', 'سَيْلَوْمَنْ': 'siluman',
    'كَوْسْتِيْ': 'Gusti', 'كُسْتِيْ': 'Gusti',
    'كَوْسَوْمَا': 'Kusuma', 'جَيَابَيَا': 'Jayabaya', 'جَيَانِيْعْرَةْ': 'Jayanegrat',
    'وِيْسْنَوْ': 'Wisnu', 'بَطَرَاوِيْسْنَوْ': 'Batara Wisnu',
    'مُحَمَّدْ': 'Muḥammad', 'صِدِّيْقْ': 'Ṣiddīq', 'اَبَوْ': 'Abu', 'بَكَرْ': 'Bakar',
    'سَيِّدُنَا': 'Sayyidinā', 'عَلَمْ': '‘ālam', 'عَالَمْ': '‘ālam', 'عَالَمِ': '‘ālam',
    'سُوْنَنْ': 'Sunan', 'كِيَهِيْ': 'Kyai', 'كِيَاهِيْ': 'Kyai',
    'دَانِيْسْ': 'Danis', 'وَارَا': 'Wara', 'دَانِيْسْوَارَا': 'Daniswara',
}

def general_pegon_transliterate(w):
    w = re.sub(r'[\u0640\u200c\u200d]', '', w)
    has_redup = False
    if '٢' in w or '2' in w:
        w = w.replace('٢', '').replace('2', '')
        has_redup = True
        
    # Initial combinations
    w = re.sub(r'^اِيْـ?', 'i', w)
    w = re.sub(r'^اُوْ', 'u', w)
    w = re.sub(r'^اَوْ', 'o', w)
    w = re.sub(r'^اَيْ', 'é', w)
    w = re.sub(r'^اِ', 'i', w)
    w = re.sub(r'^اُ', 'u', w)
    w = re.sub(r'^اَ', 'a', w)
    w = re.sub(r'^ا', 'a', w)
    
    # Consonants
    w = w.replace('ڠ', 'ng').replace('چ', 'c').replace('ڤ', 'p').replace('ݢ', 'g').replace('ۑ', 'ny')
    w = w.replace('ع', '‘').replace('ح', 'ḥ').replace('خ', 'kh').replace('ص', 'ṣ').replace('ض', 'ḍ')
    w = w.replace('ط', 'ṭ').replace('ظ', 'ẓ').replace('ش', 'sy').replace('ذ', 'ż').replace('ث', 'ts')
    w = w.replace('ق', 'q').replace('غ', 'gh').replace('ف', 'f').replace('ء', '’')
    w = w.replace('ب', 'b').replace('ت', 't').replace('ج', 'j').replace('د', 'd').replace('ر', 'r')
    w = w.replace('ز', 'z').replace('س', 's').replace('ك', 'k').replace('ل', 'l').replace('م', 'm')
    w = w.replace('ن', 'n').replace('ه', 'h').replace('ة', 't')
    
    # Complex vowels
    w = w.replace('ِـيْ', 'i').replace('ِيْ', 'i').replace('َيْ', 'é').replace('ِي', 'i')
    w = w.replace('ُـوْ', 'u').replace('ُوْ', 'u').replace('َوْ', 'o').replace('ُو', 'u')
    w = w.replace('َا', 'ā').replace('َى', 'ā')
    
    w = w.replace('يْ', 'i').replace('وْ', 'u')
    w = w.replace('ي', 'y').replace('و', 'w')
    w = w.replace('ا', 'ā')
    
    # Harakat
    w = w.replace('َ', 'a').replace('ِ', 'i').replace('ُ', 'u').replace('ْ', '').replace('ّ', '')
    
    # Clean up double vowels
    w = re.sub(r'aā|āa|aa', 'a', w)
    w = re.sub(r'ii|iī', 'i', w)
    w = re.sub(r'uu|uū', 'u', w)
    
    if has_redup:
        w = f'{w}-{w}'
    return w

def transliterate_token(tok):
    # Check if pure punctuation / numbers
    if re.match(r'^[0-9\.,;:!?\(\)\[\]\-]+$', tok):
        return tok
    if tok in WORDS:
        return WORDS[tok]
    # Check without harakat
    clean = re.sub(r'[َُِّْـ]', '', tok)
    if clean in WORDS:
        return WORDS[clean]
    return general_pegon_transliterate(tok)

def transliterate_line(line):
    # Preserve line number / prefix if present
    m_num = re.match(r'^(\d+[\.\:])\s*(.*)', line)
    if m_num:
        prefix, rest = m_num.group(1), m_num.group(2)
        # Normalize prefix to standard 1: format
        num = re.match(r'^\d+', prefix).group(0)
        new_prefix = f'{num}: '
    else:
        new_prefix = ''
        rest = line

    # Check for brackets like [catchword: ...] or [illuminated ...]
    if rest.strip().startswith('[') and rest.strip().endswith(']'):
        # Check catchword
        m_cw = re.match(r'^\[catchword:\s*(.*)\]$', rest.strip())
        if m_cw:
            cw_content = m_cw.group(1).strip()
            # transliterate catchword words
            cw_trans = ' '.join(transliterate_token(t) for t in cw_content.split())
            return f'[catchword: {cw_trans}]'
        # Other brackets (like [illuminated ...])
        return rest.strip()

    # Apply phrase replacements
    out = rest
    for pat, rep in PHRASES:
        out = out.replace(pat, rep)

    # Process tokens
    tokens = out.split(' ')
    new_tokens = []
    for tok in tokens:
        if not tok:
            continue
        # Check if token contains Arabic/Pegon characters
        if re.search(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]', tok):
            # Extract surrounding punctuation
            m = re.match(r'^([^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]*)([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)([^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]*)$', tok)
            if m:
                pre, core, post = m.groups()
                # Replace Arabic comma with Latin comma
                pre = pre.replace('،', ',').replace('؞', '.')
                post = post.replace('،', ',').replace('؞', '.')
                new_tokens.append(pre + transliterate_token(core) + post)
            else:
                new_tokens.append(transliterate_token(tok))
        else:
            new_tokens.append(tok)

    res = ' '.join(new_tokens)
    res = re.sub(r' +', ' ', res)
    return new_prefix + res
