import type { StaticImageData } from 'next/image';
import backwaters from '@/assets/photos/backwaters.jpg';
import childCheck from '@/assets/photos/child-check.jpg';
import consult from '@/assets/photos/consult.jpg';
import corridor from '@/assets/photos/corridor.jpg';
import ct from '@/assets/photos/ct.jpg';
import dentist from '@/assets/photos/dentist.jpg';
import derma from '@/assets/photos/derma.jpg';
import drArun from '@/assets/photos/dr-arun.jpg';
import drFathima from '@/assets/photos/dr-fathima.jpg';
import drLeena from '@/assets/photos/dr-leena.jpg';
import drMeera from '@/assets/photos/dr-meera.jpg';
import drNisha from '@/assets/photos/dr-nisha.jpg';
import drRahul from '@/assets/photos/dr-rahul.jpg';
import drVivek from '@/assets/photos/dr-vivek.jpg';
import education from '@/assets/photos/education.jpg';
import exterior from '@/assets/photos/exterior.jpg';
import hdCare from '@/assets/photos/hd-care.jpg';
import hdHeart from '@/assets/photos/hd-heart.jpg';
import hdKids from '@/assets/photos/hd-kids.jpg';
import icu from '@/assets/photos/icu.jpg';
import lab from '@/assets/photos/lab.jpg';
import lobby from '@/assets/photos/lobby.jpg';
import lounge from '@/assets/photos/lounge.jpg';
import monsoon from '@/assets/photos/monsoon.jpg';
import mri from '@/assets/photos/mri.jpg';
import nurseElder from '@/assets/photos/nurse-elder.jpg';
import ot from '@/assets/photos/ot.jpg';
import pharmacy from '@/assets/photos/pharmacy.jpg';
import physio from '@/assets/photos/physio.jpg';
import quietRoom from '@/assets/photos/quiet-room.jpg';
import room from '@/assets/photos/room.jpg';
import simlab from '@/assets/photos/simlab.jpg';
import xray from '@/assets/photos/xray.jpg';

export interface Photo {
  src: StaticImageData;
  alt: string;
  /** Default object-position for crops. */
  position?: string;
}

/**
 * Every photograph on the site. Files are stored in the repository (several were
 * retouched to remove third-party logos), so next/image can size and serve them
 * as AVIF or WebP. Replace with commissioned photography before launch.
 */
export const photos = {
  backwaters: { src: backwaters, alt: 'Palm trees on the Kerala backwaters' },
  'child-check': { src: childCheck, alt: 'A boy listening to his mother’s heartbeat with a stethoscope' },
  consult: { src: consult, alt: 'A doctor talking with a patient across her desk' },
  corridor: { src: corridor, alt: 'A nurse wheeling a cot down a bright hospital corridor' },
  ct: { src: ct, alt: 'A CT scanner in an imaging room' },
  dentist: { src: dentist, alt: 'A dentist examining a patient in the dental chair' },
  derma: { src: derma, alt: 'A dermatologist examining a patient’s skin' },
  'dr-arun': { src: drArun, alt: 'Portrait of Dr. Arun S.' },
  'dr-fathima': { src: drFathima, alt: 'Portrait of Dr. Fathima N.' },
  'dr-leena': { src: drLeena, alt: 'Portrait of Dr. Leena R.' },
  'dr-meera': { src: drMeera, alt: 'Portrait of Dr. Meera K.' },
  'dr-nisha': { src: drNisha, alt: 'Portrait of Dr. Nisha T.' },
  'dr-rahul': { src: drRahul, alt: 'Portrait of Dr. Rahul V.' },
  'dr-vivek': { src: drVivek, alt: 'Portrait of Dr. Vivek P.' },
  education: { src: education, alt: 'Doctors attending a lecture' },
  exterior: { src: exterior, alt: 'The hospital building at dusk' },
  'hd-care': { src: hdCare, alt: 'A doctor and a nurse caring for a patient during a day-care treatment' },
  'hd-heart': { src: hdHeart, alt: 'A cardiologist talking a couple through test results' },
  'hd-kids': { src: hdKids, alt: 'A paediatrician smiling at a baby on her mother’s lap' },
  icu: { src: icu, alt: 'Doctors at an intensive care bedside' },
  lab: { src: lab, alt: 'A scientist at a microscope in the laboratory' },
  lobby: { src: lobby, alt: 'The hospital reception with wooden panels and armchairs' },
  lounge: { src: lounge, alt: 'A bright family lounge with armchairs and plants' },
  monsoon: { src: monsoon, alt: 'People with umbrellas crossing a flooded street in the rain' },
  mri: { src: mri, alt: 'A radiographer helping a patient into the scanner' },
  'nurse-elder': { src: nurseElder, alt: 'A nurse laughing with an elderly patient' },
  ot: { src: ot, alt: 'Surgeons at work in a modular operation theatre' },
  pharmacy: { src: pharmacy, alt: 'A pharmacist taking medicine from the shelves' },
  physio: { src: physio, alt: 'A physiotherapist guiding a patient through a shoulder stretch' },
  'quiet-room': { src: quietRoom, alt: 'A woman resting by the window in a quiet room' },
  room: { src: room, alt: 'A single patient room with a hospital bed' },
  simlab: { src: simlab, alt: 'Doctors training at a bedside in the simulation lab' },
  xray: { src: xray, alt: 'A neurologist showing a patient his brain scan' },
} satisfies Record<string, Photo>;

export type ImageKey = keyof typeof photos;
