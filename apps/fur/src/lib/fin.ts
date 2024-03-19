export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const get = (pathname: string, init?: RequestInit) =>
  fetcher(`${import.meta.env.VITE_FIN_URL}${pathname}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(init ?? {}),
  }).then(({ error, data }) => {
    if (error) {
      console.error(error);
      throw new Error(error);
    }
    return data;
  });

export const post = (pathname: string, data?: any, init?: RequestInit) =>
  fetcher(`${import.meta.env.VITE_FIN_URL}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...(init ?? {}),
  }).then(({ error, data }) => {
    if (error) {
      console.error(error);
      throw new Error(error);
    }
    return data;
  });
