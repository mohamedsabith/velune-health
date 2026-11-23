import type { ImageKey } from './images';

export interface Department {
  slug: string;
  name: string;
  /** One line for cards and lists. */
  short: string;
  /** Opening paragraph of the department page. */
  intro: string;
  image: ImageKey;
  imagePosition?: string;
  conditions: string[];
  treatments: { name: string; text: string; slug?: string }[];
  tests: string[];
  whenToSee: string[];
  facts: { value: string; label: string }[];
  doctors: string[];
  faqs: { q: string; a: string }[];
  /** schema.org MedicalSpecialty value. */
  specialty: string;
}

export const departments: Department[] = [
  {
    slug: 'cardiology',
    name: 'Cardiology',
    short: 'Heart attack care, angioplasty, pacemakers and heart checks.',
    intro:
      'Our heart team treats everything from high blood pressure to heart attacks. The cath lab is open 24 hours, and a cardiologist sees every chest-pain patient who arrives at the emergency department.',
    image: 'consult',
    conditions: [
      'Chest pain and angina',
      'Heart attack',
      'Heart failure',
      'Irregular heartbeat',
      'High blood pressure',
      'Valve disease',
    ],
    treatments: [
      {
        name: 'Coronary angioplasty',
        text: 'A balloon and stent open a blocked heart artery, usually through the wrist.',
        slug: 'coronary-angioplasty',
      },
      { name: 'Pacemakers and ICDs', text: 'Small devices that keep the heart beating at a safe rhythm.' },
      {
        name: 'Heart failure clinic',
        text: 'Regular reviews, medicines and diet plans run by a specialist nurse.',
      },
      {
        name: 'Cardiac rehabilitation',
        text: 'Twelve weeks of supervised exercise and advice after a heart attack or surgery.',
      },
    ],
    tests: [
      'ECG',
      'Echocardiogram',
      'Treadmill stress test',
      'Holter monitoring',
      'Coronary angiogram',
      'CT coronary angiogram',
    ],
    whenToSee: [
      'Chest pain, pressure or tightness, especially with sweating or breathlessness (call emergency)',
      'Breathlessness when you walk or lie flat',
      'A racing, fluttering or very slow heartbeat',
      'Swollen ankles with tiredness',
    ],
    facts: [
      { value: '24 h', label: 'cath lab, every day' },
      { value: '62 min', label: 'average door-to-balloon time' },
      { value: '1,400', label: 'angioplasties a year' },
    ],
    doctors: ['meera-k', 'rahul-v'],
    faqs: [
      {
        q: 'Do I need a referral to see a cardiologist?',
        a: 'No. You can book directly online or by phone. Bring any old ECGs, reports and your current medicines.',
      },
      {
        q: 'How long does an angiogram take?',
        a: 'Usually 20 to 30 minutes. Most people go home the same day or the next morning.',
      },
      {
        q: 'Is the cath lab really open at night?',
        a: 'Yes. An interventional cardiologist and cath lab team are on call 24 hours a day, including Sundays and holidays.',
      },
    ],
    specialty: 'Cardiovascular',
  },
  {
    slug: 'neurology',
    name: 'Neurology',
    short: 'Stroke, epilepsy, headaches, and brain and spine disorders.',
    intro:
      'Neurologists and neurosurgeons work as one team. Our stroke unit can give clot-dissolving treatment within minutes of a scan, because time saved is brain saved.',
    image: 'xray',
    conditions: [
      'Stroke',
      'Epilepsy and seizures',
      'Migraine and headaches',
      "Parkinson's disease",
      'Nerve pain and numbness',
      'Back and neck problems',
    ],
    treatments: [
      {
        name: 'Acute stroke care',
        text: 'Clot-dissolving medicine and clot retrieval, with a stroke team on call 24 hours.',
      },
      {
        name: 'Epilepsy clinic',
        text: 'Video EEG, medicine reviews and plans for school, work and driving.',
      },
      { name: 'Headache clinic', text: 'Finding your triggers and the right preventive treatment.' },
      { name: 'Spine surgery', text: 'Keyhole and open surgery for slipped discs and spinal narrowing.' },
    ],
    tests: ['CT and MRI brain', 'EEG and video EEG', 'Nerve conduction study', 'EMG'],
    whenToSee: [
      'Face drooping, arm weakness or slurred speech (call emergency at once)',
      'A first seizure',
      'Headaches that are new, severe or getting worse',
      'Numbness, tingling or weakness that does not go away',
    ],
    facts: [
      { value: '24 h', label: 'stroke team' },
      { value: '28 min', label: 'average door-to-needle time' },
      { value: '3T', label: 'MRI on site' },
    ],
    doctors: [],
    faqs: [
      {
        q: 'What should I do if I think someone is having a stroke?',
        a: 'Call +91 484 000 2112 or 108 straight away and note the time symptoms began. Do not wait to see if they pass.',
      },
      {
        q: 'Can I drive after a seizure?',
        a: 'Usually not for a period set by law and by your neurologist. We will explain the rules for your situation.',
      },
    ],
    specialty: 'Neurologic',
  },
  {
    slug: 'orthopaedics',
    name: 'Orthopaedics',
    short: 'Joint replacement, spine care, fractures and sports injuries.',
    intro:
      'From a sprained ankle to a new knee, our orthopaedic surgeons and physiotherapists plan your recovery from the first visit, so you are back on your feet as soon as it is safe.',
    image: 'physio',
    conditions: [
      'Knee and hip arthritis',
      'Fractures',
      'Sports injuries',
      'Back and neck pain',
      'Shoulder problems',
      'Osteoporosis',
    ],
    treatments: [
      {
        name: 'Knee replacement',
        text: 'Most patients walk with support on the day after surgery.',
        slug: 'knee-replacement',
      },
      { name: 'Hip replacement', text: 'Modern implants and a structured rehabilitation plan.' },
      { name: 'Arthroscopy', text: 'Keyhole surgery for knee and shoulder injuries.' },
      { name: 'Physiotherapy', text: 'One-to-one sessions in our rehabilitation gym.' },
    ],
    tests: ['Digital X-ray', 'MRI', 'Bone density scan (DEXA)', 'Gait assessment'],
    whenToSee: [
      'A possible broken bone or a joint that looks out of place (come to emergency)',
      'Joint pain that stops you walking, sleeping or working',
      'A sports injury that has not improved in two weeks',
      'Back pain with numbness in the legs',
    ],
    facts: [
      { value: '900', label: 'joint replacements a year' },
      { value: 'Day 1', label: 'walking after knee surgery' },
      { value: '6', label: 'physiotherapists' },
    ],
    doctors: ['vivek-p'],
    faqs: [
      {
        q: 'How long will I stay in hospital after a knee replacement?',
        a: 'Usually three to four days. Physiotherapy starts the day after surgery.',
      },
      {
        q: 'Do I need surgery for knee pain?',
        a: 'Most people do not. Weight, exercise, physiotherapy and medicines help many patients. Surgery is offered when these stop working.',
      },
    ],
    specialty: 'Musculoskeletal',
  },
  {
    slug: 'paediatrics',
    name: 'Paediatrics',
    short: "Newborn care, vaccinations and a children's ward.",
    intro:
      'Children are not small adults. Our paediatricians, children’s nurses and a 20-bed neonatal intensive care unit look after babies and children up to 16 years old.',
    image: 'child-check',
    conditions: [
      'Fever and infections',
      'Asthma and wheezing',
      'Newborn jaundice',
      'Growth and feeding concerns',
      'Allergies',
      'Premature babies',
    ],
    treatments: [
      { name: 'Vaccinations', text: 'The full national schedule plus optional vaccines, with reminders.' },
      {
        name: 'Neonatal intensive care',
        text: 'Twenty NICU beds, with parents welcome at the cot at any hour.',
      },
      { name: 'Children’s ward', text: 'A parent can stay with their child, day and night.' },
      { name: 'Child development clinic', text: 'Checks for speech, movement and learning milestones.' },
    ],
    tests: ['Newborn hearing screening', 'Blood tests with numbing cream', 'Chest X-ray', 'Allergy testing'],
    whenToSee: [
      'A baby under three months with a fever (come to emergency)',
      'Fast or noisy breathing, or a child who is very drowsy',
      'Fewer wet nappies than usual or refusing feeds',
      'Worries about growth, speech or development',
    ],
    facts: [
      { value: '20', label: 'neonatal intensive care beds' },
      { value: '24 h', label: 'paediatrician on site' },
      { value: '0–16', label: 'years of age' },
    ],
    doctors: [],
    faqs: [
      {
        q: 'Can I stay overnight with my child?',
        a: 'Yes. One parent can stay with their child at any time, and we provide a bed in the room.',
      },
      {
        q: 'Do you give vaccinations on Sundays?',
        a: 'The vaccination clinic runs Monday to Saturday, 8 am to 8 pm.',
      },
    ],
    specialty: 'Pediatric',
  },
  {
    slug: 'obstetrics-and-gynaecology',
    name: 'Obstetrics and Gynaecology',
    short: 'Pregnancy, childbirth, fertility and menopause care.',
    intro:
      'From your first scan to your baby’s first check-up, the same small team of doctors and midwives looks after you. Our birthing suites are private, with a bed for your partner.',
    image: 'hd-kids',
    imagePosition: '58% 30%',
    conditions: [
      'Pregnancy and childbirth',
      'High-risk pregnancy',
      'Irregular or painful periods',
      'Fibroids and cysts',
      'Fertility problems',
      'Menopause',
    ],
    treatments: [
      {
        name: 'Normal and assisted birth',
        text: 'Private birthing suites, with pain relief options explained early.',
        slug: 'normal-delivery',
      },
      { name: 'Caesarean section', text: 'Planned or emergency, with a paediatrician present.' },
      {
        name: 'Keyhole gynaecological surgery',
        text: 'For fibroids, cysts and endometriosis, with a shorter recovery.',
      },
      { name: 'Fertility clinic', text: 'Tests for both partners and treatment up to IVF.' },
    ],
    tests: ['Pregnancy scans', 'Pap smear and HPV test', 'Pelvic ultrasound', 'Hormone tests'],
    whenToSee: [
      'Bleeding, severe pain or reduced baby movements in pregnancy (come to emergency)',
      'Periods that are very heavy, painful or irregular',
      'Trying to conceive for a year without success',
      'Menopause symptoms that affect daily life',
    ],
    facts: [
      { value: '2,800', label: 'babies born each year' },
      { value: '6', label: 'private birthing suites' },
      { value: '24 h', label: 'obstetrician on site' },
    ],
    doctors: ['leena-r'],
    faqs: [
      {
        q: 'Can my partner stay with me during labour?',
        a: 'Yes. One birth partner can stay with you throughout labour and birth, including during most caesarean sections.',
      },
      {
        q: 'When should I book my first appointment?',
        a: 'As soon as you know you are pregnant, ideally before 10 weeks.',
      },
    ],
    specialty: 'Obstetric',
  },
  {
    slug: 'oncology',
    name: 'Oncology',
    short: 'Cancer diagnosis, chemotherapy and radiotherapy.',
    intro:
      'A cancer diagnosis raises many questions. A named nurse navigator guides you from your first test to the end of treatment, and a tumour board of specialists agrees your plan together.',
    image: 'mri',
    conditions: [
      'Breast cancer',
      'Head and neck cancers',
      'Bowel and stomach cancers',
      'Lung cancer',
      'Blood cancers',
      'Gynaecological cancers',
    ],
    treatments: [
      { name: 'Chemotherapy', text: 'In a calm day-care unit with reclining chairs and a garden view.' },
      { name: 'Radiotherapy', text: 'Precise treatment that spares healthy tissue.' },
      { name: 'Cancer surgery', text: 'By surgeons who specialise in each part of the body.' },
      {
        name: 'Supportive care',
        text: 'Help with pain, nutrition, sleep and emotions, for you and your family.',
      },
    ],
    tests: ['Biopsy', 'CT and PET-CT', 'Mammogram', 'Tumour markers'],
    whenToSee: [
      'A lump that does not go away',
      'Unexplained weight loss or tiredness',
      'Bleeding that is unusual for you',
      'A cough or hoarse voice lasting more than three weeks',
    ],
    facts: [
      { value: '1', label: 'nurse navigator for each patient' },
      { value: 'Weekly', label: 'tumour board' },
      { value: '24', label: 'day-care chairs' },
    ],
    doctors: [],
    faqs: [
      {
        q: 'Can I get a second opinion on my cancer treatment?',
        a: 'Yes. Send your reports and scans, and a specialist will review them and meet you within a week.',
      },
      {
        q: 'Can a family member stay with me during chemotherapy?',
        a: 'Yes, one person can sit with you in the day-care unit.',
      },
    ],
    specialty: 'Oncologic',
  },
  {
    slug: 'general-medicine',
    name: 'General Medicine',
    short: 'Fever, infections, diabetes and long-term conditions.',
    intro:
      'If you are not sure which doctor to see, start here. Our physicians diagnose and treat a wide range of illnesses, and refer you to a specialist when you need one.',
    image: 'hd-care',
    imagePosition: '45% 30%',
    conditions: [
      'Fever and infections',
      'Diabetes',
      'High blood pressure',
      'Thyroid problems',
      'Asthma and COPD',
      'Dengue and leptospirosis',
    ],
    treatments: [
      { name: 'Diabetes clinic', text: 'Doctor, dietitian and educator in one visit.' },
      { name: 'Fever clinic', text: 'Same-day tests for dengue, malaria and typhoid.' },
      { name: 'Elder care', text: 'Medicine reviews, falls prevention and memory checks.' },
      { name: 'Day-care infusions', text: 'Iron, antibiotics and other drips without an overnight stay.' },
    ],
    tests: ['Complete blood count', 'HbA1c', 'Thyroid profile', 'Chest X-ray'],
    whenToSee: [
      'A fever lasting more than three days',
      'Feeling very thirsty, tired or passing urine often',
      'Blood pressure or sugar readings outside your target',
      'Any illness when you are not sure who to see',
    ],
    facts: [
      { value: 'Same day', label: 'fever test results' },
      { value: '12', label: 'physicians' },
      { value: '45 min', label: 'first consultation' },
    ],
    doctors: ['fathima-n', 'arun-s', 'nisha-t'],
    faqs: [
      {
        q: 'Can I walk in without an appointment?',
        a: 'Yes, during outpatient hours. Booking ahead means a shorter wait.',
      },
      {
        q: 'Do you do home visits?',
        a: 'For older patients who cannot travel, our elder care team can arrange a home visit within Kochi.',
      },
    ],
    specialty: 'PrimaryCare',
  },
  {
    slug: 'gastroenterology',
    name: 'Gastroenterology',
    short: 'Stomach, liver and bowel care, including endoscopy.',
    intro:
      'Our gastroenterologists treat problems from the food pipe to the bowel, and the liver. Most endoscopies are done as day cases, with sedation so you feel comfortable.',
    image: 'lab',
    conditions: [
      'Acidity and ulcers',
      'Liver disease and jaundice',
      'Gallstones',
      'Irritable bowel syndrome',
      'Inflammatory bowel disease',
      'Swallowing problems',
    ],
    treatments: [
      { name: 'Endoscopy and colonoscopy', text: 'Day-case procedures with sedation.' },
      { name: 'ERCP', text: 'Removes stones blocking the bile duct without open surgery.' },
      { name: 'Liver clinic', text: 'Care for fatty liver, hepatitis and cirrhosis.' },
      {
        name: 'Keyhole gallbladder surgery',
        text: 'With our surgical colleagues, usually a one-night stay.',
      },
    ],
    tests: ['Upper GI endoscopy', 'Colonoscopy', 'FibroScan', 'Liver function tests'],
    whenToSee: [
      'Vomiting blood or black stools (come to emergency)',
      'Yellow eyes or skin',
      'Heartburn most days, or difficulty swallowing',
      'A change in bowel habit lasting more than three weeks',
    ],
    facts: [
      { value: '4', label: 'endoscopy suites' },
      { value: 'Day case', label: 'for most procedures' },
      { value: '24 h', label: 'bleed team' },
    ],
    doctors: [],
    faqs: [
      {
        q: 'Will an endoscopy hurt?',
        a: 'Most people feel only mild discomfort. We offer sedation, so many patients remember little of the procedure.',
      },
      {
        q: 'Do I need to fast?',
        a: 'Yes, usually for six hours before. We will send you instructions when you book.',
      },
    ],
    specialty: 'Gastroenterologic',
  },
  {
    slug: 'dermatology',
    name: 'Dermatology',
    short: 'Skin, hair and nail conditions, and skin cancer checks.',
    intro:
      'Our dermatologists treat skin conditions in adults and children, from acne and eczema to psoriasis and skin cancer, with clear advice on what really works.',
    image: 'derma',
    conditions: ['Acne', 'Eczema', 'Psoriasis', 'Fungal infections', 'Hair loss', 'Moles and skin cancer'],
    treatments: [
      { name: 'Phototherapy', text: 'Light treatment for psoriasis, eczema and vitiligo.' },
      { name: 'Minor skin surgery', text: 'Removal of moles, cysts and skin tags.' },
      { name: 'Acne and scar clinic', text: 'Medicines, peels and laser for scarring.' },
      { name: 'Hair and scalp clinic', text: 'Finding the cause of hair loss and treating it.' },
    ],
    tests: ['Dermoscopy', 'Skin biopsy', 'Patch testing', 'Fungal scrapings'],
    whenToSee: [
      'A mole that changes shape, colour or size',
      'A rash with fever, or skin that blisters or peels',
      'Acne or eczema that does not respond to treatment',
      'Sudden or patchy hair loss',
    ],
    facts: [
      { value: '3', label: 'dermatologists' },
      { value: 'Same week', label: 'mole checks' },
      { value: 'Adults and children', label: 'treated' },
    ],
    doctors: [],
    faqs: [
      {
        q: 'Do you offer cosmetic treatments?',
        a: 'We focus on medical skin care. Some treatments for scars and pigmentation are available after a consultation.',
      },
    ],
    specialty: 'Dermatologic',
  },
  {
    slug: 'dentistry',
    name: 'Dentistry',
    short: 'Check-ups, fillings, root canals, braces and implants.',
    intro:
      'A full dental department inside the hospital, which matters if you have a heart condition, diabetes or need treatment under anaesthesia.',
    image: 'dentist',
    conditions: ['Tooth decay', 'Gum disease', 'Toothache', 'Crooked teeth', 'Missing teeth', 'Jaw pain'],
    treatments: [
      { name: 'Check-ups and cleaning', text: 'Every six months for most people.' },
      { name: 'Root canal treatment', text: 'Saves a painful or infected tooth.' },
      { name: 'Braces and aligners', text: 'For children and adults.' },
      { name: 'Dental implants', text: 'A permanent replacement for missing teeth.' },
    ],
    tests: ['Digital dental X-ray', 'OPG (full-mouth X-ray)', '3D CBCT scan'],
    whenToSee: [
      'Toothache or swelling of the face',
      'Bleeding gums',
      'A broken or loose tooth',
      'It has been more than a year since your last check-up',
    ],
    facts: [
      { value: '6', label: 'dental chairs' },
      { value: 'Same day', label: 'emergency dental care' },
      { value: 'All ages', label: 'treated' },
    ],
    doctors: [],
    faqs: [
      {
        q: 'Is dental treatment covered by insurance?',
        a: 'Usually only after an accident or as part of a hospital stay. Our billing desk can check your policy.',
      },
    ],
    specialty: 'Dentistry',
  },
];

export const departmentBySlug = (slug: string) => departments.find((d) => d.slug === slug);
