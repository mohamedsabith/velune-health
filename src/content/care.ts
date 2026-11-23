import type { ImageKey } from './images';

export interface Treatment {
  slug: string;
  name: string;
  department: string;
  summary: string;
  image: ImageKey;
  imagePosition?: string;
  forWhom: string[];
  steps: { title: string; text: string }[];
  stay: string;
  duration: string;
  recovery: string;
  costFrom: number;
  costNote: string;
  risks: string;
  faqs: { q: string; a: string }[];
}

export const treatments: Treatment[] = [
  {
    slug: 'coronary-angioplasty',
    name: 'Coronary angioplasty',
    department: 'cardiology',
    summary:
      'Angioplasty opens a narrowed or blocked heart artery with a small balloon, and a stent keeps it open. At Velune it is usually done through the wrist, with you awake and comfortable.',
    image: 'hd-heart',
    imagePosition: '60% 30%',
    forWhom: [
      'People having a heart attack, as an emergency',
      'Chest pain on exertion that medicines do not control',
      'A blockage found on an angiogram or CT scan',
    ],
    steps: [
      {
        title: 'Before',
        text: 'Blood tests, an ECG and an echocardiogram. Your cardiologist explains the plan and any risks, and you sign a consent form.',
      },
      {
        title: 'During',
        text: 'A local anaesthetic numbs the wrist. A thin tube is passed to the heart, the blockage is opened with a balloon and a stent is placed. It takes 30 to 90 minutes.',
      },
      {
        title: 'After',
        text: 'A band on the wrist stops bleeding. Most people sit up within hours and go home the next day.',
      },
      {
        title: 'At home',
        text: 'Take your blood thinners every day without missing a dose. Cardiac rehabilitation starts two weeks later.',
      },
    ],
    stay: '1 night',
    duration: '30 to 90 minutes',
    recovery: 'Most people return to desk work within a week',
    costFrom: 145000,
    costNote:
      'Includes one stent, the procedure and a one-night stay. The final cost depends on the number and type of stents.',
    risks:
      'Serious problems are uncommon. They include bleeding at the wrist, an allergic reaction to the dye, and rarely a heart attack or stroke during the procedure. Your cardiologist will talk through your own risk.',
    faqs: [
      {
        q: 'Will I be awake?',
        a: 'Yes. You will have a local anaesthetic and a mild sedative if you need one, so you can talk to the team throughout.',
      },
      { q: 'Is a stent permanent?', a: 'Yes. It becomes part of the artery wall within a few months.' },
    ],
  },
  {
    slug: 'knee-replacement',
    name: 'Knee replacement',
    department: 'orthopaedics',
    summary:
      'A knee replacement swaps the worn surfaces of the joint for smooth metal and plastic parts. It relieves pain and helps you walk further when arthritis has not responded to other treatment.',
    image: 'physio',
    imagePosition: '55% 35%',
    forWhom: [
      'Severe knee pain from arthritis',
      'Pain that wakes you at night or limits walking',
      'Other treatments such as physiotherapy have stopped helping',
    ],
    steps: [
      {
        title: 'Before',
        text: 'A pre-operative check, a knee class with our physiotherapists, and advice on preparing your home.',
      },
      { title: 'During', text: 'Surgery under spinal anaesthesia takes about 90 minutes.' },
      {
        title: 'After',
        text: 'You stand and walk with support the day after surgery. Most people go home on day three or four.',
      },
      { title: 'At home', text: 'Daily exercises and physiotherapy for six to twelve weeks.' },
    ],
    stay: '3 to 4 nights',
    duration: 'About 90 minutes',
    recovery: 'Walking without a stick in four to six weeks',
    costFrom: 210000,
    costNote: 'One knee, including the implant, surgery, a four-night stay and inpatient physiotherapy.',
    risks:
      'Risks include infection, blood clots and stiffness. We use measures to reduce each one and explain them before you decide.',
    faqs: [
      {
        q: 'How long does a knee replacement last?',
        a: 'Most modern knee replacements last 20 years or more.',
      },
      {
        q: 'Can both knees be done together?',
        a: 'Sometimes. Your surgeon will advise based on your health and fitness.',
      },
    ],
  },
  {
    slug: 'normal-delivery',
    name: 'Normal birth',
    department: 'obstetrics-and-gynaecology',
    summary:
      'Most babies are born without surgery. Our midwives and obstetricians support you through labour in a private birthing suite, with your partner beside you.',
    image: 'hd-kids',
    imagePosition: '58% 30%',
    forWhom: [
      'Healthy pregnancies at 37 weeks or more',
      'Many women who had a caesarean before',
      'Anyone who wants to plan their birth',
    ],
    steps: [
      { title: 'Before', text: 'A birth-planning visit at 34 weeks and a tour of the birthing suites.' },
      {
        title: 'During',
        text: 'A midwife stays with you through labour. Pain relief includes epidurals, available 24 hours.',
      },
      { title: 'After', text: 'Skin-to-skin contact straight away, and help with breastfeeding.' },
      {
        title: 'At home',
        text: 'A follow-up call within two days and a check-up for you and your baby at six weeks.',
      },
    ],
    stay: '2 nights',
    duration: 'Labour varies, usually 8 to 18 hours for a first baby',
    recovery: 'Most mothers feel themselves again within two to six weeks',
    costFrom: 55000,
    costNote: 'Includes the birth, a two-night stay in a private room and the baby’s first checks.',
    risks:
      'Sometimes labour needs help with instruments or a caesarean section. Your team will explain options as they arise.',
    faqs: [
      {
        q: 'Can I choose not to have an epidural?',
        a: 'Yes. We also offer breathing techniques, warm water and other comfort measures.',
      },
      {
        q: 'Is a paediatrician present?',
        a: 'A paediatrician is in the hospital 24 hours and attends whenever your baby needs one.',
      },
    ],
  },
];

