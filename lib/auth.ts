"use server";

import { cookies } from "next/headers";

export const setAuthCookies = async (response: {
  access_token: string;
  refresh_token: string;
  refresh_expires_at: string;
  session_id: string;
  access_expires_at: string;
  csrf_token: string;
}) => {
  const now = new Date().getTime();
  const cookie = await cookies();
  const refresh_expiry =
    (new Date(response.refresh_expires_at).getTime() - now) / 1000;
  const access_token_expiry =
    (new Date(response.access_expires_at).getTime() - now) / 1000;

  cookie.set({
    name: "access_token",
    value: response.access_token,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: access_token_expiry,
  });
  cookie.set({
    name: "csrf_token",
    value: response.csrf_token,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: access_token_expiry,
  });
  cookie.set({
    name: "session_id",
    value: response.session_id,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: access_token_expiry,
  });

  console.log(access_token_expiry, "access token expired at");
  if (response.refresh_token)
    cookie.set({
      name: "refresh_token",
      value: response.refresh_token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refresh_expiry,
    });
};

export const setRefreshToken = async (
  refresh_token: string,
  refresh_expiry: number,
) => {
  const cookie = await cookies();
  cookie.set({
    name: "refresh_token",
    value: refresh_token,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refresh_expiry,
  });
};
export const getSessionId = async () => {
  const cookie = await cookies();
  const session_id = cookie.get("session_id")?.value;
  return session_id;
};
export const getRefreshToken = async () => {
  const cookie = await cookies();
  const refresh_token = cookie.get("refresh_token")?.value;
  return refresh_token;
};

export const getAccessToken = async () => {
  const cookie = await cookies();
  return cookie.get("access_token")?.value;
};
export const deleteAllCookies = async () => {
  const cookie = await cookies();
  console.log(cookie);
  cookie.delete("refresh_token");
  cookie.delete("access_token");
  cookie.delete("session_id");
  cookie.delete("csrf_token");
};
export async function decodeJWT(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

  return payload;
}

export const setAccessToken = async (
  access_token: string,
  access_expires_at: string,
) => {
  const now = new Date().getTime();
  const cookie = await cookies();
  const access_expiry = (new Date(access_expires_at).getTime() - now) / 1000;

  cookie.set({
    name: "access_token",
    value: access_token,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: access_expiry,
  });
};
