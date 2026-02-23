export function decodeJWT(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8"),
    );
    return decoded;
  } catch {
    return null;
  }
}
