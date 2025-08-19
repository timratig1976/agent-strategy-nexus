import { useAuth } from "@clerk/clerk-react";

export function useApiClient(baseUrl: string = "") {
  const { getToken } = useAuth();

  const withAuth = async (init?: RequestInit): Promise<RequestInit> => {
    const token = await getToken();
    const headers = new Headers(init?.headers || {});
    if (token) headers.set("authorization", `Bearer ${token}`);
    headers.set("content-type", "application/json");
    return { ...init, headers };
  };

  const get = async <T = any>(path: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(`${baseUrl}${path}`, await withAuth({ ...init, method: "GET" }));
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  };

  const post = async <T = any>(path: string, body?: any, init?: RequestInit): Promise<T> => {
    const res = await fetch(
      `${baseUrl}${path}`,
      await withAuth({ ...init, method: "POST", body: body ? JSON.stringify(body) : undefined })
    );
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  };

  const patch = async <T = any>(path: string, body?: any, init?: RequestInit): Promise<T> => {
    const res = await fetch(
      `${baseUrl}${path}`,
      await withAuth({ ...init, method: "PATCH", body: body ? JSON.stringify(body) : undefined })
    );
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
    return res.json();
  };

  return { get, post, patch };
}
