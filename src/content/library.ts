import type { ImageKey } from './images';

export interface Article {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  minutes: number;
  image: ImageKey;
  reviewer: string;
  published: string;
  updated: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
  seeDoctor: string[];
  department: string;
}

/** Every article is reviewed by a named Velune doctor before it is published. */
export const articles: Article[] = [
  {
    slug: 'monsoon-fevers',
    title: 'Monsoon fevers: dengue, leptospirosis or flu?',
    summary:
      'How to tell the common rainy-season fevers apart, and the warning signs that mean you should see a doctor today.',
    topic: 'Seasonal health',
    minutes: 6,
    image: 'monsoon',
    reviewer: 'fathima-n',
    published: '2026-06-02',
    updated: '2026-10-14',
    department: 'general-medicine',
    sections: [
      {
        heading: 'Why fevers rise in the monsoon',
        body: [
          'Standing water lets mosquitoes breed, and floodwater can carry bacteria from animal urine. Both are common in Kerala between June and October.',
          'Most fevers are caused by viruses and settle in three to five days. A few need tests and treatment quickly.',
        ],
      },
      {
        heading: 'Telling them apart',
        body: [
          'Symptoms overlap, so only a blood test can confirm the cause. These patterns are a guide, not a diagnosis.',
        ],
        list: [
          'Flu: cough, sore throat, runny nose and body aches.',
          'Dengue: high fever, severe body and eye pain, sometimes a rash. Danger often comes as the fever falls.',
          'Leptospirosis: fever, muscle pain in the calves, red eyes, after wading through floodwater.',
        ],
      },
      {
        heading: 'Caring for yourself at home',
        body: [
          'Drink plenty of fluids, rest, and use paracetamol for fever. Avoid ibuprofen and aspirin until dengue has been ruled out, because they can increase bleeding.',
        ],
      },
    ],
    seeDoctor: [
      'Fever lasting more than three days',
      'Bleeding gums, black stools or red spots on the skin',
      'Severe stomach pain or repeated vomiting',
      'Yellow eyes, passing little urine, or confusion',
      'Any fever after wading through floodwater',
    ],
  },
  {
    slug: 'five-heart-numbers',
    title: 'Five numbers that tell you about your heart',
    summary:
      'Blood pressure, cholesterol, sugar, waist size and resting pulse: what yours should be and how to improve them.',
    topic: 'Heart health',
    minutes: 5,
    image: 'consult',
    reviewer: 'meera-k',
    published: '2026-04-18',
    updated: '2026-09-30',
    department: 'cardiology',
    sections: [
      {
        heading: 'The five numbers',
        body: ['Knowing these numbers helps you and your doctor judge your risk of heart attack and stroke.'],
        list: [
          'Blood pressure: below 130/80 for most adults.',
          'LDL cholesterol: below 100 mg/dL, lower if you have diabetes or heart disease.',
          'HbA1c: below 5.7% is normal; 6.5% or above suggests diabetes.',
          'Waist: below 90 cm for men and 80 cm for women in South Asian adults.',
          'Resting pulse: usually between 60 and 100 beats a minute.',
        ],
      },
      {
        heading: 'Small changes that help',
        body: [
          'Thirty minutes of brisk walking on most days, less salt and fried food, and stopping smoking improve every one of these numbers.',
        ],
      },
    ],
    seeDoctor: [
      'Blood pressure above 140/90 on two readings',
      'Chest pain or breathlessness on exertion',
      'A family history of heart disease before 55',
    ],
  },
  {
    slug: 'sleep-stress-blood-pressure',
    title: 'Sleep, stress and your blood pressure',
    summary: 'Why poor sleep and stress raise blood pressure, and simple steps that bring it down.',
    topic: 'Mental wellness',
    minutes: 4,
    image: 'quiet-room',
    reviewer: 'nisha-t',
    published: '2026-05-09',
    updated: '2026-08-21',
    department: 'general-medicine',
    sections: [
      {
        heading: 'The link',
        body: [
          'Stress hormones narrow blood vessels and speed up the heart. Short sleep keeps those hormones high through the day.',
        ],
      },
      {
        heading: 'What helps',
        body: ['Most adults need seven to eight hours of sleep.'],
        list: [
          'Keep regular sleep and wake times',
          'Avoid screens for an hour before bed',
          'Limit tea and coffee after 3 pm',
          'Try ten minutes of slow breathing each evening',
        ],
      },
    ],
    seeDoctor: [
      'Loud snoring with pauses in breathing',
      'Low mood or worry most days for two weeks',
      'Blood pressure that stays high despite these changes',
    ],
  },
  {
    slug: 'health-checks-by-age',
    title: 'Which health check do you need at 30, 40 and 50?',
    summary: 'The tests worth having at each stage of life, and how often to repeat them.',
    topic: 'Preventive health',
    minutes: 7,
    image: 'lab',
    reviewer: 'fathima-n',
    published: '2026-03-11',
    updated: '2026-10-02',
    department: 'general-medicine',
    sections: [
      {
        heading: 'In your 30s',
        body: ['Every two to three years:'],
        list: [
          'Blood pressure, sugar and cholesterol',
          'Thyroid test for women',
          'Pap smear every three years for women',
        ],
      },
      {
        heading: 'In your 40s',
        body: ['Every one to two years, add:'],
        list: ['ECG', 'Liver and kidney tests', 'Mammogram every two years for women'],
      },
      {
        heading: 'At 50 and beyond',
        body: ['Every year, add:'],
        list: ['Bowel cancer screening', 'Eye pressure check', 'Bone density for women after menopause'],
      },
    ],
    seeDoctor: [
      'A family history of early heart disease, diabetes or cancer',
      'Any new symptom, rather than waiting for your next check',
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

export interface Story {
  quote: string;
  who: string;
  detail: string;
  department: string;
}

/** Sample stories written for this concept website. */
export const stories: Story[] = [
  {
    quote:
      'After my heart attack, the team had me in the cath lab within an hour. Dr. Rahul explained every step to my wife while I was inside.',
    who: 'Sample patient, 58',
    detail: 'Emergency angioplasty, Cardiology',
    department: 'cardiology',
  },
  {
    quote:
      'I was walking the corridor two days after my knee replacement. The physiotherapists were so patient.',
    who: 'Sample patient, 66',
    detail: 'Knee replacement, Orthopaedics',
    department: 'orthopaedics',
  },
  {
    quote:
      'Our daughter was born six weeks early. The NICU nurses taught us how to care for her before we went home.',
    who: 'Sample parents',
    detail: 'Newborn intensive care, Paediatrics',
    department: 'paediatrics',
  },
  {
    quote:
      'My sugar had been out of control for years. In one visit I saw the doctor, the dietitian and the educator, and left with a plan I could actually follow.',
    who: 'Sample patient, 47',
    detail: 'Diabetes clinic, General Medicine',
    department: 'general-medicine',
  },
  {
    quote: 'The nurse navigator called me before every treatment. I never felt lost, even on the hard days.',
    who: 'Sample patient, 52',
    detail: 'Breast cancer care, Oncology',
    department: 'oncology',
  },
  {
    quote:
      'My father was confused and frightened. The stroke team gave him the clot-busting drug within half an hour of arriving.',
    who: 'Sample family member',
    detail: 'Stroke care, Neurology',
    department: 'neurology',
  },
];

export interface FaqGroup {
  title: string;
  items: { q: string; a: string }[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: 'Appointments',
    items: [
      {
        q: 'How do I book an appointment?',
        a: 'Book online in about two minutes, call +91 484 000 2400, or message us on WhatsApp at +91 98470 02400.',
      },
      {
        q: 'Can I change or cancel my appointment?',
        a: 'Yes. Use the link in your confirmation message, or call us. There is no charge for changes made more than two hours before.',
      },
      {
        q: 'What should I bring?',
        a: 'A photo ID, your insurance card if you have one, a list of your medicines and any previous reports or scans.',
      },
      {
        q: 'Do you offer video consultations?',
        a: 'Yes, for follow-ups and second opinions. Choose “Video” when you book.',
      },
    ],
  },
  {
    title: 'Emergency',
    items: [
      {
        q: 'Where is the emergency department?',
        a: 'Gate 2 on Market Road. It is open 24 hours, every day, with its own parking and drop-off.',
      },
      {
        q: 'Do I need to pay before treatment in an emergency?',
        a: 'No. Treatment always starts first. Paperwork and payment come later.',
      },
    ],
  },
  {
    title: 'Insurance and billing',
    items: [
      {
        q: 'Is cashless treatment available?',
        a: 'Yes, with more than 40 insurers and third-party administrators. Bring your insurance card and photo ID.',
      },
      {
        q: 'Can I get an estimate before treatment?',
        a: 'Yes. Our billing desk gives a written estimate for planned procedures.',
      },
      { q: 'How can I pay?', a: 'Cash, debit and credit cards, UPI and bank transfer.' },
    ],
  },
  {
    title: 'Staying in hospital',
    items: [
      {
        q: 'When are visiting hours?',
        a: '11 am to 1 pm and 5 pm to 7 pm. One family member can stay with a patient at any time.',
      },
      {
        q: 'Can I bring food from home?',
        a: 'Please check with the nurse first, as some patients follow special diets. Our kitchen cooks to Kerala recipes.',
      },
      { q: 'Is there parking?', a: 'Yes. Visitor parking is at Gate 1. Emergency parking is at Gate 2.' },
    ],
  },
  {
    title: 'Reports and records',
    items: [
      {
        q: 'How do I get my lab reports?',
        a: 'Reports are sent by SMS with a secure link. You can also collect printed copies at the laboratory.',
      },
      {
        q: 'Can I get a copy of my medical records?',
        a: 'Yes. Request them at the medical records desk or by email. Copies are usually ready within three working days.',
      },
    ],
  },
];

export interface Job {
  title: string;
  team: string;
  type: string;
  experience: string;
}

export const jobs: Job[] = [
  {
    title: 'Staff Nurse, Intensive Care',
    team: 'Nursing',
    type: 'Full time',
    experience: '2+ years ICU experience',
  },
  { title: 'Consultant, Neurology', team: 'Medical', type: 'Full time', experience: 'DM Neurology' },
  { title: 'Physiotherapist', team: 'Rehabilitation', type: 'Full time', experience: 'BPT, 1+ year' },
  {
    title: 'Patient Care Coordinator',
    team: 'Patient services',
    type: 'Full time',
    experience: 'Graduate, Malayalam and English',
  },
  { title: 'Pharmacist', team: 'Pharmacy', type: 'Shifts', experience: 'B.Pharm or D.Pharm, registered' },
];

export interface Programme {
  name: string;
  length: string;
  seats: string;
  text: string;
}

export const programmes: Programme[] = [
  {
    name: 'DNB Family Medicine',
    length: '3 years',
    seats: '4 seats a year',
    text: 'Training across general medicine, paediatrics, obstetrics and elder care.',
  },
  {
    name: 'Fellowship in Interventional Cardiology',
    length: '1 year',
    seats: '2 seats a year',
    text: 'Hands-on training in the 24-hour cath lab.',
  },
  {
    name: 'Critical care nursing course',
    length: '6 months',
    seats: '12 seats a year',
    text: 'For registered nurses moving into intensive care.',
  },
  {
    name: 'Continuing medical education',
    length: 'Monthly',
    seats: 'Open to all doctors',
    text: 'Evening talks and hands-on workshops in the simulation lab.',
  },
];