export const treatmentBySlug = (slug: string) => treatments.find((t) => t.slug === slug);

export interface Facility {
  name: string;
  line: string;
  text: string;
  image: ImageKey;
  points: string[];
}

export const facilities: Facility[] = [
  {
    name: 'Operation theatres',
    line: 'Eight modular theatres, including a hybrid theatre for heart surgery.',
    text: 'Clean-air theatres with imaging built in, so surgeons can check results during the operation.',
    image: 'ot',
    points: ['Hybrid cardiac theatre', 'Laminar air flow', 'Recovery bay beside each theatre'],
  },
  {
    name: 'Intensive care',
    line: 'Thirty ICU beds, with one nurse for every patient on a ventilator.',
    text: 'Medical, surgical, cardiac and neonatal intensive care, staffed by intensivists 24 hours a day.',
    image: 'icu',
    points: ['30 adult ICU beds', '20 neonatal ICU beds', 'Family room on the same floor'],
  },
  {
    name: 'Imaging',
    line: '3T MRI and 128-slice CT beside the emergency department.',
    text: 'Scans are reported by radiologists within hours, and emergency scans within 30 minutes.',
    image: 'mri',
    points: ['3T MRI', '128-slice CT', 'Digital X-ray, ultrasound and mammography'],
  },
  {
    name: 'Laboratory',
    line: 'NABL accredited, open 24 hours, most results within 6 hours.',
    text: 'Pathology, microbiology and blood bank in one place. Reports arrive by SMS and in the patient app.',
    image: 'lab',
    points: ['Open 24 hours', 'Home sample collection', 'Blood bank'],
  },
  {
    name: 'Patient rooms',
    line: 'Single rooms with a bed for a family member.',
    text: 'Every room has its own bathroom, a garden or river view and a bed for one family member.',
    image: 'room',
    points: ['Private and shared rooms', 'Meals cooked to Kerala recipes', 'Free Wi-Fi'],
  },
  {
    name: 'Pharmacy',
    line: 'Open 24 hours, with home delivery in Kochi.',
    text: 'Our pharmacists check every prescription and explain how to take your medicines.',
    image: 'pharmacy',
    points: ['Open 24 hours', 'Home delivery', 'Medicine reviews'],
  },
];

export interface HealthPackage {
  slug: string;
  name: string;
  forWhom: string;
  price: number;
  time: string;
  tests: string[];
  popular?: boolean;
}

