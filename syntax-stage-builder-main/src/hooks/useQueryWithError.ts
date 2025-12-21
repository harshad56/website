import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QueryError } from '@/components/QueryError';

/**
 * Enhanced useQuery hook that includes error display component
 * Usage:
 * const { data, error, isLoading, ErrorComponent } = useQueryWithError(...);
 * {ErrorComponent}
 */
export function useQueryWithError<TData = unknown, TError = Error>(
  ...args: Parameters<typeof useQuery<TData, TError>>
): UseQueryResult<TData, TError> & {
  ErrorComponent: JSX.Element | null;
} {
  const query = useQuery<TData, TError>(...args);

  const ErrorComponent = query.isError && query.error ? (
    <QueryError
      error={query.error as Error}
      refetch={query.refetch}
    />
  ) : null;

  return {
    ...query,
    ErrorComponent,
  };
}


