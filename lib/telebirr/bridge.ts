/**
 * telebirr SuperApp (Mini App / H5) bridge adapter.
 *
 * The mini app runs inside the telebirr SuperApp's Macle container, which
 * injects a global `ma` object exposing JSAPIs. Per the telebirr console
 * Access Guides these are:
 *   - ma.getAuthCode      (user authorization / login)
 *   - ma.getOpenUserInfo  (user info)
 *   - ma.tradePay         (pull up the cashier / pay)
 * Older Ant-based builds expose the same surface as `my`, so we fall back to it.
 * When opened in a plain browser (not inside telebirr) the bridge is absent and
 * every call here degrades gracefully to ordinary web behaviour.
 *
 * Backend contract (implemented server-side against the telebirr Fabric gateway):
 *   1. POST /payment/v1/token              -> fabric token
 *   2. POST /payment/v1/auth/authToken     -> open_id / user info (login)
 *   3. POST /payment/v1/merchant/preOrder  -> prepay / paymentUrl
 * Our app talks to its own backend (/guest/payment, /payment), which performs
 * those signed Fabric calls and returns a `payment_url` we hand to tradePay.
 */

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
    ma?: MaBridge;
    my?: MaBridge;
  }
}

/** The telebirr Macle bridge (`ma`), falling back to the Ant alias (`my`). */
function getBridge(): MaBridge | undefined {
  if (typeof window === "undefined") return undefined;
  return window.ma ?? window.my;
}

/** True when running inside the telebirr SuperApp container. */
export function isInTelebirrSuperApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    typeof getBridge()?.tradePay === "function" ||
    /telebirr|superapp|miniprogram/i.test(ua)
  );
}

/**
 * Obtain a SuperApp auth code for login. Resolves to null when not running
 * inside telebirr (callers should fall back to the normal guest/auth flow).
 */
export function getTelebirrAuthCode(): Promise<string | null> {
  return new Promise((resolve) => {
    const bridge = getBridge();
    if (!bridge?.getAuthCode) {
      resolve(null);
      return;
    }
    bridge.getAuthCode({
      scopes: "auth_user",
      success: (res) => resolve(res?.authCode ?? null),
      fail: () => resolve(null),
    });
  });
}

export type TelebirrPayResult = "success" | "cancelled" | "failed" | "pending";

/**
 * True only when the native telebirr cashier bridge is actually callable.
 * Use this (not the UA heuristic) to gate anything that depends on a real
 * in-container payment.
 */
export function canTelebirrTradePay(): boolean {
  return typeof getBridge()?.tradePay === "function";
}

/**
 * Start a telebirr payment for the given backend-issued payment URL / prepay
 * string. Inside the SuperApp this pulls up the native `ma.tradePay` cashier
 * and resolves with the real outcome. In a plain browser there is no completion
 * signal, so it resolves "pending" (never "success") — the caller must confirm
 * server-side before treating the booking as paid.
 */
export function startTelebirrPay(paymentUrl: string): Promise<TelebirrPayResult> {
  return new Promise((resolve) => {
    const bridge = getBridge();

    if (bridge?.tradePay) {
      bridge.tradePay({
        paymentUrl,
        success: (res) => {
          // tradePay resultCode: 9000 = success, 6001 = user cancelled.
          if (res?.resultCode === "9000") resolve("success");
          else if (res?.resultCode === "6001") resolve("cancelled");
          else resolve("failed");
        },
        fail: () => resolve("failed"),
      });
      return;
    }

    // Plain-web fallback: hand off to the telebirr H5 payment page. window.open
    // gives no completion signal, so we cannot report "success" here — the real
    // outcome is confirmed server-side. Inside a restrictive WebView `_blank`
    // may be blocked, so fall back to a same-tab navigation.
    if (typeof window !== "undefined" && paymentUrl) {
      const win = window.open(paymentUrl, "_blank");
      if (!win) window.location.assign(paymentUrl);
      resolve("pending");
      return;
    }

    resolve("failed");
  });
}
