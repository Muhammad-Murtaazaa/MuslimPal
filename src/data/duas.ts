export type DuaCategory =
  | 'Morning'
  | 'Evening'
  | 'Sleep'
  | 'Waking'
  | 'Home'
  | 'Food'
  | 'Protection'
  | 'Forgiveness'

export type DuaItem = {
  id: string
  title: string
  category: DuaCategory
  arabic: string
  transliteration: string
  translation: string
  reference: string
  authenticity: 'Quran' | 'Sahih Bukhari' | 'Sahih Muslim' | 'Bukhari & Muslim' | 'Tirmidhi (Hasan)'
  repetitions?: string
  isDailyZikr?: boolean
}

export const DAILY_DUAS: DuaItem[] = [
  {
    id: 'sayyidul-istighfar',
    title: 'Sayyidul Istighfar (Master Supplication for Forgiveness)',
    category: 'Forgiveness',
    arabic:
      'اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.',
    transliteration:
      'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wadika mastatatu. Audhu bika min sharri ma sanat. Abu-u laka bini-matika alayya, wa abu-u bidhanbi, faghfir li fa-innahu la yaghfiru adh-dhunuba illa anta.',
    translation:
      'O Allah, You are my Lord, there is no deity but You. You created me and I am Your servant. I uphold Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.',
    reference: 'Sahih Bukhari 6306',
    authenticity: 'Sahih Bukhari',
    repetitions: 'Morning and evening',
  },
  {
    id: 'morning-evening-protection',
    title: 'Protection Morning and Evening',
    category: 'Protection',
    arabic: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.',
    transliteration:
      'Bismillahil-ladhi la yadurru maasmihi shayun fil-ardi wa la fis-sama-i wa huwas-samiul-alim.',
    translation:
      'In the name of Allah, with whose name nothing in the earth or heaven can cause harm, and He is the All-Hearing, All-Knowing.',
    reference: 'Tirmidhi 3388, Abu Dawud 5088',
    authenticity: 'Tirmidhi (Hasan)',
    repetitions: '3 times (morning and evening)',
  },
  {
    id: 'hasbiyallahu',
    title: 'Hasbiyallahu La Ilaha Illa Huwa',
    category: 'Morning',
    arabic: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.',
    transliteration:
      'Hasbiyallahu la ilaha illa huwa alayhi tawakkaltu wa huwa rabbul arshil azim.',
    translation:
      'Allah is sufficient for me. There is no deity except Him. Upon Him I rely, and He is the Lord of the Mighty Throne.',
    reference: 'Quran 9:129',
    authenticity: 'Quran',
    repetitions: '7 times (morning and evening)',
  },
  {
    id: 'sleep-dua',
    title: 'Dua Before Sleeping',
    category: 'Sleep',
    arabic: 'باسمك اللهم أموت وأحيا.',
    transliteration: 'Bismika Allahumma amutu wa ahya.',
    translation: 'In Your name, O Allah, I die and I live.',
    reference: 'Sahih Bukhari 6324',
    authenticity: 'Sahih Bukhari',
  },
  {
    id: 'waking-dua',
    title: 'Dua Upon Waking',
    category: 'Waking',
    arabic: 'الحمد لله الذي أحيانا بعدما أماتنا وإليه النشور.',
    transliteration: 'Alhamdu lillahil-ladhi ahyana bada ma amatana wa ilayhin-nushur.',
    translation:
      'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
    reference: 'Sahih Bukhari 6312',
    authenticity: 'Sahih Bukhari',
  },
  {
    id: 'enter-home',
    title: 'Dua When Entering Home',
    category: 'Home',
    arabic: 'بسم الله ولجنا، وبسم الله خرجنا، وعلى ربنا توكلنا.',
    transliteration: 'Bismillahi walajna wa bismillahi kharajna wa ala rabbina tawakkalna.',
    translation:
      'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.',
    reference: 'Abu Dawud 5096',
    authenticity: 'Tirmidhi (Hasan)',
  },
  {
    id: 'leave-home',
    title: 'Dua When Leaving Home',
    category: 'Home',
    arabic: 'بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله.',
    transliteration: 'Bismillahi tawakkaltu alallahi wa la hawla wa la quwwata illa billah.',
    translation:
      'In the name of Allah, I place my trust in Allah, and there is no power and no strength except with Allah.',
    reference: 'Abu Dawud 5095, Tirmidhi 3426',
    authenticity: 'Tirmidhi (Hasan)',
  },
  {
    id: 'before-eating',
    title: 'Dua Before Eating',
    category: 'Food',
    arabic: 'بسم الله.',
    transliteration: 'Bismillah.',
    translation: 'In the name of Allah.',
    reference: 'Sahih Muslim 2022',
    authenticity: 'Sahih Muslim',
  },
  {
    id: 'after-eating',
    title: 'Dua After Eating',
    category: 'Food',
    arabic: 'الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة.',
    transliteration:
      'Alhamdu lillahil-ladhi atamani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.',
    translation:
      'All praise is for Allah who fed me this and provided it for me without any power or might from me.',
    reference: 'Tirmidhi 3458',
    authenticity: 'Tirmidhi (Hasan)',
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    title: 'Daily Zikr: Subhanallahi wa bihamdihi',
    category: 'Evening',
    arabic: 'سبحان الله وبحمده.',
    transliteration: 'Subhanallahi wa bihamdihi.',
    translation: 'Glory be to Allah and praise be to Him.',
    reference: 'Sahih Bukhari 6405, Sahih Muslim 2691',
    authenticity: 'Bukhari & Muslim',
    repetitions: '100 times daily',
    isDailyZikr: true,
  },
  {
    id: 'la-ilaha-illallah-wahdahu',
    title: 'Daily Zikr of Tawhid',
    category: 'Morning',
    arabic:
      'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.',
    transliteration:
      'La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu wa huwa ala kulli shayin qadir.',
    translation:
      'None has the right to be worshipped except Allah alone, without partner. His is the dominion and His is all praise, and He is over all things capable.',
    reference: 'Sahih Bukhari 3293, Sahih Muslim 2691',
    authenticity: 'Bukhari & Muslim',
    repetitions: '100 times daily',
    isDailyZikr: true,
  },
  {
    id: 'salawat-ibrahimiyyah',
    title: 'Salawat Upon the Prophet (peace be upon him)',
    category: 'Evening',
    arabic:
      'اللهم صل على محمد وعلى آل محمد، كما صليت على إبراهيم وعلى آل إبراهيم، إنك حميد مجيد. اللهم بارك على محمد وعلى آل محمد، كما باركت على إبراهيم وعلى آل إبراهيم، إنك حميد مجيد.',
    transliteration:
      'Allahumma salli ala Muhammad wa ala ali Muhammad, kama sallayta ala Ibrahim wa ala ali Ibrahim, innaka hamidun majid. Allahumma barik ala Muhammad wa ala ali Muhammad, kama barakta ala Ibrahim wa ala ali Ibrahim, innaka hamidun majid.',
    translation:
      'O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim; indeed, You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim; indeed, You are Praiseworthy, Glorious.',
    reference: 'Sahih Bukhari 3370, Sahih Muslim 406',
    authenticity: 'Bukhari & Muslim',
    repetitions: 'Any time, especially on Friday',
    isDailyZikr: true,
  },
]
