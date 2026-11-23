import { ogContentType, ogSize, renderOgImage } from '@/lib/seo/og';

export const alt = 'Velune Hospital, Kochi. Care that takes its time.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: 'Multi-speciality hospital, Kochi', title: 'Care that takes its time.' });
}
