# Transliteration builder for Hikayat Ratu Tanah Jawa
import sys, os, glob, re

PHRASES = [
    (r'صَلَّى اللهُ عَلَيْهِ وَسَلَّمْ', 'ṣallallāhu ‘alayhi wa-sallam'),
    (r'صَلَّى اللهُ عَلَيْهِ وَاِسْلَامْ', 'ṣallallāhu ‘alayhi wa-islām'),
    (r'صَلَّى اللهُ عَلَيْهِ', 'ṣallallāhu ‘alayhi'),
    (r'سُبْحَانَهُ وَتَعَالَى', 'subḥānahu wa-ta‘ālā'),
    (r'سُبْحَانَهُ وَا تَعَالَى', 'subḥānahu wa-ta‘ālā'),
    (r'عَزَّ وَجَلَّ', '‘azza wa-jalla'),
    (r'عَزَّا وَاجَلَّ', '‘azza wa-jalla'),
    (r'رَبِّ الْعَالَمِيْنَ', 'rabbi ’l-‘ālamīn'),
    (r'رَسُوْلُ اللهِ', 'rasūlullāh'),
    (r'رَسُوْلُ الله', 'rasūlullāh'),
    (r'حَبِيْبُ اللهِ', 'ḥabībullāh'),
    (r'خَلِيْلُ اللهِ', 'khalīlullāh'),
    (r'خَلِيْفَةُ اللهِ', 'khalīfatullāh'),
    (r'خَلِيْفَةُ الْأَرْضِ', 'khalīfatu ’l-arḍi'),
    (r'كَلَامُ اللهِ', 'kalāmullāh'),
    (r'رُوْحُ اللهِ', 'rūḥullāh'),
    (r'بَيْتُ الْمَعْمُوْرِ', 'Baytu ’l-Ma‘mūr'),
    (r'بَيْثَةُ اللهِ', 'Baytullāh'),
    (r'لَوْحِ حِيْلِ مَحْفُوْظْ', 'Lawḥil Maḥfūẓ'),
    (r'لَوْحِ الْمَحْفُوْظْ', 'Lawḥil Maḥfūẓ'),
    (r'لَا اِلٰهَ اِلَّا اللهُ', 'lā ilāha illallāh'),
    (r'لَا إِلٰهَ إِلَّا اللهُ', 'lā ilāha illallāh'),
    (r'مُحَمَّدٌ رَسُوْلُ اللهِ', 'Muḥammadun rasūlullāh'),
    (r'مُحَمَّدْ رَسُوْلُ اللهِ', 'Muḥammad rasūlullāh'),
    (r'عَلَيْهِ السَّلَامْ', '‘alayhi ’s-salām'),
    (r'عَلَيْهِ السَّلَامُ', '‘alayhi ’s-salām'),
    (r'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', 'bismi ’llāhi ’r-raḥmāni ’r-raḥīm'),
]

WORDS = {
    'كَنْجَعْ': 'kangjeng',
    'نَبِيْ': 'nabī',
    'نَبِي': 'nabī',
    'اِبْلِيْسْ': 'Iblīs',
    'اِبْلِيْسِ': 'Iblīsé',
    'لَعْنَةُ': 'la‘nat',
    'اللهِ': 'Allāh',
    'اللهُ': 'Allāh',
    'الله': 'Allāh',
    'كُسْتِى': 'Gusthi',
    'ذُرِّيَّةِ': 'żurriyyatê',
    'اَدَمْ': 'Ādam',
    'نُوْحْ': 'Nūḥ',
    'نُوْحِ': 'Nūḥé',
    'مُوْسَى': 'Mūsā',
    'عِيْسَى': '‘Īsā',
    'اِبْرَاهِيْمْ': 'Ibrāhīm',
    'دَاوُودْ': 'Dāwūd',
    'شَيْثْ': 'Syits',
    'اِيْدْرِيْسْ': 'Idrīs',
    'مَرْيَمْ': 'Maryam',
    'قُرْآنْ': 'Qur’ān',
    'اَلْقُرْآنْ': 'al-Qur’ān',
    'تَوْرِيْةِ': 'Torèt',
    'زَبُوْرْ': 'Zabūr',
    'اِنْجِيْلْ': 'Injīl',
    'مَارِڠْ': 'maring',
    'اِعْ': 'ing',
    'اِيْتْ': 'iku',
    'اِيْكُوْ': 'iku',
    'لَمُوْنْ': 'lamun',
    'لَوَانْ': 'lawan',
    'دُنْيَا': 'dunya',
    'كَڠْ': 'kang',
    'سَكِيْهِيْ': 'sakèhé',
    'حَابِيْهْ': 'kabèh',
    'كَبِيْهِ': 'kabèh',
    'فَدَا': 'pada',
    'فَدَ': 'pada',
    'اِسْلَامْ': 'Islām',
    'كَفِيْرْ': 'kāfir',
    'كَفِيْرِ': 'kāfiré',
    'سَبَابْ': 'sabab',
    'مِكْ': 'mék',
    'بَنْجُوْرْ': 'banjur',
    'نُوْلِيْ': 'nuli',
    'سَابَعْدَ': 'sabakda',
    'انِى': 'ané',
    'لَوَاسْ': 'lawas',
    'مَانِهْ': 'manèh',
    'مِيْلِيْهِ': 'milih',
    'تُوْرُوْنْ': 'turun',
    'تُمُوْرُوْنْ': 'tumurun',
    'كِتَابْ': 'kitāb',
    'عَالَمِ': '‘ālam',
    'عُلَمَخْيِرَةْ': '‘ālam akirat',
    'سُوْرْجَا': 'swarga',
    'نَرَاقَ': 'naraka',
    'نَرَكَا': 'naraka',
    'اِيْمَانْ': 'īmān',
    'عِلْمُوْ': 'ngilmu',
    'طَرِيْقِيْ': 'thoriqé',
    'طَرِيْقُ': 'thoriq',
    'ذِكِرْ': 'żikir',
    'ذِكْرِيْ': 'żikiré',
    'كَلِمَةْ': 'kalimah',
    'طَيِّبَةْ': 'thoyyibah',
    'شَهَادَاتْ': 'syahādat',
    'سَمْبَهْيَاڠْنِيْ': 'sembahyangé',
    'صَلَاةْ': 'ṣalāt',
    'فَرْضُ': 'farḍu',
    'سُنَّةِ': 'sunnah'
}

