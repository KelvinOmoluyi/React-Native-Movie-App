import React from "react";

const useFetch = <T>(fetch: () => Promise<T>,
  options?: {
    autoFetch?: boolean;
    trigger?: any[]; // dependencies to re-run fetch
  }
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetch();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  React.useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchData();
    }
  }, []);

  React.useEffect(() => {
    if (options?.trigger && options.trigger.length > 0) {
      fetchData();
    }
  }, options?.trigger ?? []);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
