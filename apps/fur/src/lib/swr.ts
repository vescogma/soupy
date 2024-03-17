export * from "swr";

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const getter = (input: URL, init?: RequestInit) =>
  fetcher(input, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(init ?? {}),
  });

export const poster = (input: URL, data?: any, init?: RequestInit) =>
  fetcher(input, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...(init ?? {}),
  });
