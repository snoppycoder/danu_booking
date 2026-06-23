/**
 * telebirr SuperApp (Mini App / H5) bridge adapter.
 *
 * The mini app runs inside the telebirr SuperApp's Macle container, which is
 * built on Ant's mini-program runtime and injects a global `my` object exposing
 * JSAPIs (getAuthCode, tradePay, ...). When the same page is opened in a plain
 * browser (not inside telebirr) the bridge is absent, so every call here falls
 * back gracefully to ordinary web behaviour.
 *
 * Backend contract (implemented server-side against the telebirr Fabric gateway):
 *   1. POST /payment/v1/token          -> fabric token        (ApplyFabricToken)
 *   2. POST /payment/v1/auth/authToken -> open_id / user info  (login, uses the
 *                                         SuperApp access_token from getAuthCode)
 *   3. POST /payment/v1/merchant/preOrder -> prepay/paymentUrl (RequestCreateOrder)
 * Our app talks to its own backend (/guest/payment, /payment), which performs
 * those signed Fabric calls and returns a `payment_url` we hand to tradePay.
 */

// Minimal shape of the Ant/Macle `my` global we rely on. Only the members we
// use are typed; the runtime injects many more.
type MaCallback<T> = (res: T) => void;

interface MaBridge {
  tradePay?: (opts: {
    paymentUrl?: string;
    orderStr?: string;
    tradeNO?: string;
    success?: MaCallback<{ resultCode: string }>;
    fail?: MaCallback<unknown>;
  }) => void;
  getAuthCode?: (opts: {
    scopes?: string | string[];
    success?: MaCallback<{ authCode: string }>;
    fail?: MaCallback<unknown>;
  }) => void;
}

declare global {
  interface Window {
    my?: MaBridge;
  }
}

/** True when running inside the telebirr SuperApp container. */
export function isInTelebirrSuperApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  // The Macle container injects `my`; the UA also carries a SuperApp marker.
  return (
    typeof window.my?.tradePay === "function" ||
    /telebirr|superapp|miniprogram/i.test(ua)
  );
}

/**
 * Obtain a SuperApp auth code for login. Resolves to null when not running
 * inside telebirr (callers should fall back to the normal guest/auth flow).
 */
export function getTelebirrAuthCode(): Promise<string | null> {
  return new Promise((resolve) => {
    const my = typeof window !== "undefined" ? window.my : undefined;
    if (!my?.getAuthCode) {
      resolve(null);
      return;
    }
    my.getAuthCode({
      scopes: "auth_user",
      success: (res) => resolve(res?.authCode ?? null),
      fail: () => resolve(null),
    });
  });
}

export type TelebirrPayResult = "success" | "cancelled" | "failed";

/**
 * Start a telebirr payment for the given backend-issued payment URL / prepay
 * string. Inside the SuperApp this invokes the native `my.tradePay` checkout;
 * in a plain browser it falls back to opening the H5 payment URL.
 */
export function startTelebirrPay(paymentUrl: string): Promise<TelebirrPayResult> {
  return new Promise((resolve) => {
    const my = typeof window !== "undefined" ? window.my : undefined;

    if (my?.tradePay) {
      my.tradePay({
        paymentUrl,
        success: (res) => {
          // Ant tradePay resultCode: 9000 = success, 6001 = user cancelled.
          if (res?.resultCode === "9000") resolve("success");
          else if (res?.resultCode === "6001") resolve("cancelled");
          else resolve("failed");
        },
        fail: () => resolve("failed"),
      });
      return;
    }

    // Plain-web fallback: navigate to the telebirr H5 payment page.
    if (typeof window !== "undefined" && paymentUrl) {
      window.open(paymentUrl, "_blank");
      resolve("success");
      return;
    }

    resolve("failed");
  });
}
