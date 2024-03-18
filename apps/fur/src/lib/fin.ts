export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const get = (pathname: string, init?: RequestInit) =>
  fetcher(`http://localhost:3001${pathname}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(init ?? {}),
  });

export const post = (pathname: string, data?: any, init?: RequestInit) =>
  fetcher(`http://localhost:3001${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...(init ?? {}),
  });
