import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Khetha AI',
      home: 'Home',
      findPath: 'Find my path',
      interestExplorer: 'Interest explorer',
      yourOptions: 'Your options',
      careerPractitioner: 'Career practitioner',
      journey: 'My journey',
      directory: 'Explore careers',
      explore: 'Explore',
      profile: 'Profile',
      subjectChooser: {
        subjectStep: '1 · Subjects',
        subjectHeading: 'Which subjects are you taking?',
        interestStep: '2 · Interests',
        interestHeading: 'What kind of work interests you?',
        chooseSubjectError: 'Choose at least one subject.',
        loadError: 'Unable to load career options.',
        loading: 'Finding options…',
        submit: 'Show career options',
        demoNotice: 'Using the demonstration catalogue because the API catalogue is empty or unavailable.',
      },
      assessment: {
        title: 'Demonstration Interest Explorer',
        instructions: 'Prototype flow only; not a validated psychometric assessment.',
        offlineNotice: 'Using the offline demonstration questions.',
        continue: 'Continue to subjects',
        questions: {
          '1': 'Which activity sounds most enjoyable?',
          '2': 'Which kind of problem would you prefer to solve?',
          '3': 'Where would you prefer to spend most of your working time?',
        },
        options: {
          'build-digital': 'Building an app or digital tool',
          'explain-ideas': 'Explaining an idea to other people',
          'find-patterns': 'Finding patterns in information',
          'technical-system': 'A technical system that is not working',
          'community-support': 'A community that needs support',
          'physical-system': 'A structure or physical system',
          'digital-work': 'At a computer or with digital systems',
          'people-work': 'With people in a learning or service setting',
          'site-work': 'On-site, in a workshop or outdoors',
        },
      },
      subjects: {
        mathematics: 'Mathematics',
        'mathematical-literacy': 'Mathematical Literacy',
        english: 'English',
        'information-technology': 'Information Technology',
        'physical-sciences': 'Physical Sciences',
        accounting: 'Accounting',
        geography: 'Geography',
        'engineering-graphics-design': 'Engineering Graphics and Design',
        'electrical-technology': 'Electrical Technology',
        'life-orientation': 'Life Orientation',
      },
      interests: {
        technology: 'Technology',
        'problem-solving': 'Problem solving',
        data: 'Data',
        research: 'Research',
        building: 'Building and creating',
        'helping-people': 'Helping people',
        communication: 'Communication',
        'hands-on': 'Hands-on work',
      },
      profileScreen: {
        heading: 'Profile and preferences',
        connectivity: 'Connectivity',
        lowData: 'Low-data mode',
        contentStatus: 'Content status',
        demoCatalogue: 'Demonstration catalogue',
        consent: 'Consent',
        guidanceOnly: 'Career guidance only',
        language: 'Interface language',
        languageHelp: 'Interface labels are translated in this prototype. Official career content still requires authorised translation review.',
      },
    },
  },
  xh: {
    translation: {
      appName: 'Khetha AI',
      home: 'Ikhaya',
      findPath: 'Fumana indlela yam',
      interestExplorer: 'Isikhangeli somdla',
      yourOptions: 'Iindlela zakho',
      careerPractitioner: 'Umcebisi ngamakhondo omsebenzi',
      journey: 'Uhambo lwam',
      directory: 'Jonga imisebenzi',
      explore: 'Phonononga',
      profile: 'Iprofayile',
      subjectChooser: {
        subjectStep: '1 · Izifundo',
        subjectHeading: 'Zeziphi izifundo ozenzayo?',
        interestStep: '2 · Izinto onomdla kuzo',
        interestHeading: 'Loluphi uhlobo lomsebenzi onomdla kuwo?',
        chooseSubjectError: 'Khetha ubuncinane isifundo esinye.',
        loadError: 'Ayikwazanga ukulayisha iindlela zemisebenzi.',
        loading: 'Kukhangelwa iindlela…',
        submit: 'Bonisa iindlela zemisebenzi',
        demoNotice: 'Kusetyenziswa ikhathalogu yomzekelo kuba ikhathalogu ye-API ayinanto okanye ayifumaneki.',
      },
      assessment: {
        title: 'Isikhangeli soMdla esiLilingo',
        instructions: 'Le yinkqubo yomzekelo kuphela; ayilovavanyo lwengqondo oluqinisekisiweyo.',
        offlineNotice: 'Kusetyenziswa imibuzo yomzekelo egcinwe kwesi sixhobo.',
        continue: 'Qhubeka uye kwizifundo',
        questions: {
          '1': 'Ngowuphi umsebenzi obonakala ungowona wonwabisayo?',
          '2': 'Loluphi uhlobo lwengxaki ongathanda ukuyisombulula?',
          '3': 'Ungathanda ukuchitha ixesha lakho elininzi lomsebenzi phi?',
        },
        options: {
          'build-digital': 'Ukwakha i-app okanye isixhobo sedijithali',
          'explain-ideas': 'Ukucacisela abanye abantu ingcamango',
          'find-patterns': 'Ukufumana iipateni kulwazi',
          'technical-system': 'Inkqubo yobugcisa engasebenziyo',
          'community-support': 'Uluntu olufuna inkxaso',
          'physical-system': 'Isakhiwo okanye inkqubo ebonakalayo',
          'digital-work': 'Kwikhompyutha okanye kwiinkqubo zedijithali',
          'people-work': 'Nabantu kwindawo yokufunda okanye yenkonzo',
          'site-work': 'Kwisiza, kwindawo yokusebenzela okanye ngaphandle',
        },
      },
      subjects: {
        mathematics: 'IMathematika',
        'mathematical-literacy': 'ULwazi lweMathematika',
        english: 'IsiNgesi',
        'information-technology': 'ITekhnoloji yoLwazi',
        'physical-sciences': 'IiNzululwazi zeFiziksi',
        accounting: 'Ucwangciso-mali',
        geography: 'IJografi',
        'engineering-graphics-design': 'Imizobo yobuNjineli noYilo',
        'electrical-technology': 'ITekhnoloji yoMbane',
        'life-orientation': 'ULwazi ngezoBomi',
      },
      interests: {
        technology: 'ITekhnoloji',
        'problem-solving': 'Ukusombulula iingxaki',
        data: 'Idatha',
        research: 'Uphando',
        building: 'Ukwakha nokuyila',
        'helping-people': 'Ukunceda abantu',
        communication: 'Unxibelelwano',
        'hands-on': 'Umsebenzi wezandla',
      },
      profileScreen: {
        heading: 'Iprofayile nezinto ozikhethayo',
        connectivity: 'Uqhagamshelo',
        lowData: 'Imowudi yedatha encinci',
        contentStatus: 'Ubume bomxholo',
        demoCatalogue: 'Ikhathalogu yomzekelo',
        consent: 'Imvume',
        guidanceOnly: 'Isikhokelo samakhondo omsebenzi kuphela',
        language: 'Ulwimi lojongano',
        languageHelp: 'Iilebhile zojongano ziguqulelwe kulo mzekelo. Umxholo osemthethweni wamakhondo omsebenzi usafuna uphononongo loguqulelo olugunyazisiweyo.',
      },
    },
  },
};

const savedWebLanguage =
  typeof window !== 'undefined' ? window.localStorage.getItem('khetha-ai:language') : null;
const deviceLanguage = getLocales()[0]?.languageCode;
const initialLanguage =
  savedWebLanguage === 'xh' || savedWebLanguage === 'en'
    ? savedWebLanguage
    : deviceLanguage === 'xh'
      ? 'xh'
      : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'xh'],
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined' && (language === 'en' || language === 'xh')) {
    window.localStorage.setItem('khetha-ai:language', language);
  }
});

export default i18n;