def transliterate_word(w):
    clean_w = re.sub(r'[ً-ٰٟ]', '', w)
    if w in WORDS:
        return WORDS[w]
    if clean_w in WORDS:
        return WORDS[clean_w]
    
    # Generic phonetic mapper
    # Replace Javanese digraphs and special letters
    res = w
    # Special Pegon letters
    res = res.replace('ڠ', 'ng').replace('چ', 'c').replace('ڤ', 'p').replace('ݢ', 'g').replace('ۑ', 'ny')
    res = res.replace('ع', '‘').replace('ح', 'ḥ').replace('خ', 'kh').replace('ص', 'ṣ').replace('ض', 'ḍ')
    res = res.replace('ط', 'ṭ').replace('ظ', 'ẓ').replace('ش', 'sy').replace('ذ', 'ż').replace('ث', 'ts')
    res = res.replace('ق', 'q').replace('ء', '’')
    
    # Standard consonants
    res = res.replace('ب', 'b').replace('ت', 't').replace('ج', 'j').replace('د', 'd').replace('ر', 'r')
    res = res.replace('ز', 'z').replace('س', 's').replace('غ', 'gh').replace('ف', 'f').replace('ك', 'k')
    res = res.replace('ل', 'l').replace('م', 'm').replace('ن', 'n').replace('ه', 'h').replace('ة', 't')
    
    # Vowel combinations
    res = res.replace('ِـيْ', 'ī').replace('ِيْ', 'ī').replace('َيْ', 'é').replace('ِي', 'i')
    res = res.replace('ُـوْ', 'ū').replace('ُوْ', 'ū').replace('َوْ', 'o').replace('ُو', 'u')
    res = res.replace('َا', 'ā').replace('ا', '')
    
    # Harakat
    res = res.replace('َ', 'a').replace('ِ', 'i').replace('ُ', 'u').replace('ْ', '').replace('ّ', '')
    res = res.replace('ى', 'ā').replace('ي', 'y').replace('و', 'w')
    
    return res

def transliterate_line(line):
    # Check phrases first
    out = line
    for pat, rep in PHRASES:
        out = out.replace(pat, rep)
    
    # Split tokens and transliterate Arabic/Pegon tokens
    tokens = out.split(' ')
    new_tokens = []
    for tok in tokens:
        # If token contains arabic characters
        if re.search(r'[؀-ۿ]', tok):
            # preserve punctuation around token
            m = re.match(r'^([^\u0600-\u06FF]*)([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)([^\u0600-\u06FF]*)$', tok)
            if m:
                pre, core, post = m.groups()
                t_core = transliterate_word(core)
                new_tokens.append(pre + t_core + post)
            else:
                new_tokens.append(transliterate_word(tok))
        else:
            new_tokens.append(tok)
    
    res = ' '.join(new_tokens)
    # clean multiple spaces
    res = re.sub(r' +', ' ', res)
    return res

print('Build transliteration script written successfully')
