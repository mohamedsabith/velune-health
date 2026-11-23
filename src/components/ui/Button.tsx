import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './Icon';

/** shadcn/ui-style variants mapped onto the Velune button styles. */
const button = cva('btn', {
  variants: {
    variant: {
      blue: 'btn-blue',
      gold: 'btn-gold',
      line: 'btn-line',
      white: 'btn-white',
      red: 'btn-red',
    },
    size: { md: '', sm: 'btn-sm' },
  },
  defaultVariants: { variant: 'blue', size: 'md' },
});

type Variants = VariantProps<typeof button>;

/** On hover the label rolls up and a fresh copy slides in from below. */
function Label({ children }: { children: ReactNode }) {
  if (typeof children !== 'string') return <>{children}</>;
  return (
    <span className="roll">
      <span data-t={children}>{children}</span>
    </span>
  );
}

interface CommonProps extends Variants {
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  icon,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<'a'>, 'href'> & { href: string }) {
  const external = /^(https?:|tel:|mailto:)/.test(href);
  const inner = (
    <>
      {icon ? <Icon name={icon} /> : null}
      <Label>{children}</Label>
    </>
  );
  if (external) {
    return (
      <a href={href} className={cn(button({ variant, size }), className)} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href as never} className={cn(button({ variant, size }), className)} {...rest}>
      {inner}
    </Link>
  );
}

export function Button({
  icon,
  variant,
  size,
  className,
  children,
  asChild,
  ...rest
}: CommonProps & ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(button({ variant, size }), className)} {...rest}>
      {asChild ? (
        children
      ) : (
        <>
          {icon ? <Icon name={icon} /> : null}
          <Label>{children}</Label>
        </>
      )}
    </Comp>
  );
}

/** Underlined text link with an arrow that nudges on hover. */
export function MoreLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href as never} className={cn('more', className)}>
      {children}
      <Icon name="arrow" />
    </Link>
  );
}