export const healthPackages: HealthPackage[] = [
  {
    slug: 'essential',
    name: 'Essential health check',
    forWhom: 'Adults under 40',
    price: 2400,
    time: '2 hours',
    tests: [
      'Complete blood count',
      'Blood sugar (fasting)',
      'Cholesterol profile',
      'Liver and kidney tests',
      'Urine test',
      'Doctor consultation',
    ],
  },
  {
    slug: 'executive',
    name: 'Executive health check',
    forWhom: 'Adults 40 and over',
    price: 6500,
    time: '4 hours',
    popular: true,
    tests: [
      'Everything in Essential',
      'HbA1c',
      'Thyroid profile',
      'ECG and echocardiogram',
      'Chest X-ray',
      'Abdominal ultrasound',
      'Eye and dental check',
      'Dietitian consultation',
    ],
  },
  {
    slug: 'heart',
    name: 'Heart health check',
    forWhom: 'People with heart risk factors',
    price: 8900,
    time: '4 hours',
    tests: [
      'Cholesterol profile',
      'HbA1c',
      'ECG',
      'Echocardiogram',
      'Treadmill stress test',
      'Cardiologist consultation',
    ],
  },
  {
    slug: 'womens',
    name: 'Women’s health check',
    forWhom: 'Women 30 and over',
    price: 5800,
    time: '3 hours',
    tests: [
      'Complete blood count',
      'Thyroid profile',
      'Pap smear and HPV test',
      'Breast examination and mammogram (40+)',
      'Pelvic ultrasound',
      'Gynaecologist consultation',
    ],
  },
  {
    slug: 'senior',
    name: 'Senior health check',
    forWhom: 'Adults 60 and over',
    price: 7400,
    time: '4 hours',
    tests: [
      'Everything in Executive',
      'Bone density scan',
      'Vitamin D and B12',
      'Memory and balance check',
      'Medicine review',
    ],
  },
];

export interface DiagnosticTest {
  name: string;
  group: 'Blood and urine' | 'Imaging' | 'Heart' | 'Other';
  prep: string;
  results: string;
  price: number;
}

export const diagnosticTests: DiagnosticTest[] = [
  {
    name: 'Complete blood count',
    group: 'Blood and urine',
    prep: 'No preparation',
    results: 'Same day',
    price: 350,
  },
  {
    name: 'Fasting blood sugar and HbA1c',
    group: 'Blood and urine',
    prep: 'Fast for 8 to 10 hours',
    results: 'Same day',
    price: 600,
  },
  {
    name: 'Cholesterol profile',
    group: 'Blood and urine',
    prep: 'Fast for 10 to 12 hours',
    results: 'Same day',
    price: 700,
  },
  {
    name: 'Thyroid profile',
    group: 'Blood and urine',
    prep: 'No preparation',
    results: 'Same day',
    price: 650,
  },
  {
    name: 'Dengue NS1 and antibodies',
    group: 'Blood and urine',
    prep: 'No preparation',
    results: 'Within 6 hours',
    price: 1200,
  },
  {
    name: 'MRI brain',
    group: 'Imaging',
    prep: 'Remove metal objects; tell us about implants',
    results: 'Within 24 hours',
    price: 7500,
  },
  {
    name: 'CT chest',
    group: 'Imaging',
    prep: 'No preparation unless contrast is used',
    results: 'Within 24 hours',
    price: 4200,
  },
  {
    name: 'Ultrasound abdomen',
    group: 'Imaging',
    prep: 'Fast for 6 hours; full bladder',
    results: 'Same day',
    price: 1400,
  },
  {
    name: 'Mammogram',
    group: 'Imaging',
    prep: 'No deodorant or talc on the day',
    results: 'Within 48 hours',
    price: 2200,
  },
  { name: 'ECG', group: 'Heart', prep: 'No preparation', results: 'Immediately', price: 300 },
  { name: 'Echocardiogram', group: 'Heart', prep: 'No preparation', results: 'Same day', price: 2500 },
  {
    name: 'Treadmill stress test',
    group: 'Heart',
    prep: 'Wear comfortable shoes; light meal 2 hours before',
    results: 'Same day',
    price: 2000,
  },
  {
    name: 'Endoscopy',
    group: 'Other',
    prep: 'Fast for 6 hours',
    results: 'Same day; biopsy in 5 days',
    price: 3500,
  },
  {
    name: 'Bone density scan',
    group: 'Other',
    prep: 'No calcium tablets on the day',
    results: 'Same day',
    price: 1800,
  },
];
