"use server";

import { cookies } from "next/headers";

export const setAuthCookies = async (response: {
  access_token: string;
  refresh_token: string;
  refresh_expires_at: string;
  session_id: string;
  access_expires_at: string;
}) => {
  const now = new Date().getTime();
  const cookie = await cookies();
  const refresh_expiry =
    (new Date(response.refresh_expires_at).getTime() - now) / 1000;
  const access_token_expiry =
    (new Date(response.access_expires_at).getTime() - now) / 1000;
  console.log(access_token_expiry, refresh_expiry);

  cookie.set({
    name: "access_token",
    value: response.access_token,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: access_token_expiry,
  });
  
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
  cookie.delete("refresh_token");
  cookie.delete("access_token");
};
export async function decodeJWT(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

  return payload;
}
