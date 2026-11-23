import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { photos, type ImageKey } from '@/content/images';
import { cn } from '@/lib/utils';

interface PictureProps {
  image: ImageKey;
  /** Describe the rendered width so the browser downloads the right size. */
  sizes: string;
  className?: string;
  /** Overrides the registry's alt text. Pass "" for decorative photos. */
  alt?: string;
  position?: string;
  priority?: boolean;
  /** The frame unmasks upwards as it scrolls into view. */
  reveal?: boolean;
  caption?: ReactNode;
  style?: CSSProperties;
}

/** A photograph in a rounded frame (`.pic`), optionally captioned. */
export function Picture({
  image,
  sizes,
  className,
  alt,
  position,
  priority,
  reveal,
  caption,
  style,
}: PictureProps) {
  const photo = photos[image];
  return (
    <figure
      className={cn('pic', className)}
      data-mask={reveal ? '' : undefined}
      style={{ margin: 0, ...style }}
    >
      <Image
        src={photo.src}
        alt={alt ?? photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={82}
        placeholder="blur"
        style={{ objectFit: 'cover', objectPosition: position ?? '50% 50%' }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
