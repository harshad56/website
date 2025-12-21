import { Link, LinkProps } from 'react-router-dom';
import { usePrefetchOnHover } from '@/hooks/usePrefetch';

/**
 * Link component that prefetches routes on hover for instant navigation
 */
export const LinkWithPrefetch = ({ to, children, ...props }: LinkProps) => {
  const prefetchProps = usePrefetchOnHover(to as string);

  return (
    <Link to={to} {...prefetchProps} {...props}>
      {children}
    </Link>
  );
};


