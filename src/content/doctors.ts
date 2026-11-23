import type { ImageKey } from './images';

export interface Doctor {
  slug: string;
  name: string;
  role: string;
  department: string;
  qualifications: string;
  years: number;
  languages: string[];
  fee: number;
  /** Weekday names the doctor sees outpatients. */
  days: string[];
  nextAvailable: string;
  image: ImageKey;
  imagePosition?: string;
  bio: string;
  interests: string[];
  education: string[];
}

export const doctors: Doctor[] = [
  {
    slug: 'meera-k',
    name: 'Dr. Meera K.',
    role: 'Senior Consultant, Cardiology',
    department: 'cardiology',
    qualifications: 'MBBS, MD, DM Cardiology',
    years: 14,
    languages: ['English', 'Malayalam', 'Hindi'],
    fee: 1100,
    days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    nextAvailable: 'Tomorrow, 10:00 am',
    image: 'dr-meera',
    imagePosition: '50% 18%',
    bio: 'Dr. Meera leads the heart failure clinic and the women’s heart programme. She is known for taking the time to explain test results in plain words, and for involving families in care plans.',
    interests: ['Heart failure', 'Women’s heart health', 'Echocardiography', 'Preventive cardiology'],
    education: [
      'MBBS, Government Medical College, Kozhikode',
      'MD General Medicine, Government Medical College, Thiruvananthapuram',
      'DM Cardiology, a national institute in Chandigarh',
    ],
  },
  {
    slug: 'rahul-v',
    name: 'Dr. Rahul V.',
    role: 'Interventional Cardiologist',
    department: 'cardiology',
    qualifications: 'MBBS, MD, DM Cardiology',
    years: 12,
    languages: ['English', 'Malayalam', 'Hindi', 'Urdu'],
    fee: 1100,
    days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    nextAvailable: 'Today, 6:30 pm',
    image: 'dr-rahul',
    imagePosition: '50% 16%',
    bio: 'Dr. Rahul leads the 24-hour cath lab team. He performs angioplasty through the wrist for most patients, which means less bleeding and a quicker return home.',
    interests: [
      'Primary angioplasty',
      'Complex coronary disease',
      'Wrist (radial) access',
      'Intravascular imaging',
    ],
    education: [
      'MBBS, Government Medical College, Kottayam',
      'MD General Medicine, Kasturba Medical College, Manipal',
      'DM Cardiology, a teaching hospital in Chennai',
    ],
  },
  {
    slug: 'leena-r',
    name: 'Dr. Leena R.',
    role: 'Consultant, Obstetrics and Gynaecology',
    department: 'obstetrics-and-gynaecology',
    qualifications: 'MBBS, MS, DNB',
    years: 12,
    languages: ['English', 'Malayalam'],
    fee: 1000,
    days: ['Tuesday', 'Thursday', 'Saturday'],
    nextAvailable: 'Thursday, 9:30 am',
    image: 'dr-leena',
    imagePosition: '40% 18%',
    bio: 'Dr. Leena cares for women through pregnancy, birth and beyond, with a special interest in high-risk pregnancy and keyhole surgery for fibroids and endometriosis.',
    interests: [
      'High-risk pregnancy',
      'Normal birth after caesarean',
      'Keyhole gynaecological surgery',
      'Endometriosis',
    ],
    education: [
      'MBBS, Government Medical College, Thrissur',
      'MS Obstetrics and Gynaecology, Government Medical College, Kozhikode',
      'DNB Obstetrics and Gynaecology',
    ],
  },
  {
    slug: 'vivek-p',
    name: 'Dr. Vivek P.',
    role: 'Consultant, Orthopaedics and Sports Medicine',
    department: 'orthopaedics',
    qualifications: 'MBBS, MS Orthopaedics',
    years: 9,
    languages: ['English', 'Hindi', 'Malayalam'],
    fee: 900,
    days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    nextAvailable: 'Tomorrow, 8:30 am',
    image: 'dr-vivek',
    imagePosition: '50% 18%',
    bio: 'Dr. Vivek treats sports injuries and arthritis, and performs knee and shoulder arthroscopy. He works closely with physiotherapists so recovery starts the day after surgery.',
    interests: ['Knee replacement', 'Sports injuries', 'Arthroscopy', 'Shoulder problems'],
    education: [
      'MBBS, Government Medical College, Ernakulam',
      'MS Orthopaedics, a teaching hospital in Bengaluru',
      'Fellowship in arthroscopy and sports medicine',
    ],
  },
  {
    slug: 'fathima-n',
    name: 'Dr. Fathima N.',
    role: 'Consultant, General Medicine',
    department: 'general-medicine',
    qualifications: 'MBBS, MD General Medicine',
    years: 16,
    languages: ['English', 'Malayalam', 'Arabic'],
    fee: 700,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    nextAvailable: 'Today, 11:15 am',
    image: 'dr-fathima',
    imagePosition: '50% 20%',
    bio: 'Dr. Fathima runs the fever clinic and reviews health articles for the Velune health library. She sees adults with infections, diabetes and long-term conditions.',
    interests: ['Tropical fevers', 'Diabetes', 'Infections', 'Health checks'],
    education: [
      'MBBS, Government Medical College, Alappuzha',
      'MD General Medicine, Government Medical College, Thiruvananthapuram',
    ],
  },
  {
    slug: 'arun-s',
    name: 'Dr. Arun S.',
    role: 'Consultant, Endocrinology',
    department: 'general-medicine',
    qualifications: 'MBBS, MD, DM Endocrinology',
    years: 11,
    languages: ['English', 'Malayalam', 'Tamil'],
    fee: 900,
    days: ['Tuesday', 'Wednesday', 'Friday'],
    nextAvailable: 'Today, 4:30 pm',
    image: 'dr-arun',
    imagePosition: '50% 12%',
    bio: 'Dr. Arun treats diabetes, thyroid and hormone conditions. He runs the diabetes clinic with a dietitian and educator, so patients leave with a plan they can follow at home.',
    interests: ['Type 1 and type 2 diabetes', 'Thyroid disease', 'Obesity', 'Diabetes in pregnancy'],
    education: [
      'MBBS, Government Medical College, Kottayam',
      'MD General Medicine, a teaching hospital in Mangaluru',
      'DM Endocrinology, a teaching hospital in Kochi',
    ],
  },
  {
    slug: 'nisha-t',
    name: 'Dr. Nisha T.',
    role: 'Consultant, Family Medicine and Elder Care',
    department: 'general-medicine',
    qualifications: 'MBBS, DNB Family Medicine',
    years: 8,
    languages: ['English', 'Malayalam', 'Kannada'],
    fee: 800,
    days: ['Monday', 'Wednesday', 'Friday'],
    nextAvailable: 'Friday, 10:30 am',
    image: 'dr-nisha',
    imagePosition: '54% 22%',
    bio: 'Dr. Nisha looks after older adults and families. She reviews medicines, helps prevent falls and coordinates care when several specialists are involved.',
    interests: ['Elder care', 'Medicine reviews', 'Falls prevention', 'Family health'],
    education: ['MBBS, a medical college in Mysuru', 'DNB Family Medicine'],
  },
];

export const doctorBySlug = (slug: string) => doctors.find((d) => d.slug === slug);
export const doctorsIn = (department: string) => doctors.filter((d) => d.department === department);
