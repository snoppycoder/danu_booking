// lib/auth.ts (Mini App / H5 compatible)

const setCookie = (name: string, value: string, maxAgeSeconds?: number) => {
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;

  if (maxAgeSeconds) {
    cookie += `; max-age=${maxAgeSeconds}`;
  }

  if (typeof window !== "undefined" && location.protocol === "https:") {
    cookie += "; Secure";
  }

  document.cookie = cookie;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

  return match ? decodeURIComponent(match[2]) : null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

/* -----------------------------
   SET AUTH COOKIES
------------------------------*/

export const setAuthCookies = async (response: {
  access_token: string;
  refresh_token: string;
  refresh_expires_at: string;
  session_id: string;
  access_expires_at: string;
  csrf_token: string;
}) => {
  const now = Date.now();

  const refresh_expiry =
    (new Date(response.refresh_expires_at).getTime() - now) / 1000;

  const access_token_expiry =
    (new Date(response.access_expires_at).getTime() - now) / 1000;

  setCookie("access_token", response.access_token, access_token_expiry);
  setCookie("csrf_token", response.csrf_token, access_token_expiry);
  setCookie("session_id", response.session_id, access_token_expiry);

  if (response.refresh_token) {
    setCookie("refresh_token", response.refresh_token, refresh_expiry);
  }
};

/* -----------------------------
   SET REFRESH TOKEN
------------------------------*/

export const setRefreshToken = async (
  refresh_token: string,
  refresh_expiry: number,
) => {
  setCookie("refresh_token", refresh_token, refresh_expiry);
};

/* -----------------------------
   GETTERS
------------------------------*/

export const getSessionId = async () => {
  return getCookie("session_id");
};

export const getCSRFToken = async () => {
  return getCookie("csrf_token");
};

export const getRefreshToken = async () => {
  return getCookie("refresh_token");
};

export const getAccessToken = async () => {
  return getCookie("access_token");
};

/* -----------------------------
   DELETE ALL COOKIES
------------------------------*/

export const deleteAllCookies = async () => {
  deleteCookie("refresh_token");
  deleteCookie("access_token");
  deleteCookie("session_id");
  deleteCookie("csrf_token");

  console.log("All auth cookies deleted (client-side)");
};

/* -----------------------------
   SET ACCESS TOKEN
------------------------------*/

export const setAccessToken = async (
  access_token: string,
  access_expires_at: string,
) => {
  const now = Date.now();

  const access_expiry = (new Date(access_expires_at).getTime() - now) / 1000;

  setCookie("access_token", access_token, access_expiry);
};
