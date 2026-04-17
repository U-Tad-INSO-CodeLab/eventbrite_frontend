import logoSrc from '@/assets/logo.svg';
import '@/events/components/EventLinkLogo.css';

type Props = {
  variant?: 'auth' | 'header';
};

export default function EventLinkLogo({ variant = 'auth' }: Props) {
  return (
    <img
      src={logoSrc}
      alt=""
      className={`eventlink-logo`}
      width={variant === 'auth' ? 32 : 28}
      height={variant === 'auth' ? 32 : 28}
      decoding="async"
    />
  );
}
